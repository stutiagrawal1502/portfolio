import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const logs = await prisma.habitLog.findMany({
    where: {
      ...(startDate && endDate
        ? { date: { gte: new Date(startDate), lte: new Date(endDate) } }
        : {}),
    },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const log = await prisma.habitLog.upsert({
    where: { date_habit: { date: new Date(body.date), habit: body.habit } },
    update: { done: body.done, note: body.note ?? null },
    create: {
      date: new Date(body.date),
      habit: body.habit,
      done: body.done ?? false,
      note: body.note ?? null,
    },
  })
  return NextResponse.json(log)
}
