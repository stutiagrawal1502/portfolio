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
      className={`flex flex-col items-center gap-1 cursor-pointer ${onClick ? 'hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      {dayLabel && (
        <span
          className={`font-mono text-xs ${isToday ? 'text-dawn-rose font-medium' : 'text-muted'}`}
        >
          {dayLabel}
        </span>
      )}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center border ${
          isToday
            ? 'border-dawn-rose border-2'
            : 'border-transparent'
        }`}
      >
        <div className="flex gap-0.5 items-center">
          {hasWorkout ? (
            <div className="w-2 h-2 rounded-full bg-garden-green" title="Worked out" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-border" title="No workout" />
          )}
          {hasPost && (
            <div className="w-1.5 h-1.5 rounded-full bg-dawn-blue" title="Post published" />
          )}
        </div>
      </div>
    </div>
  )
}
