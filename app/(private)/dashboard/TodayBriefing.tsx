'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Goal {
  id: string
  title: string
  area: string
}

const QUICK_ACTIONS = [
  { label: '+ Log workout',  href: '/dashboard',    color: '#86EFAC' },
  { label: '+ Write',        href: '/write',         color: '#FCD34D' },
  { label: '+ Brain dump',   href: '/notes',         color: '#C4B5FD' },
  { label: '+ Post idea',    href: '/planner',       color: '#93C5FD' },
  { label: '+ Log expense',  href: '/finance',       color: '#6EE7B7' },
]

const AREA_COLORS: Record<string, string> = {
  FITNESS:  '#86EFAC',
  CAREER:   '#93C5FD',
  CREATIVE: '#FCD34D',
  HEALTH:   '#F9A8D4',
  FINANCE:  '#6EE7B7',
  PERSONAL: '#C4B5FD',
  LEARNING: '#FB923C',
}

export function TodayBriefing() {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    fetch('/api/goals')
      .then(r => r.ok ? r.json() : [])
      .then((all: (Goal & { status: string })[]) => {
        setGoals(all.filter(g => g.status === 'ACTIVE').slice(0, 3))
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      {/* Quick actions */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 2, padding: 20 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
          Quick actions
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_ACTIONS.map(a => (
            <Link
              key={a.label}
              href={a.href}
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em',
                textTransform: 'uppercase', textDecoration: 'none',
                padding: '6px 12px', borderRadius: 6,
                border: `1px solid ${a.color}30`,
                background: `${a.color}10`,
                color: a.color, transition: 'all 0.12s',
              }}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Active goals */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 2, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Active goals
          </p>
          <Link href="/goals" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}>
            All →
          </Link>
        </div>
        {goals.length === 0 ? (
          <Link href="/goals" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textDecoration: 'none', opacity: 0.6 }}>
            + Set your first goal
          </Link>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goals.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: AREA_COLORS[g.area] ?? 'var(--muted)', flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {g.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
