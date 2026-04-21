'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDateShort } from '@/lib/utils'

interface ContentPlan {
  id: string
  date: string | Date
  title?: string | null
  type: string
  platform: string
  status: string
  notes?: string | null
}

const statusColors: Record<string, string> = {
  IDEA: 'var(--muted)',
  DRAFTED: 'var(--dawn-blue)',
  RECORDED: 'var(--poem-gold)',
  POSTED: 'var(--garden-green)',
  SKIPPED: 'var(--border-solid)',
}

async function getThisWeekPlans(): Promise<ContentPlan[]> {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const res = await fetch(
    `/api/content-plan?startDate=${monday.toISOString()}&endDate=${sunday.toISOString()}`
  )
  if (!res.ok) return []
  return res.json()
}

export function ContentQueue() {
  const [plans, setPlans] = useState<ContentPlan[]>([])

  useEffect(() => {
    getThisWeekPlans().then(setPlans).catch(() => {})
  }, [])

  const cycleStatus = async (plan: ContentPlan) => {
    const order = ['IDEA', 'DRAFTED', 'RECORDED', 'POSTED', 'SKIPPED', 'IDEA']
    const next = order[order.indexOf(plan.status) + 1] ?? 'IDEA'
    const res = await fetch('/api/content-plan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, status: next }),
    })
    if (res.ok) {
      setPlans(ps => ps.map(p => p.id === plan.id ? { ...p, status: next } : p))
    }
  }

  if (!plans.length) {
    return (
      <div style={{
        borderRadius: 2,
        padding: 20,
        border: '1px solid var(--border-solid)',
        background: 'var(--surface)',
      }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
          Content Queue
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
          No content planned this week.{' '}
          <Link href="/planner" style={{ color: 'var(--dawn-blue)', textDecoration: 'none' }}>
            Add some →
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div style={{
      borderRadius: 2,
      padding: 20,
      border: '1px solid var(--border-solid)',
      background: 'var(--surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Content Queue
        </p>
        <Link
          href="/planner"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}
        >
          Planner →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: '1px solid var(--border-solid)',
            }}
          >
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: 'var(--muted)',
              width: 48,
              flexShrink: 0,
            }}>
              {formatDateShort(plan.date).split(',')[0]}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: 'var(--ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {plan.title ?? `${plan.type} — ${plan.platform}`}
              </p>
            </div>
            <button
              onClick={() => cycleStatus(plan)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.06em',
                padding: '3px 8px',
                borderRadius: 3,
                flexShrink: 0,
                cursor: 'pointer',
                background: 'transparent',
                color: statusColors[plan.status] ?? 'var(--muted)',
                border: `1px solid ${statusColors[plan.status] ?? 'var(--border-solid)'}`,
              }}
            >
              {plan.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
