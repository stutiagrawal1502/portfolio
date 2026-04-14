interface StreakBarProps {
  streak: number
  longestStreak: number
  recentDays?: { worked: boolean }[]
}

export function StreakBar({ streak, longestStreak, recentDays = [] }: StreakBarProps) {
  const last30 = recentDays.slice(0, 30)
  const padded = Array.from({ length: 30 }, (_, i) => last30[i] ?? null)

  return (
    <div
      className="rounded-sm p-5 border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>
        Streak
      </p>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="font-mono font-light" style={{ fontSize: 48, lineHeight: 1, color: 'var(--ink)' }}>
          {streak}
        </span>
        <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>days</span>
      </div>

      {/* 30-day grid */}
      <div className="flex gap-0.5 flex-wrap mb-2">
        {padded.reverse().map((d, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{
              background: d === null
                ? 'transparent'
                : d.worked
                  ? 'var(--garden-green)'
                  : 'var(--border)',
              border: d === null ? '1px solid var(--border)' : 'none',
            }}
          />
        ))}
      </div>

      <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
        Best: {longestStreak} days
      </p>
    </div>
  )
}
