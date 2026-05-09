import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '30')
  const since = new Date()
  since.setDate(since.getDate() - days)
  const entries = await prisma.moodEntry.findMany({
    where: { date: { gte: since } },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const date = new Date(body.date)
  const entry = await prisma.moodEntry.upsert({
    where: { date },
    update: { mood: body.mood, tags: body.tags ?? [], note: body.note ?? null },
    create: { id: `me-${Date.now()}`, date, mood: body.mood, tags: body.tags ?? [], note: body.note ?? null },
  })
  return NextResponse.json(entry)
}
