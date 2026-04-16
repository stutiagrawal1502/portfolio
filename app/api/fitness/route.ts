import { getSession } from '@/lib/auth-simple'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const isPublicOnly = searchParams.get('public') === 'true'
  const limit = parseInt(searchParams.get('limit') ?? '90')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const session = await getSession()
  if (!session && !isPublicOnly) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const where: Record<string, unknown> = {}
  if (isPublicOnly || !session) where.isPublic = true
  if (startDate) where.date = { ...((where.date as Record<string, unknown>) ?? {}), gte: new Date(startDate) }
  if (endDate) where.date = { ...((where.date as Record<string, unknown>) ?? {}), lte: new Date(endDate) }

  try {
    const days = await prisma.fitnessDay.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
    })
    return NextResponse.json(days)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch fitness days' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Get journey config to calculate day number
  const config = await prisma.journeyConfig.findUnique({ where: { id: 'singleton' } })
  const date = body.date ? new Date(body.date) : new Date()
  const startDate = config?.startDate ?? date
  const dayNumber = Math.max(1, Math.floor(
    (date.getTime() - new Date(startDate).setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)
  ) + 1)

  try {
    const day = await prisma.fitnessDay.upsert({
      where: { date },
      update: {
        worked: body.worked ?? false,
        workoutType: body.workoutType ?? null,
        durationMins: body.durationMins ?? null,
        energyBefore: body.energyBefore ?? null,
        energyAfter: body.energyAfter ?? null,
        waterLitres: body.waterLitres ?? null,
        sleepHours: body.sleepHours ?? null,
        notes: body.notes ?? null,
        isPublic: body.isPublic ?? false,
        mood: body.mood ?? null,
      },
      create: {
        date,
        dayNumber,
        worked: body.worked ?? false,
        workoutType: body.workoutType ?? null,
        durationMins: body.durationMins ?? null,
        energyBefore: body.energyBefore ?? null,
        energyAfter: body.energyAfter ?? null,
        waterLitres: body.waterLitres ?? null,
        sleepHours: body.sleepHours ?? null,
        notes: body.notes ?? null,
        isPublic: body.isPublic ?? false,
        mood: body.mood ?? null,
      },
    })
    return NextResponse.json(day)
  } catch {
    return NextResponse.json({ error: 'Failed to save fitness day' }, { status: 500 })
  }
}
