import { prisma } from '@/lib/prisma'
import { getDayNumber, getStreak, getMilestoneLabel } from '@/lib/journey'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function FitnessLogPage() {
  const [config, days] = await Promise.all([
    prisma.journeyConfig.findUnique({ where: { id: 'singleton' } }),
    prisma.fitnessDay.findMany({ orderBy: { date: 'desc' } }),
  ])

  const dayNumber = config ? getDayNumber(config.startDate) : 0
  const streak = getStreak(days)
  const progressPct = Math.min(100, (dayNumber / 180) * 100)
  const workedDays = days.filter(d => d.worked).length

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            Private · 180-day journey
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
            Fitness Log
          </h1>
        </div>
        <Link
          href="/write"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--paper)', padding: '8px 16px', borderRadius: 7, textDecoration: 'none' }}
        >
          + Log Today
        </Link>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Day', value: dayNumber, suffix: '/180', color: '#93C5FD' },
          { label: 'Streak', value: streak, suffix: ' days', color: '#86EFAC' },
          { label: 'Logged', value: workedDays, suffix: ' days', color: '#FCD34D' },
          { label: 'Progress', value: progressPct.toFixed(0), suffix: '%', color: '#F9A8D4' },
        ].map(s => (
          <div key={s.label} className="cockpit-stat-block">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: s.color, lineHeight: 1 }}>
              {s.value}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)', marginLeft: 1 }}>{s.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="cockpit-card" style={{ marginBottom: 24, padding: '16px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Journey progress
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#93C5FD' }}>
            Day {dayNumber} of 180
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--border-solid)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #93C5FD, #86EFAC)', borderRadius: 3, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Days list */}
      {days.length === 0 ? (
        <div className="cockpit-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>No days logged yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {days.map(day => {
            const milestone = getMilestoneLabel(day.dayNumber)

            if (milestone) {
              return (
                <div key={day.id} style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '20px 22px', margin: '8px 0', background: 'linear-gradient(135deg, #FCD34D0A, #93C5FD0A)', border: '1px solid #FCD34D30', borderRadius: 10 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 700, color: '#FCD34D', width: 56, textAlign: 'right', flexShrink: 0 }}>
                    {day.dayNumber}
                  </span>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FCD34D', padding: '4px 10px', border: '1px solid #FCD34D50', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>
                      {milestone}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
                      {formatDate(day.date)}
                    </div>
                  </div>
                </div>
              )
            }

            if (!day.worked) {
              return (
                <div key={day.id} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '12px 22px', borderBottom: '1px solid var(--border-solid)' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: 'var(--border-solid)', fontWeight: 300, width: 56, textAlign: 'right', flexShrink: 0 }}>
                    {day.dayNumber}
                  </span>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', opacity: 0.5 }}>{formatDate(day.date)}</div>
                    {day.notes && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginTop: 2 }}>{day.notes}</div>}
                  </div>
                </div>
              )
            }

            return (
              <div key={day.id} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '16px 22px', borderBottom: '1px solid var(--border-solid)' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: 'var(--muted)', fontWeight: 300, width: 56, textAlign: 'right', flexShrink: 0 }}>
                  {day.dayNumber}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>{formatDate(day.date)}</span>
                    {day.workoutType && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#86EFAC', background: '#86EFAC15', border: '1px solid #86EFAC30', borderRadius: 4, padding: '2px 8px' }}>
                        {day.workoutType}
                      </span>
                    )}
                    {day.durationMins && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>{day.durationMins}m</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: day.notes ? 6 : 0 }}>
                    {day.energyBefore != null && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#93C5FD' }}>
                        ⚡ {day.energyBefore}/10
                      </span>
                    )}
                    {day.mood && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', fontStyle: 'italic' }}>{day.mood}</span>
                    )}
                  </div>
                  {day.notes && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{day.notes}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
