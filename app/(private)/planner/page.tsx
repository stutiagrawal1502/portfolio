'use client'

import { useState } from 'react'
import Link from 'next/link'
import { isToday } from '@/lib/utils'

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export default function PlannerPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date>(today)

  const days = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7 // Monday = 0

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const dateStr = selectedDate.toISOString().split('T')[0]

  return (
    <main className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-normal" style={{ color: 'var(--ink)' }}>
          Planner
        </h1>
        <Link
          href="/write"
          className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-sm"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          + Write
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Calendar — left */}
        <div className="lg:col-span-2">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="font-mono text-sm" style={{ color: 'var(--muted)' }}>←</button>
            <span className="font-mono text-sm" style={{ color: 'var(--ink)' }}>{monthLabel}</span>
            <button onClick={nextMonth} className="font-mono text-sm" style={{ color: 'var(--muted)' }}>→</button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center font-mono text-xs py-1" style={{ color: 'var(--muted)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first week */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map(day => {
              const isSel = day.toDateString() === selectedDate.toDateString()
              const itToday = isToday(day)
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className="aspect-square flex items-center justify-center font-mono text-xs rounded-sm transition-all"
                  style={{
                    background: isSel ? 'var(--ink)' : 'transparent',
                    color: isSel ? 'var(--paper)' : itToday ? 'var(--dawn-rose)' : 'var(--ink)',
                    border: itToday && !isSel ? '1px solid var(--dawn-rose)' : '1px solid transparent',
                  }}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Day detail — right */}
        <div className="lg:col-span-3">
          <div
            className="rounded-sm p-6 border h-full min-h-[400px]"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-normal" style={{ color: 'var(--ink)' }}>
                {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              <Link
                href={`/planner/${dateStr}`}
                className="font-mono text-xs" style={{ color: 'var(--muted)' }}
              >
                Full view →
              </Link>
            </div>

            {/* Quick add buttons */}
            <div className="flex gap-2 mb-6">
              {['+ Post Idea', '+ Work Event', '+ Workout Note'].map(label => (
                <button
                  key={label}
                  className="font-mono text-xs uppercase tracking-wide px-3 py-1.5 border rounded-sm"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
              No items planned for this day.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
