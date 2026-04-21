interface StreakBarProps {
  streak: number
  longestStreak: number
  recentDays?: { worked: boolean }[]
}

export function StreakBar({ streak, longestStreak, recentDays = [] }: StreakBarProps) {
  const last30 = recentDays.slice(0, 30)
  const padded = Array.from({ length: 30 }, (_, i) => last30[i] ?? null)

  return (
    <div style={{
      borderRadius: 2,
      padding: 20,
      border: '1px solid var(--border-solid)',
      background: 'var(--surface)',
    }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
        Streak
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: 48, lineHeight: 1, color: 'var(--ink)' }}>
          {streak}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>days</span>
      </div>

      {/* 30-day grid */}
      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 8 }}>
        {padded.reverse().map((d, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              background: d === null
                ? 'transparent'
                : d.worked
                  ? 'var(--garden-green)'
                  : 'var(--border-solid)',
              border: d === null ? '1px solid var(--border-solid)' : 'none',
            }}
          />
        ))}
      </div>

      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
        Best: {longestStreak} days
      </p>
    </div>
  )
}
