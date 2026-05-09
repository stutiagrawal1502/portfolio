import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })
  const priority = await prisma.dailyPriority.findUnique({ where: { date: new Date(date) } })
  return NextResponse.json(priority)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const date = new Date(body.date)
  const priority = await prisma.dailyPriority.upsert({
    where: { date },
    update: {
      p1: body.p1 ?? undefined, p2: body.p2 ?? undefined, p3: body.p3 ?? undefined,
      p1Done: body.p1Done ?? undefined, p2Done: body.p2Done ?? undefined, p3Done: body.p3Done ?? undefined,
    },
    create: {
      id: `dp-${Date.now()}`, date,
      p1: body.p1, p2: body.p2, p3: body.p3,
      p1Done: false, p2Done: false, p3Done: false,
    },
  })
  return NextResponse.json(priority)
}
