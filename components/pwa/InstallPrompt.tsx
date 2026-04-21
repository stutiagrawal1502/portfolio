'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredEvt, setDeferredEvt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('stuti-visit-count') ?? '0') + 1
    localStorage.setItem('stuti-visit-count', String(visits))

    const dismissed = localStorage.getItem('stuti-install-dismissed')
    if (dismissed) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredEvt(e as BeforeInstallPromptEvent)
      if (visits >= 3) setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredEvt) return
    await deferredEvt.prompt()
    const { outcome } = await deferredEvt.userChoice
    if (outcome === 'accepted') {
      localStorage.setItem('stuti-install-dismissed', 'true')
    }
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('stuti-install-dismissed', 'true')
    setShowPrompt(false)
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: 16,
            background: 'var(--surface)',
            borderTop: '1px solid var(--border-solid)',
          }}
        >
          <div style={{ maxWidth: 512, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                Add Stuti to your home screen
              </p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                Works offline · No app store needed
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button
                onClick={handleDismiss}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  padding: '6px 12px',
                  borderRadius: 3,
                  border: '1px solid var(--border-solid)',
                  background: 'transparent',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  padding: '6px 12px',
                  borderRadius: 3,
                  border: 'none',
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  cursor: 'pointer',
                }}
              >
                Add to home screen
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
