import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getDayNumber, getStreak, getAvgEnergy, getAvgWater } from '@/lib/journey'
import { FitnessDayCard } from '@/components/content/FitnessDayCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Fitness Journey · Stuti Agrawal',
  description: '180 days. Starting from imperfect. Showing up anyway.',
}

export default async function FitnessPage() {
  const [config, days] = await Promise.all([
    prisma.journeyConfig.findUnique({ where: { id: 'singleton' } }),
    prisma.fitnessDay.findMany({
      where: { isPublic: true },
      orderBy: { date: 'desc' },
    }),
  ])

  const dayNumber = config ? getDayNumber(config.startDate) : 0
  const streak = getStreak(days)
  const avgEnergy = getAvgEnergy(days.slice(0, 7))
  const avgWater = getAvgWater(days.slice(0, 7))
  const progressPct = Math.min(100, (dayNumber / 180) * 100)

  return (
    <main className="min-h-screen pt-28 pb-32 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Stats bar */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-mono text-5xl font-light text-ink">
              Day {dayNumber}
            </span>
            <span className="font-mono text-muted text-sm">/180</span>
          </div>

          {/* Hand-drawn progress bar */}
          <div className="progress-bar-track mb-3">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 font-mono text-sm text-muted">
            <span>Streak: <strong className="text-ink">{streak}</strong> {streak === 1 ? 'day' : 'days'}</span>
            {avgEnergy != null && (
              <span>Avg energy: <strong className="text-ink">{avgEnergy}/10</strong></span>
            )}
            {avgWater != null && (
              <span>Water avg: <strong className="text-ink">{avgWater}L</strong></span>
            )}
          </div>
        </div>

        {/* About the journey */}
        <div className="mb-12 pb-8 border-b border-border">
          <p className="font-sans text-muted leading-relaxed">
            180 days. Starting from imperfect. Garden at 5am, come rain or audit season.
            This is a training log, not a highlight reel.
          </p>
          {config?.note && (
            <p className="font-display italic text-ink mt-3">{config.note}</p>
          )}
        </div>

        {/* Timeline */}
        {days.length === 0 ? (
          <p className="font-mono text-sm text-muted">
            The journey begins on {config ? new Date(config.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'soon'}.
          </p>
        ) : (
          <div>
            {days.map(day => (
              <FitnessDayCard key={day.id} day={day} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
