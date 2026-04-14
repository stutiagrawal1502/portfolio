'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, size = 'md' }: ToggleProps) {
  const w = size === 'sm' ? 'w-9 h-5' : 'w-12 h-6'
  const puck = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'
  const translate = size === 'sm'
    ? (checked ? 'translate-x-4' : 'translate-x-0.5')
    : (checked ? 'translate-x-6' : 'translate-x-0.5')

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        className={`${w} relative rounded-full transition-colors duration-200 ${
          checked ? 'bg-ink' : 'bg-border'
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`${puck} absolute top-[3px] rounded-full bg-paper shadow-sm transition-transform duration-200 ${translate}`}
        />
      </div>
      {label && (
        <span className="font-mono text-xs text-muted uppercase tracking-widest">
          {label}
        </span>
      )}
    </label>
  )
}
