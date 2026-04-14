import { formatDate } from '@/lib/utils'
import { getMilestoneLabel } from '@/lib/journey'

interface FitnessDay {
  id: string
  date: Date | string
  dayNumber: number
  worked: boolean
  workoutType?: string | null
  durationMins?: number | null
  energyBefore?: number | null
  mood?: string | null
  notes?: string | null
}

interface FitnessDayCardProps {
  day: FitnessDay
}

export function FitnessDayCard({ day }: FitnessDayCardProps) {
  const milestoneLabel = getMilestoneLabel(day.dayNumber)

  if (milestoneLabel) {
    return (
      <div className="flex gap-6 py-8 items-start">
        <div className="font-mono text-4xl text-border font-light w-16 text-right flex-shrink-0">
          {day.dayNumber}
        </div>
        <div>
          <div className="milestone-stamp">
            {milestoneLabel}
          </div>
          <p className="font-mono text-xs text-muted mt-2">{formatDate(day.date)}</p>
        </div>
      </div>
    )
  }

  if (!day.worked) {
    return (
      <div className="flex gap-6 py-4 items-start border-b border-border/30">
        <div className="font-mono text-2xl text-border/60 font-light w-16 text-right flex-shrink-0">
          {day.dayNumber}
        </div>
        <div className="pt-1">
          <p className="font-mono text-xs text-border">{formatDate(day.date)}</p>
          {day.notes && (
            <p className="font-sans text-sm text-muted mt-1 italic">{day.notes}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 py-5 items-start border-b border-border/30 group">
      {/* Day number */}
      <div className="font-mono text-3xl text-muted font-light w-16 text-right flex-shrink-0 group-hover:text-ink transition-colors">
        {day.dayNumber}
      </div>

      <div className="flex-1">
        {/* Date + workout type */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs text-muted">{formatDate(day.date)}</span>
          {day.workoutType && (
            <span className="type-badge type-badge-fitness">{day.workoutType}</span>
          )}
          {day.durationMins && (
            <span className="font-mono text-xs text-muted">{day.durationMins}m</span>
          )}
        </div>

        {/* Energy + mood */}
        <div className="flex items-center gap-4 mt-1">
          {day.energyBefore != null && (
            <span className="font-mono text-xs text-muted">
              Energy: {day.energyBefore}/10
            </span>
          )}
          {day.mood && (
            <span className="mood-tag">{day.mood}</span>
          )}
        </div>

        {/* Public notes */}
        {day.notes && (
          <p className="font-sans text-sm text-muted mt-2 leading-relaxed">
            {day.notes}
          </p>
        )}
      </div>
    </div>
  )
}
