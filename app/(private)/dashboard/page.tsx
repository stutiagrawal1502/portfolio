import { prisma } from '@/lib/prisma'
import { getDayNumber, getStreak } from '@/lib/journey'
import { QuickLog } from '@/components/dashboard/QuickLog'
import { ContentQueue } from '@/components/dashboard/ContentQueue'
import { WeekCalendar } from '@/components/dashboard/WeekCalendar'
import { QuickWrite } from '@/components/dashboard/QuickWrite'
import { HealthSnapshot } from '@/components/dashboard/HealthSnapshot'
import { StreakBar } from '@/components/dashboard/StreakBar'
import { QuickFinance } from '@/components/dashboard/QuickFinance'
import { LiveClock } from './LiveClock'
import { TodayBriefing } from './TodayBriefing'
import { DailyPriorities } from './DailyPriorities'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
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
  const streak    = getStreak(recentDays)
  const energyDays = recentDays.slice(0, 7).filter(
    (d): d is typeof d & { energyBefore: number } => d.energyBefore != null
  )
  const avgEnergy = energyDays.length
    ? energyDays.reduce((s, d) => s + d.energyBefore, 0) / energyDays.length
    : null

  const stats = [
    { label: 'Day',    value: dayNumber,                               suffix: '/180', color: '#93C5FD' },
    { label: 'Streak', value: streak,                                  suffix: 'd',    color: '#86EFAC' },
    { label: 'Posts',  value: postsCount,                              suffix: ' live', color: '#FCD34D' },
    { label: 'Energy', value: avgEnergy ? avgEnergy.toFixed(1) : '—', suffix: avgEnergy ? '/10' : '', color: '#F9A8D4' },
  ]

  return (
    <div style={{ padding: '16px 20px 20px', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Header: greeting + stats ───────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 2 }}>
            Private dashboard
          </span>
          <LiveClock />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                {s.value}
                <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--muted)', marginLeft: 1 }}>{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 1: Priorities + Goals + Week calendar ──────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1.4fr)', gap: 8, marginBottom: 8 }}>
        <DailyPriorities />
        <TodayBriefing />
        <div className="cockpit-card">
          <span className="cockpit-label">This week</span>
          <WeekCalendar
            days={recentDays.map((d: { date: Date; worked: boolean; energyBefore: number | null }) => ({
              date: d.date,
              worked: d.worked,
            }))}
          />
        </div>
      </div>

      {/* ── Row 2: Morning Log + Quick Write + Content Queue ────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)', gap: 8, marginBottom: 8 }}>
        <QuickLog />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <QuickWrite />
          <ContentQueue />
        </div>
      </div>

      {/* ── Row 3: Streak + Health + Quick Expense ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
        <StreakBar
          streak={streak}
          longestStreak={config?.longestStreak ?? 0}
          recentDays={recentDays}
        />
        <HealthSnapshot recentEnergy={recentDays} />
        <QuickFinance />
      </div>
    </div>
  )
}
