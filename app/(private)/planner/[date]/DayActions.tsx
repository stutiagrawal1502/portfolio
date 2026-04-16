'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DayActionsProps {
  date: string // YYYY-MM-DD
}

type ActiveForm = 'postIdea' | 'workout' | null

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

export function DayActions({ date }: DayActionsProps) {
  const router = useRouter()
  const [active, setActive]   = useState<ActiveForm>(null)
  const [saving, setSaving]   = useState(false)

  // Post Idea form state
  const [ideaTitle,    setIdeaTitle]    = useState('')
  const [ideaType,     setIdeaType]     = useState('BLOG')
  const [ideaPlatform, setIdeaPlatform] = useState('Instagram')
  const [ideaNotes,    setIdeaNotes]    = useState('')

  // Workout Note form state
  const [worked,      setWorked]      = useState<'yes' | 'partial' | 'no'>('yes')
  const [workoutType, setWorkoutType] = useState('')
  const [energy,      setEnergy]      = useState(7)
  const [water,       setWater]       = useState(1.5)
  const [sleep,       setSleep]       = useState(7)
  const [wNotes,      setWNotes]      = useState('')

  const toggle = (form: ActiveForm) => setActive(a => a === form ? null : form)

  const savePostIdea = async () => {
    if (!ideaTitle.trim()) return
    setSaving(true)
    try {
      await fetch('/api/content-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          title:    ideaTitle.trim(),
          type:     ideaType,
          platform: ideaPlatform,
          notes:    ideaNotes || null,
          status:   'IDEA',
        }),
      })
      setIdeaTitle(''); setIdeaNotes(''); setActive(null)
      router.refresh()
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
          date,
          worked:      worked === 'yes',
          workoutType: workoutType || null,
          energyBefore: energy,
          waterLitres:  water,
          sleepHours:   sleep,
          notes:        wNotes || null,
          isPublic:     false,
        }),
      })
      setWorkoutType(''); setWNotes(''); setActive(null)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const btnBase: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: 7,
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: '1px solid',
  }

  const actions = [
    { key: 'postIdea' as ActiveForm, label: '+ Post Idea',    color: '#93C5FD' },
    { key: 'workout'  as ActiveForm, label: '+ Workout Log',  color: '#86EFAC' },
  ]

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: active ? 16 : 0 }}>
        {actions.map(a => (
          <button
            key={a.key}
            onClick={() => toggle(a.key)}
            style={{
              ...btnBase,
              color:       active === a.key ? '#0F0E0C' : a.color,
              background:  active === a.key ? a.color   : `${a.color}10`,
              borderColor: active === a.key ? a.color   : `${a.color}30`,
            }}
          >
            {active === a.key ? '✕ Cancel' : a.label}
          </button>
        ))}

        {/* Write shortcuts */}
        {(['POEM', 'JOURNAL', 'BLOG'] as const).map(t => {
          const colorMap = { POEM: '#FCD34D', JOURNAL: '#86EFAC', BLOG: '#93C5FD' }
          const c = colorMap[t]
          return (
            <Link
              key={t}
              href={`/write?type=${t}`}
              style={{
                ...btnBase,
                color:       c,
                background:  `${c}10`,
                borderColor: `${c}30`,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              + {t.toLowerCase()}
            </Link>
          )
        })}
      </div>

      {/* ── Post Idea form ─────────────────────────────────────── */}
      {active === 'postIdea' && (
        <div className="cockpit-card" style={{ borderLeft: '3px solid #93C5FD', marginTop: 12 }}>
          <span className="cockpit-label" style={{ color: '#93C5FD' }}>New post idea</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                background: saving ? 'var(--border-solid)' : '#93C5FD',
                color: '#0F0E0C',
                border: 'none',
                borderRadius: 7,
                padding: '9px 22px',
                cursor: saving || !ideaTitle.trim() ? 'not-allowed' : 'pointer',
                opacity: !ideaTitle.trim() ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save idea'}
            </button>
          </div>
        </div>
      )}

      {/* ── Workout form ───────────────────────────────────────── */}
      {active === 'workout' && (
        <div className="cockpit-card" style={{ borderLeft: '3px solid #86EFAC', marginTop: 12 }}>
          <span className="cockpit-label" style={{ color: '#86EFAC' }}>Log workout</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Status toggle */}
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Worked out?</div>
              <div className="cockpit-btn-group">
                {(['yes', 'partial', 'no'] as const).map(v => (
                  <button
                    key={v}
                    className={`cockpit-btn${worked === v ? ' active' : ''}`}
                    onClick={() => setWorked(v)}
                  >
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

            {/* Sliders */}
            {[
              { label: 'Energy', val: energy,  setVal: setEnergy, min: 1, max: 10, step: 1,   unit: '/10', color: '#93C5FD' },
              { label: 'Water',  val: water,   setVal: setWater,  min: 0, max: 3,  step: 0.5, unit: 'L',   color: '#86EFAC' },
              { label: 'Sleep',  val: sleep,   setVal: setSleep,  min: 0, max: 10, step: 0.5, unit: 'h',   color: '#C4B5FD' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600, color: s.color }}>{s.val}{s.unit}</span>
                </div>
                <input
                  type="range"
                  min={s.min} max={s.max} step={s.step}
                  value={s.val}
                  onChange={e => s.setVal(+e.target.value)}
                  style={{ width: '100%' }}
                />
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
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                background: '#86EFAC',
                color: '#0F0E0C',
                border: 'none',
                borderRadius: 7,
                padding: '9px 22px',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving…' : 'Save workout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
