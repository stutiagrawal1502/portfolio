'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: { href: string; label: string }[]
  showDashboard: boolean
  mode: 'work' | 'life'
}

export function MobileNav({ isOpen, onClose, links, showDashboard, mode }: MobileNavProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const accentColor = mode === 'work' ? '#2B4C7E' : '#C4735A'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: 'rgba(10,10,15,0.5)',
              backdropFilter: 'blur(4px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              width: 288,
              background: 'var(--paper)',
              display: 'flex',
              flexDirection: 'column',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
              borderBottom: '1px solid var(--border-solid)',
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Menu
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 16, padding: 0, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '24px' }}>
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border-solid)',
                    display: 'block',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {showDashboard && (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: accentColor,
                    textDecoration: 'none',
                    padding: '14px 0',
                    display: 'block',
                  }}
                >
                  Dashboard →
                </Link>
              )}
            </nav>

            {/* Footer */}
            <div style={{ marginTop: 'auto', padding: '24px' }}>
              <Link
                href="/"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: 'var(--ink)',
                  textDecoration: 'none',
                }}
              >
                Stuti
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
