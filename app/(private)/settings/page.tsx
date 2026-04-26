'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface JourneyConfig {
  startDate: string
  totalDays: number
  phase: number
  note: string | null
  dayNumber: number
  currentStreak: number
  longestStreak: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [config, setConfig] = useState<JourneyConfig | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Editable fields
  const [startDate, setStartDate] = useState('')
  const [totalDays, setTotalDays] = useState(180)
  const [note, setNote] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then((d: { email: string } | null) => setEmail(d?.email ?? null))
      .catch(() => {})

    fetch('/api/journey')
      .then(r => r.ok ? r.json() : null)
      .then((d: JourneyConfig | null) => {
        if (d) {
          setConfig(d)
          setStartDate(d.startDate.split('T')[0])
          setTotalDays(d.totalDays || 180)
          setNote(d.note ?? '')
        }
      })
      .catch(() => {})
  }, [])

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  async function saveConfig() {
    setSaving(true)
    const res = await fetch('/api/journey', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: new Date(startDate).toISOString(),
        totalDays,
        note: note || null,
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setConfig({ ...updated, dayNumber: config?.dayNumber ?? 0 })
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const navLinks = [
    { href: '/dashboard',   label: 'Dashboard',       color: '#93C5FD' },
    { href: '/planner',     label: 'Planner',          color: '#C4B5FD' },
    { href: '/goals',       label: 'Goals & Habits',   color: '#86EFAC' },
    { href: '/notes',       label: 'Notes',            color: '#C4B5FD' },
    { href: '/posts',       label: 'Posts',            color: '#FCD34D' },
    { href: '/write',       label: 'Write',            color: '#FCD34D' },
    { href: '/fitness-log', label: 'Fitness Log',      color: '#86EFAC' },
    { href: '/health',      label: 'Health Tracker',   color: '#F9A8D4' },
    { href: '/finance',     label: 'Finance',          color: '#6EE7B7' },
    { href: '/',            label: 'Public site →',    color: 'var(--muted)' },
  ]

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 680, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
          Private
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.2 }}>
          Settings
        </h1>
      </div>

      {/* Account card */}
      <div className="cockpit-card" style={{ marginBottom: 16 }}>
        <span className="cockpit-label">Account</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>Logged in as</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>{email ?? '—'}</div>
          </div>
          <button
            onClick={handleSignOut}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--border-solid)', borderRadius: 7, padding: '8px 16px', color: 'var(--muted)', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Journey config card — editable */}
      <div className="cockpit-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span className="cockpit-label" style={{ margin: 0 }}>Journey config</span>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '5px 12px', color: 'var(--muted)', cursor: 'pointer' }}
            >
              Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setEditing(false); if (config) { setStartDate(config.startDate.split('T')[0]); setTotalDays(config.totalDays || 180); setNote(config.note ?? '') } }}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '5px 12px', color: 'var(--muted)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                disabled={saving}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', background: '#86EFAC', border: 'none', borderRadius: 6, padding: '5px 12px', color: '#0F0E0C', cursor: 'pointer', fontWeight: 600, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Start date', value: config ? new Date(config.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
              { label: 'Duration',   value: config ? `${config.totalDays || 180} days` : '—' },
              { label: 'Day',        value: config ? `Day ${config.dayNumber}` : '—' },
              { label: 'Streak',     value: config ? `${config.currentStreak} days` : '—' },
              { label: 'Best streak', value: config ? `${config.longestStreak} days` : '—' },
              { label: 'Phase',      value: config ? `Phase ${config.phase}` : '—' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '8px 10px', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Duration (days)</label>
                <input
                  type="number"
                  value={totalDays}
                  onChange={e => setTotalDays(parseInt(e.target.value) || 180)}
                  min={1}
                  max={365}
                  style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '8px 10px', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Journey note</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Starting from scratch. That's the point."
                style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '8px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick nav */}
      <div className="cockpit-card">
        <span className="cockpit-label">Navigation</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-solid)', textDecoration: 'none' }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: link.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)' }}>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
