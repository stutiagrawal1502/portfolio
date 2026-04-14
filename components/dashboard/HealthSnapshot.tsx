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
    <div
      className="rounded-sm p-5 border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: 'var(--muted)' }}
      >
        Health
      </p>

      {/* Energy sparkline */}
      {sparkline && (
        <div className="mb-4">
          <p className="font-mono text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Energy (7d)
          </p>
          <svg width={80} height={28} className="overflow-visible">
            {sparkline}
          </svg>
        </div>
      )}

      {/* Key metrics */}
      <div className="space-y-2">
        {lastVitaminD && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
              Vitamin D
            </span>
            <span className="font-mono text-xs" style={{ color: 'var(--ink)' }}>
              {lastVitaminD.value} {lastVitaminD.unit}
              <span className="ml-2" style={{ color: 'var(--muted)' }}>
                {formatDate(lastVitaminD.date).split(',')[0]}
              </span>
            </span>
          </div>
        )}
        {lastB12 && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
              B12
            </span>
            <span className="font-mono text-xs" style={{ color: 'var(--ink)' }}>
              {lastB12.value} {lastB12.unit}
            </span>
          </div>
        )}
        {!lastVitaminD && !lastB12 && (
          <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
            No metrics logged yet.
          </p>
        )}
      </div>
    </div>
  )
}
