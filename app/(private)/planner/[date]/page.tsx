import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getDayNumber } from '@/lib/journey'
import { DayActions } from './DayActions'

const typeColors: Record<string, string> = {
  BLOG:               '#93C5FD',
  POEM:               '#FCD34D',
  JOURNAL:            '#86EFAC',
  ESSAY:              '#C4B5FD',
  CSR:                '#6EE7B7',
  SPORTS:             '#FCA5A5',
  FITNESS_REFLECTION: '#6EE7B7',
}

const statusColors: Record<string, string> = {
  IDEA:      '#FCD34D',
  DRAFTED:   '#93C5FD',
  RECORDED:  '#C4B5FD',
  POSTED:    '#86EFAC',
  SKIPPED:   '#FCA5A5',
}

export default async function DayPlannerPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  const d = new Date(date + 'T00:00:00')

  const weekday = d.toLocaleDateString('en-IN', { weekday: 'long' })
  const dayMonth = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  // Fetch content plans + fitness for this day
  const dayStart = new Date(date + 'T00:00:00.000Z')
  const dayEnd   = new Date(date + 'T23:59:59.999Z')

  const [plans, fitnessDay, config] = await Promise.all([
    prisma.contentPlan.findMany({
      where: { date: { gte: dayStart, lte: dayEnd } },
      orderBy: { createdAt: 'asc' },
    }).catch(() => []),
    prisma.fitnessDay.findFirst({
      where: { date: { gte: dayStart, lte: dayEnd } },
    }).catch(() => null),
    prisma.journeyConfig.findUnique({ where: { id: 'singleton' } }).catch(() => null),
  ])

  const dayNumber = config ? getDayNumber(config.startDate) : null

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 860, margin: '0 auto' }}>

      {/* Breadcrumb + date header */}
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/planner"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}
        >
          ← Planner
        </Link>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              {weekday}
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1, margin: 0 }}>
              {dayMonth}
            </h1>
          </div>
          {dayNumber !== null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>Journey</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: '#93C5FD', lineHeight: 1 }}>
                Day {dayNumber}
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)', marginLeft: 2 }}>/180</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <DayActions date={date} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Content plans */}
        <div className="cockpit-card" style={{ borderLeft: '3px solid #93C5FD' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="cockpit-label" style={{ margin: 0, color: '#93C5FD' }}>Content</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
              {plans.length} item{plans.length !== 1 ? 's' : ''}
            </span>
          </div>

          {plans.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, gap: 8 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: 'var(--border-solid)' }}>✦</div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Nothing planned.<br />
                <span style={{ opacity: 0.5 }}>Add a post idea above.</span>
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plans.map((plan) => {
                const typeColor  = plan.type ? (typeColors[plan.type] ?? '#86EFAC') : '#86EFAC'
                const statusColor = statusColors[plan.status] ?? 'var(--muted)'
                return (
                  <div key={plan.id} style={{ padding: '12px 14px', background: 'var(--paper)', borderRadius: 8, border: '1px solid var(--border-solid)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', lineHeight: 1.3, fontWeight: 500 }}>
                        {plan.title ?? 'Untitled'}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: statusColor, background: `${statusColor}15`, border: `1px solid ${statusColor}30`, borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {plan.status.toLowerCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {plan.type && (
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: typeColor }}>
                          {plan.type.replace('_', ' ').toLowerCase()}
                        </span>
                      )}
                      {plan.notes && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', opacity: 0.7 }}>
                          {plan.notes}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Fitness */}
        <div className="cockpit-card" style={{ borderLeft: '3px solid #86EFAC' }}>
          <span className="cockpit-label" style={{ color: '#86EFAC' }}>Fitness</span>

          {!fitnessDay ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, gap: 8 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: 'var(--border-solid)' }}>○</div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                No workout logged.<br />
                <span style={{ opacity: 0.5 }}>Log from the dashboard.</span>
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Workout status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: fitnessDay.worked ? '#86EFAC' : 'var(--muted)',
                  flexShrink: 0,
                }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
                  {fitnessDay.worked
                    ? (fitnessDay.workoutType || 'Worked out')
                    : 'Rest day'}
                </span>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Energy', value: fitnessDay.energyBefore != null ? `${fitnessDay.energyBefore}/10` : '—', color: '#93C5FD' },
                  { label: 'Water',  value: fitnessDay.waterLitres != null  ? `${fitnessDay.waterLitres}L`     : '—', color: '#86EFAC' },
                  { label: 'Sleep',  value: fitnessDay.sleepHours != null   ? `${fitnessDay.sleepHours}h`      : '—', color: '#C4B5FD' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--paper)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border-solid)' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 600, color: s.color }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {fitnessDay.notes && (
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{fitnessDay.notes}"
                </div>
              )}
              {fitnessDay.mood && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>
                  Mood: {fitnessDay.mood}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
