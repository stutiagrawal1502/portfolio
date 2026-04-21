import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-simple'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import type { PostStatus, PostType } from '@/app/generated/prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as PostType | null
  const status = searchParams.get('status') as PostStatus | null
  const slug = searchParams.get('slug')
  const id = searchParams.get('id')
  const limit = parseInt(searchParams.get('limit') ?? '50')

  // Private posts require auth
  const session = await getSession()
  const isAuthed = !!session

  const where: Record<string, unknown> = {}
  if (type) where.type = type
  if (slug) where.slug = slug
  if (id) where.id = id
  if (status) {
    where.status = status
  } else if (!isAuthed) {
    where.status = 'PUBLISHED'
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const slug = body.slug ?? generateSlug(body.title)

  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug,
        content: body.content ?? '',
        excerpt: body.excerpt ?? null,
        type: body.type ?? 'JOURNAL',
        status: body.status ?? 'DRAFT',
        mood: body.mood ?? null,
        tags: body.tags ?? [],
        pillar: body.pillar ?? null,
        coverImage: body.coverImage ?? null,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      },
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body

  if (data.status === 'PUBLISHED' && !data.publishedAt) {
    data.publishedAt = new Date()
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data,
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  try {
    await prisma.post.delete({ where: { id: body.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
