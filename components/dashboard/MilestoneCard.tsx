'use client'

import { useRef } from 'react'

interface Props {
  dayNumber: number
  streak: number
  startDate: Date
}

const MILESTONES: Record<number, { label: string; color: string }> = {
  30:  { label: 'First Month',   color: '#93C5FD' },
  60:  { label: 'Two Months',    color: '#C4B5FD' },
  90:  { label: 'Quarter Way',   color: '#86EFAC' },
  120: { label: 'Two Thirds',    color: '#FCD34D' },
  180: { label: 'The Finish',    color: '#F9A8D4' },
}

const MILESTONE_DAYS = [30, 60, 90, 120, 180]

function getNextMilestone(day: number) {
  return MILESTONE_DAYS.find(m => m >= day) ?? 180
}

export function MilestoneCard({ dayNumber, streak, startDate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextMs = getNextMilestone(dayNumber)
  const cfg = MILESTONES[nextMs]
  const daysLeft = nextMs - dayNumber

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 1080, H = 1080
    canvas.width = W; canvas.height = H

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0F0E0C')
    grad.addColorStop(1, '#1A1714')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Subtle grain texture
    for (let i = 0; i < 8000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.015})`
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1)
    }

    // Accent circle
    ctx.beginPath()
    ctx.arc(W / 2, H / 2, 320, 0, Math.PI * 2)
    ctx.strokeStyle = `${cfg.color}25`
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(W / 2, H / 2, 300, 0, Math.PI * 2)
    ctx.strokeStyle = `${cfg.color}15`
    ctx.lineWidth = 40
    ctx.stroke()

    // Day number
    ctx.fillStyle = cfg.color
    ctx.font = 'bold 240px "DM Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${dayNumber}`, W / 2, H / 2 - 60)

    // "days" label
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '400 36px "DM Mono", monospace'
    ctx.fillText('days', W / 2, H / 2 + 120)

    // Divider
    ctx.strokeStyle = `${cfg.color}40`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(W / 2 - 80, H / 2 + 170)
    ctx.lineTo(W / 2 + 80, H / 2 + 170)
    ctx.stroke()

    // Streak
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '400 28px "DM Mono", monospace'
    ctx.fillText(`${streak} day streak`, W / 2, H / 2 + 220)

    // Top label
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.font = '400 22px "DM Mono", monospace'
    ctx.letterSpacing = '6px'
    ctx.fillText('THE 180-DAY JOURNEY', W / 2, 80)

    // Start date
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = '400 20px "DM Mono", monospace'
    ctx.fillText(`Started ${startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, W / 2, H - 80)

    // Download
    const link = document.createElement('a')
    link.download = `day-${dayNumber}-milestone.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-solid)', borderRadius: 2, padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: cfg.color }} />
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
        Next milestone
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 36, fontWeight: 700, color: cfg.color, lineHeight: 1 }}>{nextMs}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>days — {cfg.label}</span>
      </div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
        {daysLeft} day{daysLeft !== 1 ? 's' : ''} to go
      </p>
      <button
        onClick={download}
        style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase', background: `${cfg.color}15`, border: `1px solid ${cfg.color}40`, borderRadius: 5, padding: '6px 14px', color: cfg.color, cursor: 'pointer' }}
      >
        ↓ Download card
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
