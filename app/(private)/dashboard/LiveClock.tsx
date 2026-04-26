'use client'

import { useState, useEffect } from 'react'

function greeting(hour: number): string {
  if (hour < 5)  return 'Burning the midnight oil,'
  if (hour < 12) return 'Good morning,'
  if (hour < 17) return 'Good afternoon,'
  if (hour < 21) return 'Good evening,'
  return 'Late night mode,'
}

export function LiveClock() {
  const [time, setTime]   = useState<string>('')
  const [greet, setGreet] = useState<string>('Good morning,')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setGreet(greeting(now.getHours()))
      const date = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
      const t    = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      setTime(`${date} · ${t}`)
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.2 }}>
        {greet} Stuti.
      </h1>
      {time && (
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, marginTop: 4, color: 'var(--muted)' }}>
          {time}
        </p>
      )}
    </>
  )
}
