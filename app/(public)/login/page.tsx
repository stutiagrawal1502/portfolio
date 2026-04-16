'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router      = useRouter()
  const params      = useSearchParams()
  const inputRef    = useRef<HTMLInputElement>(null)

  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    // Slight delay so the animation plays first
    const t = setTimeout(() => inputRef.current?.focus(), 600)
    return () => clearTimeout(t)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        const from = params.get('from') ?? '/dashboard'
        router.push(from)
      } else {
        const data = await res.json().catch(() => ({}))
        setMessage(data.error ?? 'Access denied.')
        setStatus('error')
      }
    } catch {
      setMessage('Something went wrong. Try again.')
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'
  const isError   = status === 'error'

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--paper)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 20% 20%, rgba(37,99,235,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 80%, rgba(220,74,42,0.04) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        animation: 'fadeUp 0.5s ease both',
      }}>
        {/* Top eyebrow */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            Private space
          </span>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            Stuti Agrawal
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}>
            The dashboard, planner, and journal<br />are for her eyes only.
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-solid)',
            borderRadius: 16,
            padding: '32px 28px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
          }}>
            {/* Input label */}
            <label
              htmlFor="email"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                display: 'block',
                marginBottom: 10,
              }}
            >
              Your email address
            </label>

            {/* Email input */}
            <div style={{
              position: 'relative',
              marginBottom: 20,
            }}>
              <input
                ref={inputRef}
                id="email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (isError) setStatus('idle') }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isLoading}
                style={{
                  width: '100%',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: 'var(--ink)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${
                    isError   ? 'var(--dawn-rose)' :
                    focused   ? 'var(--ink)'       :
                    'var(--border-solid)'
                  }`,
                  borderRadius: 0,
                  padding: '10px 0',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  opacity: isLoading ? 0.5 : 1,
                }}
              />
              {/* Animated cursor line on focus */}
              {focused && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: 2,
                  background: 'var(--ink)',
                  animation: 'expandWidth 0.2s ease both',
                  width: '100%',
                }} />
              )}
            </div>

            {/* Error message */}
            {isError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
                animation: 'fadeUp 0.2s ease both',
              }}>
                <span style={{ fontSize: 14 }}>—</span>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: 'var(--dawn-rose)',
                  lineHeight: 1.4,
                }}>
                  {message}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              style={{
                width: '100%',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.01em',
                color: 'var(--paper)',
                background: isLoading ? 'var(--muted)' : 'var(--ink)',
                border: 'none',
                borderRadius: 10,
                padding: '13px 24px',
                cursor: isLoading || !email.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, opacity 0.2s',
                opacity: !email.trim() ? 0.45 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    width: 14,
                    height: 14,
                    border: '2px solid rgba(248,244,238,0.3)',
                    borderTopColor: 'var(--paper)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Checking...
                </>
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </form>

        {/* Footer note */}
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: 'var(--muted)',
          textAlign: 'center',
          marginTop: 24,
          lineHeight: 1.6,
        }}>
          No password. No OAuth. Just your email.
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes expandWidth {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}
