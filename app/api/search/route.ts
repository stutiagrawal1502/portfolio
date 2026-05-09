import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ posts: [], notes: [], goals: [] })

  const [posts, notes, goals] = await Promise.all([
    prisma.post.findMany({
      where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }] },
      select: { id: true, title: true, type: true, status: true, slug: true, updatedAt: true },
      take: 8,
    }),
    prisma.note.findMany({
      where: { content: { contains: q, mode: 'insensitive' } },
      select: { id: true, content: true, tags: true, updatedAt: true },
      take: 6,
    }),
    prisma.goal.findMany({
      where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] },
      select: { id: true, title: true, area: true, status: true },
      take: 4,
    }),
  ])

  return NextResponse.json({ posts, notes, goals })
}
