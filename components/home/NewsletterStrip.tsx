'use client'

import { useState } from 'react'

export function NewsletterStrip() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setStatus(res.ok ? 'done' : 'error')
  }

  return (
    <section style={{ borderTop: '1px solid var(--border)', padding: '64px 24px', textAlign: 'center', background: 'var(--paper)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 14 }}>
          Follow the journey
        </span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 12 }}>
          180 days, one step at a time.
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
          Leave your email and I'll share updates when something significant happens — a milestone, a poem, a realisation.
        </p>

        {status === 'done' ? (
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--garden-green)' }}>
            ✓ You're in. Thank you.
          </p>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'sending'}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 16px', color: 'var(--ink)', outline: 'none', width: 240 }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 8, padding: '11px 22px', cursor: status === 'sending' ? 'not-allowed' : 'pointer', opacity: status === 'sending' ? 0.6 : 1 }}
            >
              {status === 'sending' ? '…' : 'Follow'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--dawn-rose)', marginTop: 10 }}>Something went wrong. Try again.</p>
        )}
      </div>
    </section>
  )
}
