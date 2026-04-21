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
      <div style={{ display: 'flex', gap: 24, paddingTop: 32, paddingBottom: 32, alignItems: 'flex-start' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '2.25rem', color: 'var(--border-solid)', fontWeight: 300, width: 64, textAlign: 'right', flexShrink: 0, lineHeight: 1 }}>
          {day.dayNumber}
        </div>
        <div>
          <div className="milestone-stamp">
            {milestoneLabel}
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
            {formatDate(day.date)}
          </p>
        </div>
      </div>
    )
  }

  if (!day.worked) {
    return (
      <div style={{ display: 'flex', gap: 24, paddingTop: 16, paddingBottom: 16, alignItems: 'flex-start', borderBottom: '1px solid var(--border-solid)' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '1.5rem', color: 'var(--border-solid)', fontWeight: 300, width: 64, textAlign: 'right', flexShrink: 0, lineHeight: 1 }}>
          {day.dayNumber}
        </div>
        <div style={{ paddingTop: 4 }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--border-solid)' }}>
            {formatDate(day.date)}
          </p>
          {day.notes && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
              {day.notes}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 24, paddingTop: 20, paddingBottom: 20, alignItems: 'flex-start', borderBottom: '1px solid var(--border-solid)' }}>
      {/* Day number */}
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '1.75rem', color: 'var(--muted)', fontWeight: 300, width: 64, textAlign: 'right', flexShrink: 0, lineHeight: 1 }}>
        {day.dayNumber}
      </div>

      <div style={{ flex: 1 }}>
        {/* Date + workout type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
            {formatDate(day.date)}
          </span>
          {day.workoutType && (
            <span className="type-badge type-badge-fitness">{day.workoutType}</span>
          )}
          {day.durationMins && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
              {day.durationMins}m
            </span>
          )}
        </div>

        {/* Energy + mood */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
          {day.energyBefore != null && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
              Energy: {day.energyBefore}/10
            </span>
          )}
          {day.mood && (
            <span className="mood-tag">{day.mood}</span>
          )}
        </div>

        {/* Public notes */}
        {day.notes && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>
            {day.notes}
          </p>
        )}
      </div>
    </div>
  )
}
