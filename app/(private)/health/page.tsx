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

const commonMetrics = [
  { name: 'Vitamin D', unit: 'ng/mL' },
  { name: 'B12', unit: 'pg/mL' },
  { name: 'Iron (Ferritin)', unit: 'ng/mL' },
  { name: 'Hemoglobin', unit: 'g/dL' },
  { name: 'Weight', unit: 'kg' },
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
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/health?limit=30')
      .then(r => r.ok ? r.json() : [])
      .then(setMetrics)
      .catch(() => {})
  }, [])

  const handlePreset = (preset: { name: string; unit: string }) => {
    setForm(f => ({ ...f, metricName: preset.name, unit: preset.unit }))
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
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  // Group by metric name
  const grouped = metrics.reduce<Record<string, HealthMetric[]>>((acc, m) => {
    acc[m.metricName] = acc[m.metricName] ?? []
    acc[m.metricName].push(m)
    return acc
  }, {})

  return (
    <main className="min-h-screen px-6 py-8 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-normal mb-8" style={{ color: 'var(--ink)' }}>
        Health Tracker
      </h1>

      {/* Log form */}
      <div
        className="rounded-sm p-6 border mb-10"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
          Log Metric
        </p>

        {/* Preset quick-select */}
        <div className="flex flex-wrap gap-2 mb-4">
          {commonMetrics.map(preset => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="stamp-pill text-xs"
              style={{
                background: form.metricName === preset.name ? 'var(--ink)' : 'transparent',
                color: form.metricName === preset.name ? 'var(--paper)' : 'var(--ink)',
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.metricName}
              onChange={e => setForm(f => ({ ...f, metricName: e.target.value }))}
              placeholder="Metric name"
              className="bg-transparent border border-border rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
              style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={form.value}
                onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                placeholder="Value"
                step="0.1"
                className="flex-1 bg-transparent border border-border rounded-sm px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
                style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
              />
              <input
                type="text"
                value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                placeholder="Unit"
                className="w-20 bg-transparent border border-border rounded-sm px-3 py-2 font-sans text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
              />
            </div>
          </div>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="bg-transparent border border-border rounded-sm px-3 py-2 font-mono text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
          />
          <input
            type="text"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Notes (optional)"
            className="w-full bg-transparent border border-border rounded-sm px-3 py-2 font-sans text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
          />
          <button
            type="submit"
            disabled={saving || !form.value}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-sm"
            style={{
              background: saved ? 'var(--garden-green)' : 'var(--ink)',
              color: 'var(--paper)',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Log Metric'}
          </button>
        </form>
      </div>

      {/* Metrics by type */}
      {Object.entries(grouped).map(([name, records]) => (
        <div key={name} className="mb-8">
          <h2 className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--muted)' }}>
            {name}
          </h2>
          <div className="space-y-2">
            {records.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between py-2 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-light" style={{ color: 'var(--ink)' }}>
                    {m.value}
                  </span>
                  <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
                    {m.unit}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
                    {formatDate(m.date)}
                  </p>
                  {m.notes && (
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {m.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {metrics.length === 0 && (
        <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
          No metrics logged yet. Track your vitamin D, B12, and more above.
        </p>
      )}
    </main>
  )
}
