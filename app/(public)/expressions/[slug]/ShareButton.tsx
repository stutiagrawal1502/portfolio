'use client'

import { useState } from 'react'

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        border: '1px solid var(--border-solid)',
        padding: '8px 16px',
        borderRadius: 3,
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      {copied ? 'Copied ✓' : 'Copy link'}
    </button>
  )
}
