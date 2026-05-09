'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'

interface ReviewData {
  id?: string
  weekStart: string
  rating: number | null
  wentWell: string | null
  improved: string | null
  intention: string | null
}

interface WeekStats {
  streak: number
  habitsDone: number
  postsWritten: number
  avgMood: number | null
}

function getWeekStart(offset = 0): Date {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + 1 - offset * 7) // Monday
  d.setHours(0, 0, 0, 0)
  return d
}

function weekLabel(d: Date): string {
  const end = new Date(d)
  end.setDate(end.getDate() + 6)
  const fmt = (x: Date) => x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return `${fmt(d)} — ${fmt(end)}`
}

const RATING_LABELS: Record<number, string> = {
  1: 'Terrible', 2: 'Rough', 3: 'Hard', 4: 'Below avg',
  5: 'Okay', 6: 'Decent', 7: 'Good', 8: 'Great', 9: 'Excellent', 10: 'Perfect',
}

const SECTION_PROMPTS = {
  wentWell: [
    'What worked really well this week?',
    'Which moment made you feel most alive?',
    'What are you proud of, even quietly?',
  ],
  improved: [
    'What held you back this week?',
    'Where did you lose focus or energy?',
    'What would you do differently?',
  ],
  intention: [
    'What\'s the one thing that matters most next week?',
    'What do you want to feel by Sunday?',
    'What will you protect at all costs?',
  ],
}

function ReviewPageInner() {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekStart = getWeekStart(weekOffset)
  const weekStr   = weekStart.toISOString()

  const [review,   setReview]   = useState<ReviewData | null>(null)
  const [stats,    setStats]    = useState<WeekStats | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  // Form state
  const [rating,    setRating]    = useState<number>(7)
  const [wentWell,  setWentWell]  = useState('')
  const [improved,  setImproved]  = useState('')
  const [intention, setIntention] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/weekly-review?weekStart=${encodeURIComponent(weekStr)}`)
    if (res.ok) {
      const data: ReviewData | null = await res.json()
      if (data) {
        setReview(data)
        setRating(data.rating ?? 7)
        setWentWell(data.wentWell ?? '')
        setImproved(data.improved ?? '')
        setIntention(data.intention ?? '')
      } else {
        setReview(null)
        setRating(7); setWentWell(''); setImproved(''); setIntention('')
      }
    }
    // Load week stats from existing APIs
    const start = weekStart.toISOString()
    const end   = new Date(weekStart.getTime() + 6 * 86400000).toISOString()
    const [habitRes, moodRes] = await Promise.all([
      fetch(`/api/habits?startDate=${start}&endDate=${end}`),
      fetch(`/api/mood?days=7`),
    ])
    let habitsDone = 0
    if (habitRes.ok) {
      const logs: { done: boolean }[] = await habitRes.json()
      habitsDone = logs.filter(l => l.done).length
    }
    let avgMood: number | null = null
    if (moodRes.ok) {
      const moods: { mood: number }[] = await moodRes.json()
      if (moods.length) avgMood = moods.reduce((s, m) => s + m.mood, 0) / moods.length
    }
    setStats({ streak: 0, habitsDone, postsWritten: 0, avgMood })
  }, [weekStr, weekStart])

  useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/weekly-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekStart: weekStr, rating, wentWell: wentWell || null, improved: improved || null, intention: intention || null }),
    })
    if (res.ok) { setReview(await res.json()); setSaved(true); setTimeout(() => setSaved(false), 2500) }
    setSaving(false)
  }

  const isCurrentWeek = weekOffset === 0

  return (
    <div style={{ padding: '36px 40px 80px', maxWidth: 720, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
          {isCurrentWeek ? 'Sunday ritual' : 'Past review'}
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 12 }}>
          Weekly Review
        </h1>
        {/* Week nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setWeekOffset(o => o + 1)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--ink)', letterSpacing: '0.04em' }}>
            {weekLabel(weekStart)}
          </span>
          <button onClick={() => setWeekOffset(o => Math.max(0, o - 1))} disabled={weekOffset === 0} style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: weekOffset === 0 ? 'var(--border-solid)' : 'var(--muted)', background: 'none', border: 'none', cursor: weekOffset === 0 ? 'default' : 'pointer' }}>→</button>
        </div>
      </div>

      {/* Week stats strip */}
      {stats && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
          {[
            { label: 'Habits done', value: stats.habitsDone, color: '#86EFAC' },
            { label: 'Avg mood', value: stats.avgMood ? `${stats.avgMood.toFixed(1)}/10` : '—', color: '#F9A8D4' },
          ].map(s => (
            <div key={s.label} className="cockpit-stat-block" style={{ flex: 1, padding: '12px 16px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Rating */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
          How was this week overall?
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setRating(n)}
              style={{
                width: 44, height: 44, borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: rating === n ? 700 : 400,
                border: `1px solid ${rating === n ? '#FCD34D' : 'var(--border-solid)'}`,
                background: rating === n ? '#FCD34D15' : 'transparent',
                color: rating === n ? '#FCD34D' : 'var(--muted)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        {rating && (
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: 'italic', color: '#FCD34D', marginTop: 12 }}>
            {RATING_LABELS[rating]}
          </div>
        )}
      </div>

      {/* Three reflection sections */}
      {([
        { key: 'wentWell' as const, val: wentWell, set: setWentWell, num: '01', accent: '#86EFAC', label: 'What went well', prompts: SECTION_PROMPTS.wentWell },
        { key: 'improved' as const, val: improved, set: setImproved, num: '02', accent: '#FCA5A5', label: 'What to improve', prompts: SECTION_PROMPTS.improved },
        { key: 'intention' as const, val: intention, set: setIntention, num: '03', accent: '#93C5FD', label: 'Intention for next week', prompts: SECTION_PROMPTS.intention },
      ]).map(section => (
        <div key={section.key} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: section.accent, letterSpacing: '0.10em' }}>{section.num}</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: 'var(--ink)' }}>{section.label}</h2>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {section.prompts.map(p => (
              <button
                key={p}
                onClick={() => section.set(s => s ? s : p)}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--muted)',
                  background: 'transparent', border: `1px solid ${section.accent}30`,
                  borderRadius: 20, padding: '4px 12px', cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <textarea
            value={section.val}
            onChange={e => section.set(e.target.value)}
            placeholder={section.prompts[0]}
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--surface)', border: `1px solid ${section.val ? section.accent + '40' : 'var(--border-solid)'}`,
              borderRadius: 10, padding: '14px 16px',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7,
              color: 'var(--ink)', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s',
            }}
          />
        </div>
      ))}

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 8, borderTop: '1px solid var(--border-solid)' }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
            background: '#FCD34D', color: '#0F0E0C', border: 'none', borderRadius: 8, padding: '12px 28px',
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save review'}
        </button>
        {review && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
            Last saved · {new Date(review.id ? Date.now() : Date.now()).toLocaleDateString()}
          </span>
        )}
        <Link href="/goals" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', textDecoration: 'none', marginLeft: 'auto' }}>
          Review goals →
        </Link>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  return <Suspense><ReviewPageInner /></Suspense>
}
