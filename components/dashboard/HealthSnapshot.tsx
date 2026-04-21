'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

interface HealthMetric {
  id: string
  date: string | Date
  metricName: string
  value: number
  unit: string
}

interface EnergyPoint {
  energyBefore?: number | null
  date: string | Date
}

interface HealthSnapshotProps {
  recentEnergy?: EnergyPoint[]
}

export function HealthSnapshot({ recentEnergy = [] }: HealthSnapshotProps) {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])

  useEffect(() => {
    fetch('/api/health?limit=10')
      .then(r => r.ok ? r.json() : [])
      .then(setMetrics)
      .catch(() => {})
  }, [])

  const lastVitaminD = metrics.find(m => m.metricName.toLowerCase().includes('vitamin d'))
  const lastB12 = metrics.find(m => m.metricName.toLowerCase().includes('b12'))

  // SVG sparkline from energy data
  const energyPoints = recentEnergy
    .slice(0, 7)
    .reverse()
    .map(d => d.energyBefore)
    .filter((v): v is number => v != null)

  const sparkline = (() => {
    if (energyPoints.length < 2) return null
    const w = 80
    const h = 28
    const min = Math.min(...energyPoints) - 1
    const max = Math.max(...energyPoints) + 1
    const range = max - min || 1
    const pts = energyPoints.map((v, i) => {
      const x = (i / (energyPoints.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    }).join(' ')
    return <polyline points={pts} fill="none" stroke="var(--dawn-rose)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  })()

  return (
    <div style={{
      borderRadius: 2,
      padding: 20,
      border: '1px solid var(--border-solid)',
      background: 'var(--surface)',
    }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
        Health
      </p>

      {/* Energy sparkline */}
      {sparkline && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
            Energy (7d)
          </p>
          <svg width={80} height={28} style={{ overflow: 'visible' }}>
            {sparkline}
          </svg>
        </div>
      )}

      {/* Key metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lastVitaminD && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
              Vitamin D
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink)' }}>
              {lastVitaminD.value} {lastVitaminD.unit}
              <span style={{ color: 'var(--muted)', marginLeft: 8 }}>
                {formatDate(lastVitaminD.date).split(',')[0]}
              </span>
            </span>
          </div>
        )}
        {lastB12 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
              B12
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink)' }}>
              {lastB12.value} {lastB12.unit}
            </span>
          </div>
        )}
        {!lastVitaminD && !lastB12 && (
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
            No metrics logged yet.
          </p>
        )}
      </div>
    </div>
  )
}
