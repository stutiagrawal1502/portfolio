'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CommandPalette } from '@/components/search/CommandPalette'

async function logout(router: ReturnType<typeof useRouter>) {
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/')
}

const NAV_LINKS = [
  { href: '/dashboard',   label: 'Dashboard' },
  { href: '/planner',     label: 'Planner'   },
  { href: '/review',      label: 'Review'    },
  { href: '/goals',       label: 'Goals'     },
  { href: '/mood',        label: 'Mood'      },
  { href: '/reading',     label: 'Reading'   },
  { href: '/notes',       label: 'Notes'     },
  { href: '/posts',       label: 'Posts'     },
  { href: '/write',       label: 'Write'     },
  { href: '/fitness-log', label: 'Fitness'   },
  { href: '/health',      label: 'Health'    },
  { href: '/finance',     label: 'Finance'   },
]

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    return () => { document.documentElement.removeAttribute('data-theme') }
  }, [])

  // ⌘K / Ctrl+K to open search
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
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid var(--border-solid)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Left: logo + nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/dashboard" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 400, color: 'var(--ink)', textDecoration: 'none', flexShrink: 0 }}>
              Stuti
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, overflowX: 'auto' }}>
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: search + public + signout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--muted)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-solid)')}
            >
              <span style={{ opacity: 0.6 }}>⌘K</span>
              <span>Search</span>
            </button>
            <Link href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', textDecoration: 'none' }}>
              ← Public
            </Link>
            <button
              onClick={() => logout(router)}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--dawn-rose)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: 52 }}>
        {children}
      </div>

      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
