'use client'

import { useState } from 'react'

type WorkoutStatus = 'yes' | 'no' | 'partial'

interface QuickLogState {
  worked: WorkoutStatus
  workoutType: string
  energy: number
  water: number
  sleep: number
  notes: string
}

function Slider({ label, value, min, max, step, unit, accent, onChange }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  accent: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          {label}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: accent }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        {/* Filled track */}
        <div style={{
          position: 'absolute', top: '50%', left: 0,
          width: `${pct}%`, height: 3,
          background: accent, borderRadius: 2,
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          transition: 'width 0.1s',
        }} />
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(+e.target.value)}
          style={{ position: 'relative', zIndex: 1 }}
        />
      </div>
    </div>
  )
}

export function QuickLog() {
  const [state, setState] = useState<QuickLogState>({
    worked: 'no',
    workoutType: '',
    energy: 6,
    water: 1.5,
    sleep: 7,
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worked: state.worked === 'yes',
          workoutType: state.workoutType || null,
          energyBefore: state.energy,
          waterLitres: state.water,
          sleepHours: state.sleep,
          notes: state.notes || null,
          isPublic: false,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const workoutOptions: { value: WorkoutStatus; label: string }[] = [
    { value: 'yes',     label: 'Done'    },
    { value: 'partial', label: 'Partial' },
    { value: 'no',      label: 'Rest'    },
  ]

  return (
    <div className="cockpit-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <span className="cockpit-label">Morning log</span>

      {/* Workout toggle */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
          Workout?
        </div>
        <div className="cockpit-btn-group">
          {workoutOptions.map(o => (
            <button
              key={o.value}
              className={`cockpit-btn${state.worked === o.value ? ' active' : ''}`}
              onClick={() => setState(s => ({ ...s, worked: o.value }))}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workout type input (only when done/partial) */}
      {state.worked !== 'no' && (
        <input
          type="text"
          className="cockpit-input"
          placeholder="What did you do?"
          value={state.workoutType}
          onChange={e => setState(s => ({ ...s, workoutType: e.target.value }))}
          style={{ marginBottom: 18 }}
        />
      )}

      {/* Sliders */}
      <Slider
        label="Energy"
        value={state.energy}
        min={1} max={10} step={1}
        unit="/10"
        accent="#93C5FD"
        onChange={v => setState(s => ({ ...s, energy: v }))}
      />
      <Slider
        label="Water"
        value={state.water}
        min={0} max={3} step={0.5}
        unit="L"
        accent="#86EFAC"
        onChange={v => setState(s => ({ ...s, water: v }))}
      />
      <Slider
        label="Sleep"
        value={state.sleep}
        min={0} max={10} step={0.5}
        unit="h"
        accent="#C4B5FD"
        onChange={v => setState(s => ({ ...s, sleep: v }))}
      />

      {/* Notes */}
      <input
        type="text"
        className="cockpit-input"
        placeholder="One-line note for today..."
        value={state.notes}
        onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
        style={{ marginBottom: 18 }}
      />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || saved}
        style={{
          width: '100%',
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          padding: '12px 0',
          border: 'none',
          borderRadius: 8,
          cursor: saving || saved ? 'not-allowed' : 'pointer',
          background: saved ? '#166534' : 'var(--ink)',
          color: saved ? '#86EFAC' : 'var(--paper)',
          transition: 'background 0.2s, color 0.2s',
          marginTop: 'auto',
        }}
      >
        {saved ? '✓  Logged' : saving ? 'Saving...' : 'Save day log'}
      </button>
    </div>
  )
}
