'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then((d: { email: string } | null) => setEmail(d?.email ?? null))
      .catch(() => {})
  }, [])

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const navLinks = [
    { href: '/dashboard',   label: 'Dashboard',       color: '#93C5FD' },
    { href: '/write',       label: 'Write',            color: '#FCD34D' },
    { href: '/planner',     label: 'Planner',          color: '#C4B5FD' },
    { href: '/fitness-log', label: 'Fitness Log',      color: '#86EFAC' },
    { href: '/health',      label: 'Health Tracker',   color: '#F9A8D4' },
    { href: '/',            label: 'Public site →',    color: 'var(--muted)' },
  ]

  return (
    <div style={{ padding: '28px 32px 64px', maxWidth: 600, margin: '0 auto' }}>

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
      <div className="cockpit-card" style={{ marginBottom: 20 }}>
        <span className="cockpit-label">Account</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>
              Logged in as
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
              {email ?? '—'}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: '1px solid var(--border-solid)',
              borderRadius: 7,
              padding: '8px 16px',
              color: 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Journey card */}
      <div className="cockpit-card" style={{ marginBottom: 20 }}>
        <span className="cockpit-label">Journey config</span>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Start date', value: '2026-04-20' },
            { label: 'Duration',   value: '180 days'   },
            { label: 'Goal',       value: '180-day journey' },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--ink)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav links card */}
      <div className="cockpit-card">
        <span className="cockpit-label">Quick navigation</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 0',
                borderBottom: '1px solid var(--border-solid)',
                textDecoration: 'none',
                color: 'var(--ink)',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: link.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)' }}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
