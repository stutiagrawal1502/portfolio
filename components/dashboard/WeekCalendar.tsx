'use client'

import { useRouter } from 'next/navigation'
import { DayBadge } from '@/components/ui/DayBadge'
import { isToday, formatDayDate } from '@/lib/utils'

interface DayData {
  date: Date | string
  worked: boolean
  hasPost?: boolean
}

interface WeekCalendarProps {
  days?: DayData[]
}

function getWeekDays(): Date[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function WeekCalendar({ days = [] }: WeekCalendarProps) {
  const router = useRouter()
  const weekDays = getWeekDays()

  const getDayData = (date: Date): DayData | undefined =>
    days.find(d => new Date(d.date).toDateString() === date.toDateString())

  return (
    <div style={{
      borderRadius: 2,
      padding: 20,
      border: '1px solid var(--border-solid)',
      background: 'var(--surface)',
    }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
        This Week
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        {weekDays.map((date, i) => {
          const data = getDayData(date)
          const dateStr = date.toISOString().split('T')[0]

          return (
            <DayBadge
              key={i}
              dayLabel={formatDayDate(date).split(' ')[0]}
              hasWorkout={data?.worked ?? false}
              hasPost={data?.hasPost ?? false}
              isToday={isToday(date)}
              onClick={() => router.push(`/planner/${dateStr}`)}
            />
          )
        })}
      </div>
    </div>
  )
}
