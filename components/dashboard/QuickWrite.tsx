'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type WriteType = 'POEM' | 'JOURNAL' | 'BLOG'

const typeColors: Record<WriteType, string> = {
  POEM:    '#FCD34D',
  JOURNAL: '#86EFAC',
  BLOG:    '#93C5FD',
}

export function QuickWrite() {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState<WriteType | null>(null)
  const router = useRouter()

  const handleSave = async (type: WriteType) => {
    if (!text.trim()) return
    setSaving(type)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: text.slice(0, 60).trim() + (text.length > 60 ? '...' : ''),
          content: text,
          type,
          status: 'DRAFT',
        }),
      })
      const post = await res.json()
      router.push(`/write/${post.id}`)
    } finally {
      setSaving(null)
    }
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="cockpit-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="cockpit-label" style={{ margin: 0 }}>Quick write</span>
        {text.length > 0 && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>
            {wordCount}w
          </span>
        )}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's on your mind right now?"
        rows={4}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--ink)',
          caretColor: 'var(--ink)',
          marginBottom: 14,
        }}
      />

      {/* Type buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        {(['POEM', 'JOURNAL', 'BLOG'] as WriteType[]).map(type => (
          <button
            key={type}
            onClick={() => handleSave(type)}
            disabled={!text.trim() || !!saving}
            style={{
              flex: 1,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: `1px solid ${typeColors[type]}30`,
              borderRadius: 6,
              padding: '7px 0',
              cursor: !text.trim() || !!saving ? 'not-allowed' : 'pointer',
              background: saving === type ? typeColors[type] : `${typeColors[type]}12`,
              color: saving === type ? '#0F0E0C' : typeColors[type],
              opacity: !text.trim() ? 0.35 : 1,
              transition: 'all 0.15s',
            }}
          >
            {saving === type ? '...' : type.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
