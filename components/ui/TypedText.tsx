'use client'

import { useState, useEffect } from 'react'

interface TypedTextProps {
  text: string
  delay?: number
  speed?: number
  className?: string
  showCursor?: boolean
}

export function TypedText({
  text,
  delay = 0,
  speed = 45,
  className = '',
  showCursor = true,
}: TypedTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(delayTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) {
      setDone(true)
      return
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timer)
  }, [started, displayed, text, speed])

  return (
    <span
      className={`font-mono-dm ${className}`}
      style={{ letterSpacing: '0.02em' }}
    >
      {displayed}
      {showCursor && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1.1em',
            background: 'currentColor',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: done ? 'cursorBlink 1s step-end infinite' : 'none',
            opacity: done ? undefined : 1,
          }}
        />
      )}
    </span>
  )
}
