'use client'

import { useState, useEffect, useCallback } from 'react'
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: '1px solid var(--border-solid)',
  borderRadius: 7,
  padding: '9px 12px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: 'var(--ink)',
  outline: 'none',
  colorScheme: 'dark',
}

type ActiveForm = 'postIdea' | 'workout' | null

type ContentStatus = 'IDEA' | 'DRAFTED' | 'RECORDED' | 'POSTED' | 'SKIPPED'

interface ContentPlan {
  id: string
  title: string
  type: string
  platform: string
  status: ContentStatus
  notes: string | null
  date: string
}

const STATUS_COLORS: Record<ContentStatus, string> = {
  IDEA: '#C4B5FD',
  DRAFTED: '#93C5FD',
  RECORDED: '#FCD34D',
  POSTED: '#86EFAC',
  SKIPPED: '#6B7280',
}

const STATUS_NEXT: Record<ContentStatus, ContentStatus> = {
  IDEA: 'DRAFTED',
  DRAFTED: 'RECORDED',
  RECORDED: 'POSTED',
  POSTED: 'SKIPPED',
  SKIPPED: 'IDEA',
}

export default function PlannerPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear]   = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date>(today)

  // Day plans
  const [plans, setPlans]         = useState<ContentPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(false)

  // Form state
  const [activeForm, setActiveForm] = useState<ActiveForm>(null)
  const [saving, setSaving]         = useState(false)
  const [saved,  setSaved]          = useState(false)

  // Post idea fields
  const [ideaTitle,    setIdeaTitle]    = useState('')
  const [ideaType,     setIdeaType]     = useState('BLOG')
  const [ideaPlatform, setIdeaPlatform] = useState('Instagram')
  const [ideaNotes,    setIdeaNotes]    = useState('')

  // Workout fields
  const [worked,      setWorked]      = useState<'yes' | 'partial' | 'no'>('yes')
  const [workoutType, setWorkoutType] = useState('')
  const [energy,      setEnergy]      = useState(7)
  const [water,       setWater]       = useState(1.5)
  const [sleep,       setSleep]       = useState(7)
  const [wNotes,      setWNotes]      = useState('')

  const days         = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7
  const monthLabel   = new Date(currentYear, currentMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const dateStr      = selectedDate.toISOString().split('T')[0]
  const dayLabel     = selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const loadPlans = useCallback(async (date: Date) => {
    setPlansLoading(true)
    const d = date.toISOString().split('T')[0]
    // Query plans for just this day
    const start = `${d}T00:00:00.000Z`
    const end   = `${d}T23:59:59.999Z`
    try {
      const res = await fetch(`/api/content-plan?startDate=${start}&endDate=${end}`)
      if (res.ok) setPlans(await res.json())
      else setPlans([])
    } catch {
      setPlans([])
    }
    setPlansLoading(false)
  }, [])

  useEffect(() => { loadPlans(selectedDate) }, [selectedDate, loadPlans])

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const selectDay = (day: Date) => {
    setSelectedDate(day)
    setActiveForm(null)
    setSaved(false)
  }

  const toggleForm = (form: ActiveForm) => {
    setActiveForm(f => f === form ? null : form)
    setSaved(false)
  }

  const savePostIdea = async () => {
    if (!ideaTitle.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/content-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date:     dateStr,
          title:    ideaTitle.trim(),
          type:     ideaType,
          platform: ideaPlatform,
          notes:    ideaNotes || null,
          status:   'IDEA',
        }),
      })
      if (res.ok) {
        const created = await res.json()
        setPlans(p => [...p, created])
      }
      setIdeaTitle(''); setIdeaNotes('')
      setActiveForm(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const saveWorkout = async () => {
    setSaving(true)
    try {
      await fetch('/api/fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date:         dateStr,
          worked:       worked === 'yes',
          workoutType:  workoutType || null,
          energyBefore: energy,
          waterLitres:  water,
          sleepHours:   sleep,
          notes:        wNotes || null,
          isPublic:     false,
        }),
      })
      setWorkoutType(''); setWNotes('')
      setActiveForm(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const advanceStatus = async (plan: ContentPlan) => {
    const next = STATUS_NEXT[plan.status]
    const res = await fetch('/api/content-plan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, status: next }),
    })
    if (res.ok) {
      setPlans(p => p.map(x => x.id === plan.id ? { ...x, status: next } : x))
    }
  }

  const deletePlan = async (id: string) => {
    await fetch('/api/content-plan', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setPlans(p => p.filter(x => x.id !== id))
  }

  const actionButtons = [
    { key: 'postIdea' as ActiveForm, label: '+ Post Idea',    color: '#93C5FD' },
    { key: 'workout'  as ActiveForm, label: '+ Workout Log',  color: '#86EFAC' },
  ]

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
            Content planner
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
            Planner
          </h1>
        </div>
        <Link
          href="/write"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--paper)', padding: '8px 16px', borderRadius: 7, textDecoration: 'none' }}
        >
          + Write
        </Link>
      </div>

      {/* 2-col: calendar + day detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>

        {/* ── Calendar ── */}
        <div className="cockpit-card">
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <button onClick={prevMonth} style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>←</button>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--ink)', fontWeight: 600, letterSpacing: '0.04em' }}>{monthLabel}</span>
            <button onClick={nextMonth} style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>→</button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', letterSpacing: '0.08em', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
            {days.map(day => {
              const isSel   = day.toDateString() === selectedDate.toDateString()
              const itToday = isToday(day)
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => selectDay(day)}
                  style={{
                    aspectRatio: '1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'DM Mono', monospace", fontSize: 11,
                    borderRadius: 6, cursor: 'pointer', transition: 'all 0.12s',
                    background: isSel ? 'var(--ink)' : 'transparent',
                    color: isSel ? 'var(--paper)' : itToday ? '#F9A8D4' : 'var(--ink)',
                    border: itToday && !isSel ? '1px solid #F9A8D440' : '1px solid transparent',
                    fontWeight: isSel ? 600 : 400,
                  }}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-solid)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { dot: '#F9A8D4', label: 'Today' },
              { dot: '#86EFAC', label: 'Workout logged' },
              { dot: '#93C5FD', label: 'Post published' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.dot, flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', letterSpacing: '0.08em' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Day detail ── */}
        <div className="cockpit-card" style={{ minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          {/* Day header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <span className="cockpit-label" style={{ marginBottom: 4 }}>Selected day</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
                {dayLabel}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {actionButtons.map(a => (
              <button
                key={a.key}
                onClick={() => toggleForm(a.key)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color:       activeForm === a.key ? '#0F0E0C' : a.color,
                  background:  activeForm === a.key ? a.color   : `${a.color}10`,
                  border:      `1px solid ${activeForm === a.key ? a.color : a.color + '30'}`,
                  borderRadius: 6, padding: '7px 14px', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {activeForm === a.key ? '✕ Cancel' : a.label}
              </button>
            ))}
            {saved && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#86EFAC', display: 'flex', alignItems: 'center' }}>✓ Saved</span>
            )}
          </div>

          {/* ── Post Idea form ── */}
          {activeForm === 'postIdea' && (
            <div style={{ background: 'var(--paper)', border: '1px solid #93C5FD30', borderRadius: 10, padding: '16px 18px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93C5FD' }}>New post idea</span>
              <input
                style={inputStyle}
                type="text"
                value={ideaTitle}
                onChange={e => setIdeaTitle(e.target.value)}
                placeholder="Post title or idea..."
                autoFocus
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <select
                  value={ideaType}
                  onChange={e => setIdeaType(e.target.value)}
                  className="write-select"
                  style={{ width: '100%' }}
                >
                  {['BLOG', 'POEM', 'JOURNAL', 'ESSAY', 'CSR', 'SPORTS'].map(t => (
                    <option key={t} value={t}>{t.toLowerCase()}</option>
                  ))}
                </select>
                <input
                  style={inputStyle}
                  type="text"
                  value={ideaPlatform}
                  onChange={e => setIdeaPlatform(e.target.value)}
                  placeholder="Platform (Instagram…)"
                />
              </div>
              <input
                style={inputStyle}
                type="text"
                value={ideaNotes}
                onChange={e => setIdeaNotes(e.target.value)}
                placeholder="Notes (optional)"
              />
              <button
                onClick={savePostIdea}
                disabled={saving || !ideaTitle.trim()}
                style={{
                  alignSelf: 'flex-start',
                  fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  background: '#93C5FD', color: '#0F0E0C', border: 'none',
                  borderRadius: 7, padding: '9px 22px',
                  cursor: saving || !ideaTitle.trim() ? 'not-allowed' : 'pointer',
                  opacity: !ideaTitle.trim() ? 0.5 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Save idea'}
              </button>
            </div>
          )}

          {/* ── Workout form ── */}
          {activeForm === 'workout' && (
            <div style={{ background: 'var(--paper)', border: '1px solid #86EFAC30', borderRadius: 10, padding: '16px 18px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#86EFAC' }}>Log workout</span>

              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Worked out?</div>
                <div className="cockpit-btn-group">
                  {(['yes', 'partial', 'no'] as const).map(v => (
                    <button key={v} className={`cockpit-btn${worked === v ? ' active' : ''}`} onClick={() => setWorked(v)}>
                      {v === 'yes' ? 'Done' : v === 'partial' ? 'Partial' : 'Rest'}
                    </button>
                  ))}
                </div>
              </div>

              {worked !== 'no' && (
                <input
                  style={inputStyle}
                  type="text"
                  value={workoutType}
                  onChange={e => setWorkoutType(e.target.value)}
                  placeholder="What did you do? (e.g. Run 5K)"
                />
              )}

              {[
                { label: 'Energy', val: energy, setVal: setEnergy, min: 1, max: 10, step: 1,   unit: '/10', color: '#93C5FD' },
                { label: 'Water',  val: water,  setVal: setWater,  min: 0, max: 3,  step: 0.5, unit: 'L',   color: '#86EFAC' },
                { label: 'Sleep',  val: sleep,  setVal: setSleep,  min: 0, max: 10, step: 0.5, unit: 'h',   color: '#C4B5FD' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: s.color }}>{s.val}{s.unit}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.setVal(+e.target.value)} style={{ width: '100%' }} />
                </div>
              ))}

              <input
                style={inputStyle}
                type="text"
                value={wNotes}
                onChange={e => setWNotes(e.target.value)}
                placeholder="Note for the day…"
              />

              <button
                onClick={saveWorkout}
                disabled={saving}
                style={{
                  alignSelf: 'flex-start',
                  fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  background: '#86EFAC', color: '#0F0E0C', border: 'none',
                  borderRadius: 7, padding: '9px 22px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : 'Save workout'}
              </button>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-solid)', marginBottom: 16 }} />

          {/* ── Plans for this day ── */}
          {plansLoading ? (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', padding: '16px 0' }}>Loading…</div>
          ) : plans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
                {plans.length} item{plans.length !== 1 ? 's' : ''} planned
              </div>
              {plans.map(plan => (
                <div
                  key={plan.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', background: 'var(--paper)',
                    border: '1px solid var(--border-solid)', borderRadius: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {plan.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {plan.type} · {plan.platform}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => advanceStatus(plan)}
                    style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 4, cursor: 'pointer', flexShrink: 0,
                      border: `1px solid ${STATUS_COLORS[plan.status]}40`,
                      background: `${STATUS_COLORS[plan.status]}15`,
                      color: STATUS_COLORS[plan.status],
                    }}
                  >
                    {plan.status}
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6B7280',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, gap: 10 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, color: 'var(--border-solid)' }}>✦</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em' }}>
                Nothing planned for this day.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
