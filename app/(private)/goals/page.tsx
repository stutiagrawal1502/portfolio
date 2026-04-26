'use client'

import { useState, useEffect, useCallback } from 'react'

type GoalArea = 'FITNESS' | 'CAREER' | 'CREATIVE' | 'HEALTH' | 'FINANCE' | 'PERSONAL' | 'LEARNING'
type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'DROPPED'

interface Goal {
  id: string
  title: string
  description: string | null
  area: GoalArea
  status: GoalStatus
  targetDate: string | null
  completedAt: string | null
  createdAt: string
}

const AREA_COLORS: Record<GoalArea, string> = {
  FITNESS:  '#86EFAC',
  CAREER:   '#93C5FD',
  CREATIVE: '#FCD34D',
  HEALTH:   '#F9A8D4',
  FINANCE:  '#6EE7B7',
  PERSONAL: '#C4B5FD',
  LEARNING: '#FB923C',
}

const HABITS = [
  { key: '5am',      label: '5am wake' },
  { key: 'workout',  label: 'Workout'  },
  { key: 'reading',  label: 'Reading'  },
  { key: 'nosugar',  label: 'No sugar' },
  { key: 'journal',  label: 'Journaled'},
  { key: 'water2l',  label: '2L water' },
]

interface HabitLog {
  id: string
  date: string
  habit: string
  done: boolean
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function dayLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2)
}

