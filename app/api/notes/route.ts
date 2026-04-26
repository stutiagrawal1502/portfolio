import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')
  const search = searchParams.get('q')

  const notes = await prisma.note.findMany({
    where: {
      ...(tag ? { tags: { has: tag } } : {}),
      ...(search ? { content: { contains: search, mode: 'insensitive' } } : {}),
    },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const note = await prisma.note.create({
    data: { content: body.content ?? '', tags: body.tags ?? [] },
  })
  return NextResponse.json(note, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body
  const note = await prisma.note.update({ where: { id }, data })
  return NextResponse.json(note)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await prisma.note.delete({ where: { id: body.id } })
  return NextResponse.json({ ok: true })
}
