'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CommandPalette } from '@/components/search/CommandPalette'

async function logout(router: ReturnType<typeof useRouter>) {
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/')
}

const NAV_GROUPS = [
  {
    label: 'Overview',
    links: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/planner',   label: 'Planner'   },
      { href: '/review',    label: 'Review'    },
    ],
  },
  {
    label: 'Create',
    links: [
      { href: '/write',   label: 'Write'  },
      { href: '/posts',   label: 'Posts'  },
      { href: '/notes',   label: 'Notes'  },
    ],
  },
  {
    label: 'Track',
    links: [
      { href: '/goals',   label: 'Goals'   },
      { href: '/mood',    label: 'Mood'    },
      { href: '/reading', label: 'Reading' },
    ],
  },
  {
    label: 'Body & Money',
    links: [
      { href: '/routine',     label: 'Routine'  },
      { href: '/fitness-log', label: 'Fitness'  },
      { href: '/health',      label: 'Health'   },
      { href: '/finance',     label: 'Finance'  },
    ],
  },
]

// Bottom nav — 5 most-used destinations on mobile
const BOTTOM_NAV = [
  { href: '/dashboard',   label: 'Home',    icon: '⌂' },
  { href: '/write',       label: 'Write',   icon: '✏' },
  { href: '/planner',     label: 'Plan',    icon: '◷' },
  { href: '/goals',       label: 'Goals',   icon: '◎' },
  { href: '/notes',       label: 'Notes',   icon: '◻' },
]

const SIDEBAR_W = 200

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen,   setMoreOpen]   = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    return () => { document.documentElement.removeAttribute('data-theme') }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--paper)' }}>

      {/* ── Sidebar (desktop only) ───────────────────────────────── */}
      <aside className="private-sidebar" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: SIDEBAR_W,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-solid)',
        flexDirection: 'column',
        zIndex: 50, overflowY: 'auto',
      }}>
        {/* Logo + search */}
        <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border-solid)' }}>
          <Link href="/dashboard" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 400, color: 'var(--ink)', textDecoration: 'none', display: 'block', marginBottom: 12 }}>
            Stuti
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              color: 'var(--muted)', background: 'var(--paper)',
              border: '1px solid var(--border-solid)', borderRadius: 6,
              padding: '6px 10px', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 11, opacity: 0.4 }}>⌘</span>
            <span style={{ flex: 1, textAlign: 'left', letterSpacing: '0.06em' }}>Search</span>
            <span style={{ fontSize: 9, opacity: 0.35, letterSpacing: '0.06em' }}>K</span>
          </button>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 2 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.4, padding: '8px 16px 4px' }}>
                {group.label}
              </div>
              {group.links.map(link => {
                const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '7px 16px',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                      color: active ? 'var(--ink)' : 'var(--muted)',
                      textDecoration: 'none',
                      background: active ? 'var(--border-solid)' : 'transparent',
                      borderLeft: `2px solid ${active ? 'var(--ink)' : 'transparent'}`,
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)' }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '10px 14px 20px', borderTop: '1px solid var(--border-solid)', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { href: '/settings', label: 'Settings'     },
            { href: '/',         label: '← Public site' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{ padding: '7px 2px', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => logout(router)}
            style={{ padding: '7px 2px', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap', transition: 'color 0.15s', width: '100%' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--dawn-rose)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="private-main" style={{ marginLeft: SIDEBAR_W, flex: 1, minHeight: '100vh', minWidth: 0 }}>
        {children}
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav className="private-bottom-nav">
        {BOTTOM_NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'active' : ''}
              style={{ color: active ? 'var(--ink)' : 'var(--muted)' }}
            >
              <span className="nav-icon" style={{ opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
        <button onClick={() => setMoreOpen(true)} style={{ color: 'var(--muted)' }}>
          <span className="nav-icon" style={{ opacity: 0.5 }}>≡</span>
          <span>More</span>
        </button>
      </nav>

      {/* ── Mobile "More" full-screen drawer ─────────────────────── */}
      {moreOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'var(--paper)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          onClick={e => { if (e.target === e.currentTarget) setMoreOpen(false) }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border-solid)', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 400, color: 'var(--ink)' }}>Stuti</span>
            <button onClick={() => setMoreOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>✕</button>
          </div>

          {/* All nav groups */}
          <div style={{ flex: 1, padding: '8px 0 24px', overflowY: 'auto' }}>
            {NAV_GROUPS.map(group => (
              <div key={group.label} style={{ marginBottom: 4 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.4, padding: '10px 20px 4px' }}>
                  {group.label}
                </div>
                {group.links.map(link => {
                  const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', padding: '13px 20px',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 16,
                        color: active ? 'var(--ink)' : 'var(--muted)',
                        textDecoration: 'none',
                        background: active ? 'var(--surface)' : 'transparent',
                        borderLeft: `3px solid ${active ? 'var(--ink)' : 'transparent'}`,
                      }}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div style={{ borderTop: '1px solid var(--border-solid)', padding: '16px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ opacity: 0.5 }}>⌕</span> Search
            </button>
            <Link
              href="/"
              onClick={() => setMoreOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none' }}
            >
              <span>←</span> Public site
            </Link>
            <button
              onClick={() => { setMoreOpen(false); logout(router) }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dawn-rose)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span>→</span> Sign out
            </button>
          </div>
        </div>
      )}

      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
