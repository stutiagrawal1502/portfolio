'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

async function logout(router: ReturnType<typeof useRouter>) {
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/')
}

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Private nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-solid)' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Link
              href="/dashboard"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 400, color: 'var(--ink)', textDecoration: 'none' }}
            >
              Stuti
            </Link>
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 24 }}>
              {[
                { href: '/dashboard',   label: 'Dashboard'   },
                { href: '/planner',     label: 'Planner'     },
                { href: '/write',       label: 'Write'       },
                { href: '/fitness-log', label: 'Fitness Log' },
                { href: '/health',      label: 'Health'      },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link
              href="/"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}
            >
              ← Public
            </Link>
            <button
              onClick={() => logout(router)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: 'var(--muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--dawn-rose)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content — below fixed nav */}
      <div style={{ paddingTop: 52 }}>
        {children}
      </div>
    </div>
  )
}
