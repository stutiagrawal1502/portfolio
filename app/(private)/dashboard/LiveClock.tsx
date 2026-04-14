'use client'

import { useState, useEffect } from 'react'

export function LiveClock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const date = now.toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      const t = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      setTime(`${date} · ${t}`)
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  return (
    <p className="font-mono text-sm mt-1" style={{ color: 'var(--muted)' }}>
      {time}
    </p>
  )
}
