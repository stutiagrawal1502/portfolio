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

  const btn = (value: WorkoutStatus, label: string) => (
    <button
      key={value}
      onClick={() => setState(s => ({ ...s, worked: value }))}
      className="stamp-pill flex-1 text-center py-2"
      style={{
        background: state.worked === value ? 'var(--ink)' : 'transparent',
        color: state.worked === value ? 'var(--paper)' : 'var(--ink)',
      }}
    >
      {label}
    </button>
  )

  return (
    <div
      className="rounded-sm p-5 border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: 'var(--muted)' }}
      >
        Quick Log
      </p>

      {/* Workout buttons */}
      <div className="flex gap-2 mb-4">
        {btn('yes', 'Yes')}
        {btn('no', 'No')}
        {btn('partial', '½')}
      </div>

      {/* Workout type */}
      {state.worked !== 'no' && (
        <input
          type="text"
          placeholder="What did you do? (optional)"
          value={state.workoutType}
          onChange={e => setState(s => ({ ...s, workoutType: e.target.value }))}
          className="w-full bg-transparent border border-border rounded-sm px-3 py-2 font-sans text-sm text-ink placeholder-muted mb-4 focus:outline-none focus:border-ink"
          style={{ borderColor: 'var(--border)' }}
        />
      )}

      {/* Energy slider */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label className="font-mono text-xs text-muted">Energy</label>
          <span className="font-mono text-xs text-ink">{state.energy}/10</span>
        </div>
        <input
          type="range"
          min={1} max={10} step={1}
          value={state.energy}
          onChange={e => setState(s => ({ ...s, energy: +e.target.value }))}
        />
      </div>

      {/* Water slider */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label className="font-mono text-xs text-muted">Water</label>
          <span className="font-mono text-xs text-ink">{state.water}L</span>
        </div>
        <input
          type="range"
          min={0} max={3} step={0.5}
          value={state.water}
          onChange={e => setState(s => ({ ...s, water: +e.target.value }))}
        />
      </div>

      {/* Sleep slider */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label className="font-mono text-xs text-muted">Sleep</label>
          <span className="font-mono text-xs text-ink">{state.sleep}h</span>
        </div>
        <input
          type="range"
          min={0} max={9} step={0.5}
          value={state.sleep}
          onChange={e => setState(s => ({ ...s, sleep: +e.target.value }))}
        />
      </div>

      {/* Notes */}
      <input
        type="text"
        placeholder="Any notes..."
        value={state.notes}
        onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
        className="w-full bg-transparent border border-border rounded-sm px-3 py-2 font-sans text-sm text-ink placeholder-muted mb-4 focus:outline-none focus:border-ink"
        style={{ borderColor: 'var(--border)' }}
      />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || saved}
        className="w-full font-mono text-xs tracking-widest uppercase py-2.5 rounded-sm transition-all"
        style={{
          background: saved ? 'var(--garden-green)' : 'var(--ink)',
          color: 'var(--paper)',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saved ? 'Logged ✓' : saving ? 'Saving...' : 'Save Day Log'}
      </button>
    </div>
  )
}
