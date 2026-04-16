'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

interface HealthMetric {
  id: string
  date: string | Date
  metricName: string
  value: number
  unit: string
  notes?: string | null
}

const presets = [
  { name: 'Vitamin D', unit: 'ng/mL',  accent: '#FCD34D' },
  { name: 'B12',       unit: 'pg/mL',  accent: '#93C5FD' },
  { name: 'Ferritin',  unit: 'ng/mL',  accent: '#F9A8D4' },
  { name: 'Hb',        unit: 'g/dL',   accent: '#FCA5A5' },
  { name: 'Weight',    unit: 'kg',     accent: '#86EFAC' },
]

export default function HealthPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [form, setForm] = useState({
    metricName: 'Vitamin D',
    value: '',
    unit: 'ng/mL',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    fetch('/api/health?limit=50')
      .then(r => r.ok ? r.json() : [])
      .then(setMetrics)
      .catch(() => {})
  }, [])

  const selectedPreset = presets.find(p => p.name === form.metricName)
  const accent = selectedPreset?.accent ?? '#86EFAC'

  const handlePreset = (p: typeof presets[0]) => {
    setForm(f => ({ ...f, metricName: p.name, unit: p.unit }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.value) return
    setSaving(true)
    try {
      const res = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metricName: form.metricName,
          value: parseFloat(form.value),
          unit: form.unit,
          date: form.date,
          notes: form.notes || null,
        }),
      })
      const metric = await res.json()
      setMetrics(ms => [metric, ...ms])
      setForm(f => ({ ...f, value: '', notes: '' }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const grouped = metrics.reduce<Record<string, HealthMetric[]>>((acc, m) => {
    acc[m.metricName] = acc[m.metricName] ?? []
    acc[m.metricName].push(m)
    return acc
  }, {})

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

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
          Health tracker
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
          Body metrics
        </h1>
      </div>

      {/* Log form card */}
      <div className="cockpit-card" style={{ marginBottom: 28, borderLeft: `3px solid ${accent}` }}>
        <span className="cockpit-label">Log metric</span>

        {/* Preset buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => handlePreset(p)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.06em',
                padding: '5px 12px',
                border: `1px solid ${form.metricName === p.name ? p.accent : 'var(--border-solid)'}`,
                borderRadius: 6,
                background: form.metricName === p.name ? `${p.accent}18` : 'transparent',
                color: form.metricName === p.name ? p.accent : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Metric name + value + unit row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', gap: 10 }}>
            <input
              style={inputStyle}
              type="text"
              value={form.metricName}
              onChange={e => setForm(f => ({ ...f, metricName: e.target.value }))}
              placeholder="Metric name"
            />
            <input
              style={{ ...inputStyle, textAlign: 'right' }}
              type="number"
              value={form.value}
              onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
              placeholder="Value"
              step="0.1"
              required
            />
            <input
              style={{ ...inputStyle, textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 12 }}
              type="text"
              value={form.unit}
              onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
              placeholder="Unit"
            />
          </div>

          {/* Date + notes row */}
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10 }}>
            <input
              style={{ ...inputStyle, fontFamily: "'DM Mono', monospace", fontSize: 13 }}
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
            <input
              style={inputStyle}
              type="text"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Notes (optional)"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !form.value}
            style={{
              alignSelf: 'flex-start',
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              background: saved ? '#166534' : accent,
              color: saved ? '#86EFAC' : '#0F0E0C',
              border: 'none',
              borderRadius: 7,
              padding: '10px 24px',
              cursor: saving || !form.value ? 'not-allowed' : 'pointer',
              opacity: !form.value ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {saved ? '✓ Saved' : saving ? 'Saving...' : 'Log metric'}
          </button>
        </form>
      </div>

      {/* Metrics history */}
      {Object.keys(grouped).length === 0 ? (
        <div className="cockpit-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
            No metrics logged yet.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', marginTop: 8, opacity: 0.6 }}>
            Track vitamin D, B12, iron levels, and more.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Object.entries(grouped).map(([name, records]) => {
            const p = presets.find(pr => pr.name === name)
            const col = p?.accent ?? '#86EFAC'
            return (
              <div key={name} className="cockpit-card" style={{ borderLeft: `3px solid ${col}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: col, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {name}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
                    {records[0].unit}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {records.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-solid)' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>
                          {m.value}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
                          {m.unit}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
                          {formatDate(m.date)}
                        </div>
                        {m.notes && (
                          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', opacity: 0.7, marginTop: 2 }}>
                            {m.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
