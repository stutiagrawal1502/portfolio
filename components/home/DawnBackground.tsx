'use client'

import { useEffect, useRef } from 'react'

export function DawnBackground() {
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stars = starsRef.current
    if (!stars) return
    // Subtle, refined star field — not overwhelming
    const shadows = Array.from({ length: 55 }, () => {
      const x = Math.random() * 100
      const y = Math.random() * 65
      const size = Math.random() < 0.72 ? 1 : 2
      const opacity = (Math.random() * 0.35 + 0.08).toFixed(2)
      return `${x}vw ${y}vh 0 ${size}px rgba(255,255,255,${opacity})`
    }).join(', ')
    stars.style.boxShadow = shadows
  }, [])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Deep pre-dawn gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            #06090F 0%,
            #0B1120 20%,
            #101928 40%,
            #192238 60%,
            #1E2B44 75%,
            #0F0F0F 100%
          )`,
        }}
      />

      {/* Subtle atmospheric glow at horizon */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 70% 25% at 50% 68%,
            rgba(37, 99, 235, 0.08) 0%,
            rgba(224, 92, 58, 0.06) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* Stars */}
      <div
        ref={starsRef}
        className="absolute top-0 left-0 w-px h-px"
        style={{ animation: 'starFade 12s ease-in-out infinite' }}
      />

      {/* Bottom gradient — fades hero into paper content */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '25%',
          background: 'linear-gradient(to bottom, transparent 0%, #0F0F0F 100%)',
        }}
      />
    </div>
  )
}
