'use client'

import { useEffect, useRef } from 'react'

export function DawnBackground() {
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stars = starsRef.current
    if (!stars) return
    const shadows = Array.from({ length: 70 }, () => {
      const x = Math.random() * 100
      const y = Math.random() * 70
      const size = Math.random() < 0.72 ? 1 : Math.random() < 0.5 ? 1.5 : 2
      const opacity = (Math.random() * 0.45 + 0.08).toFixed(2)
      return `${x}vw ${y}vh 0 ${size}px rgba(255,255,255,${opacity})`
    }).join(', ')
    stars.style.boxShadow = shadows
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">

      {/* Deep pre-dawn sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(
          175deg,
          #04080F 0%,
          #08112A 18%,
          #0D1B3E 35%,
          #1A2A4A 52%,
          #1C2438 68%,
          #100C0A 100%
        )`,
      }} />

      {/* Warm horizon glow — dawn breaking */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(
          ellipse 90% 30% at 50% 82%,
          rgba(220, 74, 42, 0.13) 0%,
          rgba(180, 83, 9, 0.07) 35%,
          transparent 70%
        )`,
      }} />

      {/* Cool blue atmospheric scatter */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(
          ellipse 60% 40% at 20% 30%,
          rgba(37, 99, 235, 0.06) 0%,
          transparent 60%
        )`,
      }} />

      {/* Grain / noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.032,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '180px 180px',
      }} />

      {/* Stars */}
      <div
        ref={starsRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 1, height: 1,
          animation: 'starFade 14s ease-in-out infinite',
        }}
      />

      {/* Subtle vignette edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)`,
      }} />

      {/* Fade hero into paper */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '28%',
        background: 'linear-gradient(to bottom, transparent 0%, #0A0A0F 100%)',
      }} />
    </div>
  )
}
