'use client'

import { useState, Suspense } from 'react'

function ContactForm() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'transparent', border: 'none',
    borderBottom: '1px solid var(--border-solid)',
    padding: '12px 0', fontFamily: "'DM Sans', sans-serif",
    fontSize: 15, color: 'var(--ink)', outline: 'none',
    transition: 'border-color 0.2s',
  }

  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 40, marginBottom: 20 }}>✦</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: 'var(--ink)', marginBottom: 12 }}>
          Message sent.
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>
          Thank you for reaching out. Stuti will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="pub-grid-2" style={{ gap: 24 }}>
        <div>
          <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Email *</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Message *</label>
        <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="What's on your mind?" rows={6}
          style={{ ...inputStyle, borderBottom: 'none', border: '1px solid var(--border-solid)', borderRadius: 8, padding: '14px 16px', resize: 'vertical' }}
        />
      </div>
      {status === 'error' && (
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--dawn-rose)' }}>Something went wrong. Please try again.</p>
      )}
      <button type="submit" disabled={status === 'sending'}
        style={{ alignSelf: 'flex-start', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 8, padding: '13px 32px', cursor: status === 'sending' ? 'not-allowed' : 'pointer', opacity: status === 'sending' ? 0.6 : 1, transition: 'opacity 0.2s' }}
      >
        {status === 'sending' ? 'Sending…' : 'Send message →'}
      </button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--paper)', padding: '60px 16px 80px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 16 }}>
            Get in touch
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 20 }}>
            Say hello.
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 480 }}>
            Whether it's about work, writing, the journey, or just wanting to connect — I'd love to hear from you.
          </p>
        </div>

        <Suspense>
          <ContactForm />
        </Suspense>

        {/* Alternative contacts */}
        <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--border-solid)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'LinkedIn', value: 'stuti-agrawal-link', href: 'https://www.linkedin.com/in/stuti-agrawal-link' },
            { label: 'Email', value: 'stutiagrawal1402@gmail.com', href: 'mailto:stutiagrawal1402@gmail.com' },
          ].map(c => (
            <div key={c.label}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{c.label}</div>
              <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--border-solid)', paddingBottom: 1 }}>
                {c.value}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
