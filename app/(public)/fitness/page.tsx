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
    prisma.fitnessDay.findMany({ where: { isPublic: true }, orderBy: { date: 'desc' } }),
  ])

  const dayNumber = config ? getDayNumber(config.startDate) : 0
  const streak = getStreak(days)
  const avgEnergy = getAvgEnergy(days.slice(0, 7))
  const avgWater = getAvgWater(days.slice(0, 7))
  const progressPct = Math.min(100, (dayNumber / 180) * 100)
  const startLabel = config
    ? new Date(config.startDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'soon'

  return (
    <main style={{ padding: '40px 48px 96px', maxWidth: 680, margin: '0 auto' }}>

      {/* Oversized day number hero */}
      <div style={{ marginBottom: 40, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 'clamp(4rem, 12vw, 7rem)',
              fontWeight: 300,
              color: 'var(--ink)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            {dayNumber}
          </span>
          <div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 14,
                color: 'var(--muted)',
              }}
            >
              /180
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                opacity: 0.6,
              }}
            >
              days
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 16,
            color: 'var(--muted)',
            marginBottom: 20,
          }}
        >
          Starting from imperfect. Showing up anyway.
        </div>

        {/* Progress bar */}
        <div className="progress-bar-track" style={{ marginBottom: 16 }}>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            {
              label: 'Streak',
              value: streak,
              suffix: streak === 1 ? ' day' : ' days',
              color: '#16A34A',
            },
            ...(avgEnergy != null
              ? [{ label: 'Avg energy', value: avgEnergy.toFixed(1), suffix: '/10', color: '#2563EB' }]
              : []),
            ...(avgWater != null
              ? [{ label: 'Avg water', value: avgWater.toFixed(1), suffix: 'L', color: '#0891B2' }]
              : []),
          ].map(s => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: 4,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 18,
                  fontWeight: 600,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>
                  {s.suffix}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-solid)', marginBottom: 40 }} />

      {/* Context note */}
      {config?.note && (
        <blockquote
          style={{
            borderLeft: '3px solid var(--garden-green)',
            paddingLeft: 20,
            marginBottom: 40,
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 17,
            color: 'var(--muted)',
            lineHeight: 1.7,
          }}
        >
          {config.note}
        </blockquote>
      )}

      {/* Timeline */}
      {days.length === 0 ? (
        <div style={{ paddingTop: 32 }}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 18,
              color: 'var(--muted)',
              lineHeight: 1.7,
            }}
          >
            The journey begins {startLabel}.
          </p>
        </div>
      ) : (
        <div>
          {days.map(day => (
            <FitnessDayCard key={day.id} day={day} />
          ))}
        </div>
      )}
    </main>
  )
}
