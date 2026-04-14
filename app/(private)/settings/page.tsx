'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen px-6 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-normal mb-8" style={{ color: 'var(--ink)' }}>
        Settings
      </h1>

      {/* Account */}
      <section className="mb-10">
        <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
          Account
        </h2>
        <div
          className="rounded-sm p-5 border space-y-3"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm" style={{ color: 'var(--ink)' }}>
                {session?.user?.name}
              </p>
              <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border rounded-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="mb-10">
        <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
          Journey
        </h2>
        <div
          className="rounded-sm p-5 border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-sans text-sm mb-3" style={{ color: 'var(--ink)' }}>
            Journey start date and configuration is managed via the seed file.
          </p>
          <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
            Start date: 2026-04-20 · 180 days total
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section>
        <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
          Quick Links
        </h2>
        <div className="space-y-2">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/write', label: 'Write' },
            { href: '/planner', label: 'Planner' },
            { href: '/fitness-log', label: 'Fitness Log' },
            { href: '/health', label: 'Health Tracker' },
            { href: '/', label: 'Public Site →' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block font-mono text-sm py-2 border-b"
              style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
