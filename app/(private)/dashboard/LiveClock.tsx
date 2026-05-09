'use client'

import { useState, useEffect } from 'react'

function greeting(hour: number): string {
  if (hour < 5)  return 'Burning midnight oil,'
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
      const date = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
      const t    = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      setTime(`${date} · ${t}`)
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ lineHeight: 1.2 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: 'var(--ink)' }}>
        {greet} Stuti.
      </div>
      {time && (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
          {time}
        </div>
      )}
    </div>
  )
}
