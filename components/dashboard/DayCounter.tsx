'use client'

import Link from 'next/link'

interface DayCounterProps {
  dayNumber: number
  total?: number
}

export function DayCounter({ dayNumber, total = 180 }: DayCounterProps) {
  const pct = Math.min(100, (dayNumber / total) * 100)

  return (
    <Link href="/fitness-log" className="block group">
      <div
        className="rounded-sm p-5 border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>
          Days
        </p>
        <div className="flex items-baseline gap-1 mb-3">
          <span
            className="font-mono font-light group-hover:opacity-80 transition-opacity"
            style={{ fontSize: 48, lineHeight: 1, color: 'var(--ink)' }}
          >
            {dayNumber}
          </span>
          <span className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
            /{total}
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  )
}