export default function GoalsPage() {
  // Goals state
  const [goals, setGoals]         = useState<Goal[]>([])
  const [goalsLoading, setGoalsLoading] = useState(true)
  const [areaFilter, setAreaFilter] = useState<GoalArea | 'ALL'>('ALL')
  const [showForm, setShowForm]   = useState(false)
  const [saving, setSaving]       = useState(false)

  // New goal form
  const [gTitle,      setGTitle]      = useState('')
  const [gDesc,       setGDesc]       = useState('')
  const [gArea,       setGArea]       = useState<GoalArea>('PERSONAL')
  const [gTargetDate, setGTargetDate] = useState('')

  // Habits state
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [habitSaving, setHabitSaving] = useState<string | null>(null)

  const last7 = getLast7Days()

  const loadGoals = useCallback(async () => {
    setGoalsLoading(true)
    const res = await fetch('/api/goals')
    if (res.ok) setGoals(await res.json())
    setGoalsLoading(false)
  }, [])

  const loadHabits = useCallback(async () => {
    const start = new Date()
    start.setDate(start.getDate() - 6)
    const startStr = start.toISOString().split('T')[0] + 'T00:00:00.000Z'
    const endStr   = new Date().toISOString().split('T')[0] + 'T23:59:59.999Z'
    const res = await fetch(`/api/habits?startDate=${startStr}&endDate=${endStr}`)
    if (res.ok) setHabitLogs(await res.json())
  }, [])

  useEffect(() => { loadGoals(); loadHabits() }, [loadGoals, loadHabits])

  const saveGoal = async () => {
    if (!gTitle.trim()) return
    setSaving(true)
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: gTitle.trim(), description: gDesc || null, area: gArea, targetDate: gTargetDate || null }),
    })
    if (res.ok) {
      const created = await res.json()
      setGoals(g => [...g, created])
      setGTitle(''); setGDesc(''); setGTargetDate(''); setShowForm(false)
    }
    setSaving(false)
  }

  const toggleGoalStatus = async (goal: Goal) => {
    const next: GoalStatus = goal.status === 'ACTIVE' ? 'COMPLETED' : goal.status === 'COMPLETED' ? 'PAUSED' : 'ACTIVE'
    const res = await fetch('/api/goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: goal.id, status: next }),
    })
    if (res.ok) {
      const updated = await res.json()
      setGoals(g => g.map(x => x.id === goal.id ? { ...x, ...updated } : x))
    }
  }

  const deleteGoal = async (id: string) => {
    if (!confirm('Delete this goal?')) return
    await fetch('/api/goals', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setGoals(g => g.filter(x => x.id !== id))
  }

  const toggleHabit = async (habit: string, date: string, current: boolean) => {
    const key = `${date}-${habit}`
    setHabitSaving(key)
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: `${date}T12:00:00.000Z`, habit, done: !current }),
    })
    if (res.ok) {
      const updated = await res.json()
      setHabitLogs(logs => {
        const existing = logs.find(l => l.habit === habit && l.date.startsWith(date))
        if (existing) return logs.map(l => l.id === existing.id ? { ...l, done: updated.done } : l)
        return [...logs, updated]
      })
    }
    setHabitSaving(null)
  }

  const getHabitDone = (habit: string, date: string) => {
    return habitLogs.find(l => l.habit === habit && l.date.startsWith(date))?.done ?? false
  }

  const filteredGoals = goals.filter(g => areaFilter === 'ALL' || g.area === areaFilter)
  const activeGoals = filteredGoals.filter(g => g.status === 'ACTIVE')
  const doneGoals   = filteredGoals.filter(g => g.status === 'COMPLETED')
  const otherGoals  = filteredGoals.filter(g => g.status !== 'ACTIVE' && g.status !== 'COMPLETED')

  const areas: (GoalArea | 'ALL')[] = ['ALL', 'FITNESS', 'CAREER', 'CREATIVE', 'HEALTH', 'FINANCE', 'PERSONAL', 'LEARNING']

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            180-day system
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
            Goals & Habits
          </h1>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase',
            background: showForm ? 'var(--border-solid)' : 'var(--ink)', color: showForm ? 'var(--muted)' : 'var(--paper)',
            padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Goal'}
        </button>
      </div>

      {/* New goal form */}
      {showForm && (
        <div className="cockpit-card" style={{ marginBottom: 24 }}>
          <span className="cockpit-label">New goal</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              value={gTitle}
              onChange={e => setGTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              autoFocus
              style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--ink)', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            <textarea
              value={gDesc}
              onChange={e => setGDesc(e.target.value)}
              placeholder="Why does this matter? (optional)"
              rows={2}
              style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '10px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Area</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(Object.keys(AREA_COLORS) as GoalArea[]).map(a => (
                    <button
                      key={a}
                      onClick={() => setGArea(a)}
                      style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '4px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.12s',
                        border: `1px solid ${gArea === a ? AREA_COLORS[a] : AREA_COLORS[a] + '40'}`,
                        background: gArea === a ? `${AREA_COLORS[a]}20` : 'transparent',
                        color: gArea === a ? AREA_COLORS[a] : 'var(--muted)',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Target date (optional)</div>
                <input
                  type="date"
                  value={gTargetDate}
                  onChange={e => setGTargetDate(e.target.value)}
                  style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '8px 12px', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)', outline: 'none', colorScheme: 'dark', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <button
              onClick={saveGoal}
              disabled={saving || !gTitle.trim()}
              style={{
                alignSelf: 'flex-start',
                fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                background: '#86EFAC', color: '#0F0E0C', border: 'none', borderRadius: 7, padding: '9px 22px',
                cursor: saving || !gTitle.trim() ? 'not-allowed' : 'pointer', opacity: !gTitle.trim() ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Add Goal'}
            </button>
          </div>
        </div>
      )}

      {/* ── Habit tracker ── */}
      <div className="cockpit-card" style={{ marginBottom: 24 }}>
        <span className="cockpit-label">This week's habits</span>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left', padding: '0 12px 10px 0', fontWeight: 400, width: 120 }}>Habit</th>
                {last7.map(d => (
                  <th key={d} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: d === todayStr() ? '#F9A8D4' : 'var(--muted)', textAlign: 'center', padding: '0 4px 10px', fontWeight: d === todayStr() ? 600 : 400, minWidth: 36 }}>
                    {dayLabel(d)}
                  </th>
                ))}
                <th style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', textAlign: 'center', padding: '0 0 10px 8px', fontWeight: 400 }}>7d</th>
              </tr>
            </thead>
            <tbody>
              {HABITS.map(h => {
                const weekDone = last7.filter(d => getHabitDone(h.key, d)).length
                return (
                  <tr key={h.key} style={{ borderTop: '1px solid var(--border-solid)' }}>
                    <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', padding: '10px 12px 10px 0' }}>{h.label}</td>
                    {last7.map(d => {
                      const done = getHabitDone(h.key, d)
                      const key = `${d}-${h.key}`
                      const isToday = d === todayStr()
                      return (
                        <td key={d} style={{ textAlign: 'center', padding: '8px 4px' }}>
                          <button
                            onClick={() => toggleHabit(h.key, d, done)}
                            disabled={habitSaving === key}
                            style={{
                              width: 28, height: 28, borderRadius: 6,
                              border: `1px solid ${done ? '#86EFAC' : isToday ? '#F9A8D440' : 'var(--border-solid)'}`,
                              background: done ? '#86EFAC20' : 'transparent',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              margin: '0 auto', opacity: habitSaving === key ? 0.4 : 1, transition: 'all 0.12s',
                            }}
                          >
                            {done && <span style={{ fontSize: 12, color: '#86EFAC' }}>✓</span>}
                          </button>
                        </td>
                      )
                    })}
                    <td style={{ textAlign: 'center', padding: '10px 0 10px 8px' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: weekDone >= 5 ? '#86EFAC' : weekDone >= 3 ? '#FCD34D' : 'var(--muted)' }}>
                        {weekDone}/7
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Goals ── */}
      {/* Area filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {areas.map(a => (
          <button
            key={a}
            onClick={() => setAreaFilter(a)}
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '5px 11px', borderRadius: 5, cursor: 'pointer', transition: 'all 0.12s',
              border: `1px solid ${areaFilter === a ? (a === 'ALL' ? 'var(--ink)' : AREA_COLORS[a as GoalArea]) : 'var(--border-solid)'}`,
              background: areaFilter === a ? (a === 'ALL' ? 'var(--ink)' : `${AREA_COLORS[a as GoalArea]}20`) : 'transparent',
              color: areaFilter === a ? (a === 'ALL' ? 'var(--paper)' : AREA_COLORS[a as GoalArea]) : 'var(--muted)',
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {goalsLoading ? (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', padding: '24px 0' }}>Loading…</div>
      ) : (
        <>
          {/* Active goals */}
          {activeGoals.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Active ({activeGoals.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} onToggle={toggleGoalStatus} onDelete={deleteGoal} />)}
              </div>
            </div>
          )}

          {/* Completed */}
          {doneGoals.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Completed ({doneGoals.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {doneGoals.map(goal => <GoalCard key={goal.id} goal={goal} onToggle={toggleGoalStatus} onDelete={deleteGoal} />)}
              </div>
            </div>
          )}

          {/* Paused/Dropped */}
          {otherGoals.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Paused / Dropped ({otherGoals.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {otherGoals.map(goal => <GoalCard key={goal.id} goal={goal} onToggle={toggleGoalStatus} onDelete={deleteGoal} />)}
              </div>
            </div>
          )}

          {filteredGoals.length === 0 && (
            <div className="cockpit-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: 'var(--border-solid)', marginBottom: 12 }}>✦</div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>No goals yet. Add the first one above.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function GoalCard({ goal, onToggle, onDelete }: { goal: Goal; onToggle: (g: Goal) => void; onDelete: (id: string) => void }) {
  const color = AREA_COLORS[goal.area]
  const isCompleted = goal.status === 'COMPLETED'

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
      background: 'var(--surface)', border: `1px solid ${isCompleted ? '#86EFAC20' : 'var(--border-solid)'}`,
      borderRadius: 8, opacity: goal.status === 'DROPPED' ? 0.5 : 1,
    }}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(goal)}
        style={{
          width: 22, height: 22, borderRadius: 4, flexShrink: 0, marginTop: 2,
          border: `1.5px solid ${isCompleted ? '#86EFAC' : color}`,
          background: isCompleted ? '#86EFAC20' : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isCompleted && <span style={{ fontSize: 11, color: '#86EFAC' }}>✓</span>}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 4, padding: '2px 7px' }}>
            {goal.area}
          </span>
          {goal.status !== 'ACTIVE' && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {goal.status}
            </span>
          )}
          {goal.targetDate && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>
              by {new Date(goal.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: isCompleted ? 'var(--muted)' : 'var(--ink)', textDecoration: isCompleted ? 'line-through' : 'none', marginBottom: goal.description ? 4 : 0 }}>
          {goal.title}
        </div>
        {goal.description && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>{goal.description}</p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(goal.id)}
        style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0, opacity: 0.5 }}
      >
        ✕
      </button>
    </div>
  )
}
