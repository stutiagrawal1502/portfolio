import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDayNumber, getStreak, getAvgEnergy } from '@/lib/journey'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [config, recentDays, postsCount, contentQueueCount] = await Promise.all([
      prisma.journeyConfig.findUnique({ where: { id: 'singleton' } }),
      prisma.fitnessDay.findMany({
        orderBy: { date: 'desc' },
        take: 30,
        select: { date: true, worked: true, energyBefore: true },
      }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.contentPlan.count({
        where: {
          status: { in: ['IDEA', 'DRAFTED', 'RECORDED'] },
        },
      }),
    ])

    const dayNumber = config ? getDayNumber(config.startDate) : 0
    const streak = getStreak(recentDays)
    const avgEnergy = getAvgEnergy(recentDays.slice(0, 7))

    return NextResponse.json({
      dayNumber,
      streak,
      longestStreak: config?.longestStreak ?? 0,
      postsCount,
      avgEnergy7d: avgEnergy,
      contentQueueCount,
      totalDays: config?.totalDays ?? 0,
      phase: config?.phase ?? 1,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 })
  }
}
