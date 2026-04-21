'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNav } from './MobileNav'

type Mode = 'work' | 'life'

const navLinks = [
  { href: '/about',       label: 'About'      },
  { href: '/expressions', label: 'Writing'    },
  { href: '/poems',       label: 'Poems'      },
  { href: '/fitness',     label: 'Journey'    },
]

export function Nav() {
  const [isAuthed, setIsAuthed] = useState(false)
  const pathname = usePathname()

  // Detect login state from the auth cookie (client-readable via document.cookie is blocked
  // since it's httpOnly — so we probe a lightweight API endpoint once on mount)
  useEffect(() => {
    fetch('/api/auth/me', { method: 'GET' })
      .then(r => setIsAuthed(r.ok))
      .catch(() => setIsAuthed(false))
  }, [])
  const isHome = pathname === '/'

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('work')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute('data-mode') as Mode
      if (attr) setMode(attr)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode'],
    })
    const current = document.documentElement.getAttribute('data-mode') as Mode
    if (current) setMode(current)
    return () => observer.disconnect()
  }, [])

  // Nav appearance logic:
  // - Homepage not scrolled: transparent, white text (sits over dark hero)
  // - Any page scrolled:     dark glass, white text
  // - Inner page not scrolled: paper bg, dark text
  const isDark = (isHome && !scrolled) || scrolled
  const navClass = scrolled ? 'nav-scrolled' : isHome ? 'nav-hero' : 'nav-light'

  const logoColor  = isDark ? '#F8F4EE' : 'var(--ink)'
  const linkColor  = isDark ? 'rgba(248,244,238,0.58)' : 'var(--muted)'
  const linkHover  = isDark ? 'rgba(248,244,238,0.90)' : 'var(--ink)'
  const hamColor   = isDark ? 'rgba(248,244,238,0.65)' : 'var(--ink)'
  const dashColor  = isDark
    ? (mode === 'work' ? '#93C5FD' : '#86EFAC')
    : (mode === 'work' ? 'var(--dawn-blue)' : 'var(--garden-green)')

  return (
    <>
      <nav
        className={`${navClass}`}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s' }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 48px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 17,
              fontWeight: 400,
              color: logoColor,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
          >
            Stuti Agrawal
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: pathname === link.href ? linkHover : linkColor,
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                  borderBottom: pathname === link.href
                    ? `1px solid ${isDark ? 'rgba(248,244,238,0.4)' : 'var(--ink)'}`
                    : '1px solid transparent',
                  paddingBottom: 2,
                }}
              >
                {link.label}
              </Link>
            ))}
            {isAuthed && (
              <Link
                href="/dashboard"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  color: dashColor,
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                Dashboard →
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span style={{ display: 'block', width: 20, height: 1, background: hamColor }} />
            <span style={{ display: 'block', width: 20, height: 1, background: hamColor }} />
            <span style={{ display: 'block', width: 14, height: 1, background: hamColor }} />
          </button>
        </div>
      </nav>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        showDashboard={isAuthed}
        mode={mode}
      />
    </>
  )
}
