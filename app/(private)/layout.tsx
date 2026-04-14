'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Set dark mode for all private routes
    document.documentElement.setAttribute('data-theme', 'dark')
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-sm text-muted animate-pulse">Loading...</span>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Private nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-display text-lg font-normal"
              style={{ color: 'var(--ink)' }}
            >
              Stuti
            </Link>
            <div className="hidden md:flex items-center gap-5">
              {[
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/planner', label: 'Planner' },
                { href: '/write', label: 'Write' },
                { href: '/fitness-log', label: 'Fitness Log' },
                { href: '/health', label: 'Health' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs tracking-widest uppercase transition-colors"
                  style={{ color: 'var(--muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs text-muted hover:text-ink transition-colors"
            >
              ← Public site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="font-mono text-xs text-muted hover:text-ink transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-14">
        {children}
      </div>
    </div>
  )
}
