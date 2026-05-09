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
      { href: '/dashboard', label: 'Dashboard', icon: '◈' },
      { href: '/planner',   label: 'Planner',   icon: '◷' },
      { href: '/review',    label: 'Review',     icon: '✦' },
    ],
  },
  {
    label: 'Create',
    links: [
      { href: '/write',   label: 'Write',   icon: '✏' },
      { href: '/posts',   label: 'Posts',   icon: '▤'  },
      { href: '/notes',   label: 'Notes',   icon: '◻' },
    ],
  },
  {
    label: 'Track',
    links: [
      { href: '/goals',   label: 'Goals',   icon: '◎' },
      { href: '/mood',    label: 'Mood',    icon: '◐' },
      { href: '/reading', label: 'Reading', icon: '◫' },
    ],
  },
  {
    label: 'Body & Money',
    links: [
      { href: '/fitness-log', label: 'Fitness', icon: '◑' },
      { href: '/health',      label: 'Health',  icon: '◉' },
      { href: '/finance',     label: 'Finance', icon: '◈' },
    ],
  },
]

const SIDEBAR_W = 212

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

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

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: SIDEBAR_W,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-solid)',
        display: 'flex', flexDirection: 'column',
        zIndex: 50, overflowY: 'auto',
      }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid var(--border-solid)' }}>
          <Link href="/dashboard" style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400, color: 'var(--ink)', textDecoration: 'none', display: 'block', marginBottom: 14 }}>
            Stuti
          </Link>
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              color: 'var(--muted)', background: 'var(--paper)',
              border: '1px solid var(--border-solid)', borderRadius: 7,
              padding: '7px 10px', cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--muted)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-solid)')}
          >
            <span style={{ fontSize: 12, opacity: 0.5 }}>⌘</span>
            <span style={{ flex: 1, textAlign: 'left', letterSpacing: '0.06em' }}>Search</span>
            <span style={{ fontSize: 9, opacity: 0.4, letterSpacing: '0.06em' }}>K</span>
          </button>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.45, padding: '10px 20px 6px' }}>
                {group.label}
              </div>
              {group.links.map(link => {
                const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 20px',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                      color: active ? 'var(--ink)' : 'var(--muted)',
                      textDecoration: 'none',
                      background: active ? 'var(--border-solid)' : 'transparent',
                      borderLeft: active ? '2px solid var(--ink)' : '2px solid transparent',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)' }}
                  >
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, opacity: active ? 0.7 : 0.35, width: 14, textAlign: 'center', flexShrink: 0 }}>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: public + sign out */}
        <div style={{ padding: '12px 16px 20px', borderTop: '1px solid var(--border-solid)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link
            href="/settings"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 4px', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ⚙ Settings
          </Link>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 4px', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ← Public site
          </Link>
          <button
            onClick={() => logout(router)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 4px', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', textAlign: 'left' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--dawn-rose)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ✕ Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <main style={{ marginLeft: SIDEBAR_W, flex: 1, minHeight: '100vh', minWidth: 0 }}>
        {children}
      </main>

      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
