'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, size = 'md' }: ToggleProps) {
  const w = size === 'sm' ? 36 : 48
  const h = size === 'sm' ? 20 : 24
  const puckSize = size === 'sm' ? 14 : 18
  const puckOffset = 3
  const puckTravel = size === 'sm' ? 16 : 21

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
      <div
        style={{
          width: w,
          height: h,
          position: 'relative',
          borderRadius: h / 2,
          background: checked ? 'var(--ink)' : 'var(--border-solid)',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
        onClick={() => onChange(!checked)}
      >
        <div
          style={{
            width: puckSize,
            height: puckSize,
            position: 'absolute',
            top: puckOffset,
            left: puckOffset,
            borderRadius: '50%',
            background: 'var(--paper)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            transform: `translateX(${checked ? puckTravel : 0}px)`,
          }}
        />
      </div>
      {label && (
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
          {label}
        </span>
      )}
    </label>
  )
}
