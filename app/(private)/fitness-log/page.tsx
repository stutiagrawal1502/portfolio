import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDayNumber, getStreak } from '@/lib/journey'
import { FitnessDayCard } from '@/components/content/FitnessDayCard'
import Link from 'next/link'

export default async function FitnessLogPage() {
  await getServerSession(authOptions)

  const [config, days] = await Promise.all([
    prisma.journeyConfig.findUnique({ where: { id: 'singleton' } }),
    prisma.fitnessDay.findMany({
      orderBy: { date: 'desc' },
    }),
  ])

  const dayNumber = config ? getDayNumber(config.startDate) : 0
  const streak = getStreak(days)
  const progressPct = Math.min(100, (dayNumber / 180) * 100)

  return (
    <main className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-normal" style={{ color: 'var(--ink)' }}>
          Fitness Log
        </h1>
        <Link
          href="/dashboard"
          className="font-mono text-xs"
          style={{ color: 'var(--muted)' }}
        >
          ← Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div
        className="rounded-sm p-5 border mb-8"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-baseline gap-3 mb-3">
          <span className="font-mono text-4xl font-light" style={{ color: 'var(--ink)' }}>
            Day {dayNumber}
          </span>
          <span className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
            /180
          </span>
        </div>
        <div className="progress-bar-track mb-3">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex gap-6 font-mono text-sm" style={{ color: 'var(--muted)' }}>
          <span>Streak: <strong style={{ color: 'var(--ink)' }}>{streak}</strong> days</span>
          <span>Total logged: <strong style={{ color: 'var(--ink)' }}>{days.length}</strong></span>
        </div>
      </div>

      {/* All days — including private */}
      <div>
        {days.length === 0 ? (
          <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
            No days logged yet.
          </p>
        ) : (
          days.map(day => <FitnessDayCard key={day.id} day={day} />)
        )}
      </div>
    </main>
  )
}
