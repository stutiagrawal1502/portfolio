'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Goal { id: string; title: string; area: string }

const AREA_COLORS: Record<string, string> = {
  FITNESS: '#86EFAC', CAREER: '#93C5FD', CREATIVE: '#FCD34D',
  HEALTH: '#F9A8D4', FINANCE: '#6EE7B7', PERSONAL: '#C4B5FD', LEARNING: '#FB923C',
}

export function TodayBriefing() {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    fetch('/api/goals')
      .then(r => r.ok ? r.json() : [])
      .then((all: (Goal & { status: string })[]) => setGoals(all.filter(g => g.status === 'ACTIVE').slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 2, padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #93C5FD, #C4B5FD)' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Active goals
        </p>
        <Link href="/goals" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}>
          All →
        </Link>
      </div>
      {goals.length === 0 ? (
        <Link href="/goals" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textDecoration: 'none', opacity: 0.5 }}>
          + Set your first goal
        </Link>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {goals.map(g => (
            <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: AREA_COLORS[g.area] ?? 'var(--muted)', flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {g.title}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: AREA_COLORS[g.area] ?? 'var(--muted)', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
                {g.area}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
