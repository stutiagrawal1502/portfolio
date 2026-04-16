'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Mode = 'work' | 'life'

interface TheToggleProps {
  onChange: (mode: Mode) => void
}

export function TheToggle({ onChange }: TheToggleProps) {
  const [mode, setMode] = useState<Mode>('work')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('stuti-mode') as Mode | null
    const initial = saved === 'life' ? 'life' : 'work'
    setMode(initial)
    onChange(initial)
    document.documentElement.setAttribute('data-mode', initial)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const switchTo = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    onChange(next)
    localStorage.setItem('stuti-mode', next)
    document.documentElement.setAttribute('data-mode', next)
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(6)
  }

  if (!mounted) {
    // SSR / pre-hydration placeholder — same size, invisible
    return (
      <div className="toggle-shell" style={{ visibility: 'hidden' }} aria-hidden="true">
        <div className="toggle-pill" />
        <span className="toggle-label">Work</span>
        <span className="toggle-label">Life</span>
      </div>
    )
  }

  return (
    <div className="toggle-shell" role="group" aria-label="Switch between Work and Life view">
      {/* Animated sliding pill — translateX by 100% of its own width to reach Life */}
      <motion.div
        className="toggle-pill"
        animate={{ x: mode === 'work' ? 0 : '100%' }}
        initial={false}
        transition={{ type: 'spring', stiffness: 480, damping: 36, mass: 0.8 }}
      />

      <button
        className={`toggle-label${mode === 'work' ? ' active' : ''}`}
        onClick={() => switchTo('work')}
        aria-pressed={mode === 'work'}
      >
        Work
      </button>

      <button
        className={`toggle-label${mode === 'life' ? ' active' : ''}`}
        onClick={() => switchTo('life')}
        aria-pressed={mode === 'life'}
      >
        Life
      </button>
    </div>
  )
}
