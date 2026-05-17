'use client'

import { useState, useEffect, useCallback } from 'react'

interface MoodEntry { id: string; date: string; mood: number; tags: string[]; note: string | null }

const MOOD_EMOJI: Record<number, string> = {
  1: '😔', 2: '😞', 3: '😕', 4: '😐', 5: '😊',
  6: '🙂', 7: '😄', 8: '😁', 9: '🤩', 10: '✨',
}
const MOOD_COLOR = (n: number) => {
  if (n <= 3) return '#FCA5A5'
  if (n <= 5) return '#FCD34D'
  if (n <= 7) return '#86EFAC'
  return '#C4B5FD'
}

const PRESET_TAGS = ['calm', 'anxious', 'motivated', 'tired', 'focused', 'grateful', 'stressed', 'creative', 'social', 'lonely', 'excited', 'content']

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T12:00:00.000Z`
}

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function MoodPage() {
  const [entries,  setEntries]  = useState<MoodEntry[]>([])
  const [loading,  setLoading]  = useState(true)
  const [mood,     setMood]     = useState(7)
  const [tags,     setTags]     = useState<string[]>([])
  const [note,     setNote]     = useState('')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/mood?days=30')
    if (res.ok) setEntries(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Pre-fill today's entry if it exists
  useEffect(() => {
    const todayEntry = entries.find(e => e.date.startsWith(new Date().toISOString().slice(0, 10)))
    if (todayEntry) { setMood(todayEntry.mood); setTags(todayEntry.tags); setNote(todayEntry.note ?? '') }
  }, [entries])

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: todayISO(), mood, tags, note: note || null }),
    })
    if (res.ok) {
      const updated = await res.json()
      setEntries(e => {
        const existing = e.findIndex(x => x.id === updated.id)
        if (existing >= 0) { const next = [...e]; next[existing] = updated; return next }
        return [updated, ...e]
      })
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  const toggleTag = (t: string) => setTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t])

  // Build 30-day chart data
  const last30: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    last30.push(d.toISOString().slice(0, 10))
  }
  const entryByDay: Record<string, MoodEntry> = {}
  entries.forEach(e => { entryByDay[e.date.slice(0, 10)] = e })

  const avg = entries.length ? (entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1) : null
  const best = entries.length ? Math.max(...entries.map(e => e.mood)) : null
  const chartH = 80

  return (
    <div className="page-content" style={{ maxWidth: 780, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
          Emotional check-in
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
          Mood Journal
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[
          { label: '30-day avg', value: avg ?? '—', color: '#F9A8D4' },
          { label: 'Best', value: best ?? '—', color: '#C4B5FD' },
          { label: 'Logged', value: entries.length, color: 'var(--ink)' },
        ].map(s => (
          <div key={s.label} className="cockpit-stat-block" style={{ flex: 1, padding: '12px 16px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* 30-day chart */}
      <div className="cockpit-card" style={{ marginBottom: 28 }}>
        <span className="cockpit-label">30-day mood</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: chartH, paddingBottom: 4 }}>
          {last30.map(day => {
            const entry = entryByDay[day]
            const h = entry ? (entry.mood / 10) * chartH : 0
            const isToday = day === new Date().toISOString().slice(0, 10)
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' }}>
                {entry && (
                  <div
                    title={`${dayLabel(entry.date)}: ${entry.mood}/10`}
                    style={{
                      width: '100%', height: h, borderRadius: '3px 3px 0 0',
                      background: MOOD_COLOR(entry.mood),
                      opacity: isToday ? 1 : 0.75,
                      transition: 'height 0.3s',
                      cursor: 'default',
                    }}
                  />
                )}
                {isToday && (
                  <div style={{ position: 'absolute', bottom: -14, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#F9A8D4' }} />
                  </div>
                )}
                {!entry && (
                  <div style={{ width: '100%', height: 2, background: 'var(--border-solid)', borderRadius: 1 }} />
                )}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>30 days ago</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#F9A8D4' }}>Today</span>
        </div>
      </div>

      {/* Today's log */}
      <div className="cockpit-card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span className="cockpit-label" style={{ margin: 0 }}>Log today</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 24 }}>{MOOD_EMOJI[mood]}</span>
        </div>

        {/* Mood slider */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)' }}>Mood</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: MOOD_COLOR(mood) }}>{mood}/10</span>
          </div>
          <input type="range" min={1} max={10} value={mood} onChange={e => setMood(+e.target.value)} style={{ width: '100%', accentColor: MOOD_COLOR(mood) }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>Low</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>High</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Feelings</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PRESET_TAGS.map(t => (
              <button key={t} onClick={() => toggleTag(t)} style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, padding: '5px 12px', borderRadius: 20,
                cursor: 'pointer', transition: 'all 0.12s',
                border: `1px solid ${tags.includes(t) ? '#F9A8D4' : 'var(--border-solid)'}`,
                background: tags.includes(t) ? '#F9A8D420' : 'transparent',
                color: tags.includes(t) ? '#F9A8D4' : 'var(--muted)',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Anything worth noting about today? (optional)"
          rows={3}
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 8, padding: '12px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: 'var(--ink)', outline: 'none', resize: 'none', marginBottom: 14 }}
        />

        <button onClick={save} disabled={saving} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: MOOD_COLOR(mood), color: '#0F0E0C', border: 'none', borderRadius: 7, padding: '10px 24px', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving…' : saved ? '✓ Logged' : 'Log mood'}
        </button>
      </div>

      {/* Recent entries */}
      {!loading && entries.length > 0 && (
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Recent</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.slice(0, 7).map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 8 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, width: 28, textAlign: 'center' }}>{MOOD_EMOJI[e.mood]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: e.note ? 4 : 0 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>{dayLabel(e.date)}</span>
                    {e.tags.map(t => <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#F9A8D4', background: '#F9A8D415', border: '1px solid #F9A8D430', borderRadius: 4, padding: '1px 6px' }}>{t}</span>)}
                  </div>
                  {e.note && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)', margin: 0 }}>{e.note}</p>}
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: MOOD_COLOR(e.mood) }}>{e.mood}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
