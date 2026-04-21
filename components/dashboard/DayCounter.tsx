'use client'

import Link from 'next/link'

interface DayCounterProps {
  dayNumber: number
  total?: number
}

export function DayCounter({ dayNumber, total = 180 }: DayCounterProps) {
  const pct = Math.min(100, (dayNumber / total) * 100)

  return (
    <Link href="/fitness-log" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{
        borderRadius: 2,
        padding: 20,
        border: '1px solid var(--border-solid)',
        background: 'var(--surface)',
      }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
          Days
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 300, fontSize: 48, lineHeight: 1, color: 'var(--ink)' }}>
            {dayNumber}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)' }}>
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
