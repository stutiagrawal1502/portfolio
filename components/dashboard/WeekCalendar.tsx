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
  const dayOfWeek = today.getDay() // 0=Sun
  // Start from Monday
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
    <div
      className="rounded-sm p-5 border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: 'var(--muted)' }}
      >
        This Week
      </p>

      <div className="flex gap-2 justify-between">
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
