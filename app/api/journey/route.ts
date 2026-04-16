import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDayNumber } from '@/lib/journey'

export async function GET() {
  try {
    const config = await prisma.journeyConfig.findUnique({ where: { id: 'singleton' } })
    if (!config) return NextResponse.json(null)
    const dayNumber = getDayNumber(config.startDate)
    return NextResponse.json({ ...config, dayNumber })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch journey' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  try {
    const config = await prisma.journeyConfig.upsert({
      where: { id: 'singleton' },
      update: body,
      create: {
        id: 'singleton',
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        currentStreak: body.currentStreak ?? 0,
        longestStreak: body.longestStreak ?? 0,
        totalDays: body.totalDays ?? 0,
        phase: body.phase ?? 1,
        note: body.note ?? null,
      },
    })
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: 'Failed to update journey' }, { status: 500 })
  }
}
