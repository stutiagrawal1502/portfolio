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
    // Increment visit count
    const visits = parseInt(localStorage.getItem('stuti-visit-count') ?? '0') + 1
    localStorage.setItem('stuti-visit-count', String(visits))

    const dismissed = localStorage.getItem('stuti-install-dismissed')
    if (dismissed) return

    // Capture install event
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
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
        >
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
                Add Stuti to your home screen
              </p>
              <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                Works offline · No app store needed
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDismiss}
                className="font-mono text-xs px-3 py-1.5 rounded-sm border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="font-mono text-xs px-3 py-1.5 rounded-sm"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
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
