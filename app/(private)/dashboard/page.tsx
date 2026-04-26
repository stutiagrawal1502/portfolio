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
  const streak = getStreak(recentDays)
  const energyDays = recentDays.slice(0, 7).filter(
    (d): d is typeof d & { energyBefore: number } => d.energyBefore != null
  )
  const avgEnergy = energyDays.length
    ? energyDays.reduce((sum, d) => sum + d.energyBefore, 0) / energyDays.length
    : null

  const stats = [
    { label: 'Day',    value: dayNumber,                    suffix: '/180', color: '#93C5FD' },
    { label: 'Streak', value: streak,                        suffix: ' days', color: '#86EFAC' },
    { label: 'Posts',  value: postsCount,                    suffix: ' live',  color: '#FCD34D' },
    { label: 'Energy', value: avgEnergy ? avgEnergy.toFixed(1) : '—', suffix: avgEnergy ? '/10' : '', color: '#F9A8D4' },
  ]

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1280, margin: '0 auto' }}>

      {/* ── Top bar: greeting + stats ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
        {/* Greeting */}
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            Private dashboard
          </span>
          <LiveClock />
        </div>

        {/* Stat blocks */}
        <div style={{ display: 'flex', gap: 8 }}>
          {stats.map(s => (
            <div key={s.label} className="cockpit-stat-block">
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: s.color, lineHeight: 1, letterSpacing: '-0.01em' }}>
                {s.value}
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)', marginLeft: 1 }}>
                  {s.suffix}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today briefing ────────────────────────────────────────── */}
      <TodayBriefing />

      {/* ── Week calendar ──────────────────────────────────────────── */}
      <div className="cockpit-card" style={{ marginBottom: 16 }}>
        <span className="cockpit-label">This week</span>
        <WeekCalendar
          days={recentDays.map((d: { date: Date; worked: boolean; energyBefore: number | null }) => ({
            date: d.date,
            worked: d.worked,
          }))}
        />
      </div>

      {/* ── Main 2-col grid ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <QuickLog />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <QuickWrite />
          <ContentQueue />
        </div>
      </div>

      {/* ── Bottom strip ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
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
