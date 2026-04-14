'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { MobileNav } from './MobileNav'

type Mode = 'work' | 'life'

interface NavProps {
  mode?: Mode
}

const workLinks = [
  { href: '/about', label: 'About' },
  { href: '/expressions', label: 'Writing' },
]

const lifeLinks = [
  { href: '/poems', label: 'Poems' },
  { href: '/fitness', label: 'Fitness' },
  { href: '/csr', label: 'CSR' },
  { href: '/sports', label: 'Sports' },
]

export function Nav({ mode: modeProp }: NavProps) {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mode, setMode] = useState<Mode>(modeProp ?? 'work')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Keep in sync with the data-mode attribute set by TheToggle
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute('data-mode') as Mode
      if (attr) setMode(attr)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
    const current = document.documentElement.getAttribute('data-mode') as Mode
    if (current) setMode(current)
    return () => observer.disconnect()
  }, [])

  const links = mode === 'work' ? workLinks : lifeLinks
  const accentColor = mode === 'work' ? 'text-dawn-blue' : 'text-dawn-rose'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'nav-filled' : 'nav-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display text-xl font-normal text-ink hover:opacity-70 transition-opacity`}
          >
            Stuti Agrawal
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <Link
                href="/dashboard"
                className={`font-mono text-xs tracking-widest uppercase ${accentColor} hover:opacity-70 transition-opacity`}
              >
                Dashboard
              </Link>
            ) : null}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-px bg-ink" />
            <span className="block w-5 h-px bg-ink" />
            <span className="block w-3 h-px bg-ink" />
          </button>
        </div>
      </nav>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={links}
        showDashboard={!!session}
        mode={mode}
      />
    </>
  )
}
