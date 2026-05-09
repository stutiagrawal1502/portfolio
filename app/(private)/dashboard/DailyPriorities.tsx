'use client'

import { useState, useEffect } from 'react'

interface Priority {
  id: string
  p1: string | null
  p2: string | null
  p3: string | null
  p1Done: boolean
  p2Done: boolean
  p3Done: boolean
}

const todayDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T12:00:00.000Z`
}

export function DailyPriorities() {
  const [data, setData]       = useState<Priority | null>(null)
  const [editing, setEditing] = useState(false)
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [p3, setP3] = useState('')
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    const d = new Date()
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T12:00:00.000Z`
    fetch(`/api/daily-priority?date=${encodeURIComponent(dateStr)}`)
      .then(r => r.ok ? r.json() : null)
      .then((p: Priority | null) => {
        if (p) { setData(p); setP1(p.p1 ?? ''); setP2(p.p2 ?? ''); setP3(p.p3 ?? '') }
        else setEditing(true)
      })
      .catch(() => setEditing(true))
  }, [])

  const save = async () => {
    if (!p1.trim() && !p2.trim() && !p3.trim()) return
    setSaving(true)
    const res = await fetch('/api/daily-priority', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: todayDate(), p1: p1 || null, p2: p2 || null, p3: p3 || null }),
    })
    if (res.ok) { setData(await res.json()); setEditing(false) }
    setSaving(false)
  }

  const toggleDone = async (field: 'p1Done' | 'p2Done' | 'p3Done') => {
    if (!data) return
    const updated = { ...data, [field]: !data[field] }
    setData(updated)
    await fetch('/api/daily-priority', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: todayDate(), [field]: updated[field] }),
    })
  }

  const items = data ? [
    { label: data.p1, done: data.p1Done, key: 'p1Done' as const },
    { label: data.p2, done: data.p2Done, key: 'p2Done' as const },
    { label: data.p3, done: data.p3Done, key: 'p3Done' as const },
  ].filter(i => i.label) : []

  const allDone = items.length > 0 && items.every(i => i.done)

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 2, padding: 20, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: allDone ? '#86EFAC' : 'linear-gradient(90deg, #F9A8D4, #FCD34D)' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          {allDone ? '✦ All done today' : "Today's 3 things"}
        </p>
        <button
          onClick={() => setEditing(e => !e)}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
        >
          {editing ? 'cancel' : 'edit'}
        </button>
      </div>

      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { num: '01', val: p1, set: setP1, ph: 'Most important thing today…' },
            { num: '02', val: p2, set: setP2, ph: 'Second priority…' },
            { num: '03', val: p3, set: setP3, ph: 'Third priority…' },
          ].map(item => (
            <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#F9A8D4', width: 18, flexShrink: 0 }}>{item.num}</span>
              <input
                value={item.val}
                onChange={e => item.set(e.target.value)}
                placeholder={item.ph}
                onKeyDown={e => { if (e.key === 'Enter') save() }}
                style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-solid)', padding: '4px 0', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--ink)', outline: 'none' }}
              />
            </div>
          ))}
          <button
            onClick={save}
            disabled={saving || (!p1.trim() && !p2.trim() && !p3.trim())}
            style={{ alignSelf: 'flex-end', marginTop: 4, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: '#F9A8D4', color: '#0F0E0C', border: 'none', borderRadius: 5, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }}
          >
            {saving ? '…' : 'Set'}
          </button>
        </div>
      ) : items.length === 0 ? (
        <button
          onClick={() => setEditing(true)}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', background: 'none', border: '1px dashed var(--border-solid)', borderRadius: 6, padding: '10px 16px', cursor: 'pointer', width: '100%', opacity: 0.5 }}
        >
          + Set today's 3 priorities
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <button
              key={item.key}
              onClick={() => toggleDone(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: item.done ? '#86EFAC' : '#F9A8D4', width: 18, flexShrink: 0 }}>
                {item.done ? '✓' : `0${i + 1}`}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: item.done ? 'var(--muted)' : 'var(--ink)', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
