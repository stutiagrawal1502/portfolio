'use client'

import { useEffect, useRef } from 'react'

export function DawnBackground() {
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate CSS star box-shadows
    const stars = starsRef.current
    if (!stars) return
    const count = 60
    const shadows = Array.from({ length: count }, () => {
      const x = Math.random() * 100
      const y = Math.random() * 55
      const size = Math.random() < 0.7 ? 1 : 2
      return `${x}vw ${y}vh 0 ${size}px rgba(255,255,255,${(Math.random() * 0.25 + 0.1).toFixed(2)})`
    }).join(', ')
    stars.style.boxShadow = shadows
  }, [])

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dawn gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #1A2744 0%, #2B4C7E 18%, #3A6FA8 38%, #8FA8C8 58%, #C8B89A 75%, #F7F3EE 100%)',
          backgroundSize: '100% 200%',
          animation: 'dawnShift 20s ease-in-out infinite',
        }}
      />
      {/* Stars — fade as gradient lightens */}
      <div
        ref={starsRef}
        className="absolute top-0 left-0 w-px h-px"
        style={{
          animation: 'starFade 8s ease-in-out infinite',
        }}
      />
      {/* Warm paper fade at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[35%]"
        style={{
          background: 'linear-gradient(to top, var(--paper) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
