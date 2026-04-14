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
  }, [])

  const toggle = () => {
    const next: Mode = mode === 'work' ? 'life' : 'work'
    setMode(next)
    onChange(next)
    localStorage.setItem('stuti-mode', next)
    document.documentElement.setAttribute('data-mode', next)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  if (!mounted) {
    return (
      <div className="toggle-wrapper opacity-0">
        <span className="toggle-label">WORK</span>
        <div className="toggle-track work" style={{ width: 160, height: 48 }} />
        <span className="toggle-label">LIFE</span>
      </div>
    )
  }

  return (
    <div
      className="toggle-wrapper"
      onClick={toggle}
      role="switch"
      aria-checked={mode === 'life'}
      aria-label="Toggle between Work and Life mode"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? toggle() : null}
    >
      <span className={`toggle-label ${mode === 'work' ? 'active' : ''}`}>
        WORK
      </span>

      <div className={`toggle-track ${mode}`}>
        <motion.div
          className="toggle-puck"
          animate={{ x: mode === 'work' ? 4 : 96 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      <span className={`toggle-label ${mode === 'life' ? 'active' : ''}`}>
        LIFE
      </span>
    </div>
  )
}
