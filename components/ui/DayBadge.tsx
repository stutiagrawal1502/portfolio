interface DayBadgeProps {
  hasWorkout?: boolean
  hasPost?: boolean
  isToday?: boolean
  dayLabel?: string
  onClick?: () => void
}

export function DayBadge({
  hasWorkout = false,
  hasPost = false,
  isToday = false,
  dayLabel,
  onClick,
}: DayBadgeProps) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {dayLabel && (
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: isToday ? 'var(--dawn-rose)' : 'var(--muted)',
          fontWeight: isToday ? 600 : 400,
        }}>
          {dayLabel}
        </span>
      )}
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: isToday ? '2px solid var(--dawn-rose)' : '1px solid transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: hasWorkout ? 'var(--garden-green)' : 'var(--border-solid)',
          }} title={hasWorkout ? 'Worked out' : 'No workout'} />
          {hasPost && (
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--dawn-blue)',
            }} title="Post published" />
          )}
        </div>
      </div>
    </div>
  )
}
