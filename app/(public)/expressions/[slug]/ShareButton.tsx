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
      className="font-mono text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors border border-border px-4 py-2 rounded-sm"
    >
      {copied ? 'Copied ✓' : 'Copy link'}
    </button>
  )
}
