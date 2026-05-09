import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(books)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const book = await prisma.book.create({
    data: {
      id: `bk-${Date.now()}`,
      title: body.title, author: body.author,
      status: body.status ?? 'WANT_TO_READ',
      startedAt: body.startedAt ? new Date(body.startedAt) : null,
      finishedAt: body.finishedAt ? new Date(body.finishedAt) : null,
      rating: body.rating ?? null, notes: body.notes ?? null,
      quote: body.quote ?? null, coverUrl: body.coverUrl ?? null,
    },
  })
  return NextResponse.json(book, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await req.json()
  if (data.startedAt) data.startedAt = new Date(data.startedAt)
  if (data.finishedAt) data.finishedAt = new Date(data.finishedAt)
  const book = await prisma.book.update({ where: { id }, data })
  return NextResponse.json(book)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await prisma.book.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
