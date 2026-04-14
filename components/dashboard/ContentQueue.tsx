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
  SKIPPED: 'var(--border)',
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
      <div
        className="rounded-sm p-5 border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: 'var(--muted)' }}
        >
          Content Queue
        </p>
        <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
          No content planned this week.{' '}
          <Link href="/planner" className="hover:underline" style={{ color: 'var(--dawn-blue)' }}>
            Add some →
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-sm p-5 border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
          Content Queue
        </p>
        <Link
          href="/planner"
          className="font-mono text-xs hover:underline"
          style={{ color: 'var(--muted)' }}
        >
          Planner →
        </Link>
      </div>

      <div className="space-y-2">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="flex items-center gap-3 py-2 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <span
              className="font-mono text-xs w-14 flex-shrink-0"
              style={{ color: 'var(--muted)' }}
            >
              {formatDateShort(plan.date).split(',')[0]}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className="font-sans text-sm truncate"
                style={{ color: 'var(--ink)' }}
              >
                {plan.title ?? `${plan.type} — ${plan.platform}`}
              </p>
            </div>
            <button
              onClick={() => cycleStatus(plan)}
              className="font-mono text-xs px-2 py-0.5 rounded-sm flex-shrink-0"
              style={{
                color: statusColors[plan.status] ?? 'var(--muted)',
                border: `1px solid ${statusColors[plan.status] ?? 'var(--border)'}`,
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
