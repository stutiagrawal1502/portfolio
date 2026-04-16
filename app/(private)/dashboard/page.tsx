import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDayNumber, getStreak } from '@/lib/journey'
import { DayCounter } from '@/components/dashboard/DayCounter'
import { StreakBar } from '@/components/dashboard/StreakBar'
import { QuickLog } from '@/components/dashboard/QuickLog'
import { ContentQueue } from '@/components/dashboard/ContentQueue'
import { WeekCalendar } from '@/components/dashboard/WeekCalendar'
import { QuickWrite } from '@/components/dashboard/QuickWrite'
import { HealthSnapshot } from '@/components/dashboard/HealthSnapshot'
import { LiveClock } from './LiveClock'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const [config, recentDays, postsCount] = await Promise.all([
    prisma.journeyConfig.findUnique({ where: { id: 'singleton' } }),
    prisma.fitnessDay.findMany({
      orderBy: { date: 'desc' },
      take: 30,
      select: { date: true, worked: true, energyBefore: true },
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ])

  const dayNumber = config ? getDayNumber(config.startDate) : 0
  const streak = getStreak(recentDays)
  const energyDays = recentDays.slice(0, 7).filter(
    (d): d is typeof d & { energyBefore: number } => d.energyBefore != null
  )
  const avgEnergy = energyDays.length
    ? energyDays.reduce((sum, d) => sum + d.energyBefore, 0) / energyDays.length
    : 0

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Stuti'

  return (
    <main className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-mono text-lg" style={{ color: 'var(--ink)' }}>
          Good morning, {firstName}. Day {dayNumber}.
        </h1>
        <LiveClock />
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 p-4 rounded-sm border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {[
          { label: 'Days', value: `${dayNumber}/180` },
          { label: 'Streak', value: `${streak} days` },
          { label: 'Posts', value: `${postsCount} posted` },
          { label: 'Energy', value: avgEnergy ? `${avgEnergy.toFixed(1)}/10` : '—' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--muted)' }}>
              {stat.label}
            </p>
            <p className="font-mono text-lg font-light" style={{ color: 'var(--ink)' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Week calendar */}
      <div className="mb-6">
        <WeekCalendar days={recentDays.map((d: { date: Date; worked: boolean; energyBefore: number | null }) => ({ date: d.date, worked: d.worked }))} />
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <DayCounter dayNumber={dayNumber} />
          <StreakBar
            streak={streak}
            longestStreak={config?.longestStreak ?? 0}
            recentDays={recentDays}
          />
        </div>

        {/* Middle column */}
        <div className="flex flex-col gap-6">
          <QuickLog />
          <HealthSnapshot recentEnergy={recentDays} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
          <QuickWrite />
          <ContentQueue />
        </div>
      </div>
    </main>
  )
}
