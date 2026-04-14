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
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const accentColor = mode === 'work' ? '#2B4C7E' : '#C4735A'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-paper flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="font-mono text-xs tracking-widest uppercase text-muted">
                Menu
              </span>
              <button
                onClick={onClose}
                className="text-muted hover:text-ink transition-colors"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-6">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="font-mono text-sm tracking-wide uppercase text-muted hover:text-ink transition-colors py-3 border-b border-border/50"
                >
                  {link.label}
                </Link>
              ))}
              {showDashboard && (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="font-mono text-sm tracking-wide uppercase py-3"
                  style={{ color: accentColor }}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="mt-auto p-6">
              <Link
                href="/"
                className="font-display text-2xl font-normal text-ink"
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
