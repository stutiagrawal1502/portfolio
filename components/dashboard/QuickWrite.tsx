'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type WriteType = 'POEM' | 'JOURNAL' | 'BLOG'

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

  return (
    <div
      className="rounded-sm p-5 border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p
        className="font-mono text-xs tracking-widest uppercase mb-3"
        style={{ color: 'var(--muted)' }}
      >
        Quick Write
      </p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's on your mind right now?"
        rows={5}
        className="w-full bg-transparent font-sans text-sm resize-none focus:outline-none mb-3"
        style={{
          color: 'var(--ink)',
          caretColor: 'var(--ink)',
          lineHeight: 1.7,
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['POEM', 'JOURNAL', 'BLOG'] as WriteType[]).map(type => (
            <button
              key={type}
              onClick={() => handleSave(type)}
              disabled={!text.trim() || !!saving}
              className="font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-sm border transition-all"
              style={{
                borderColor: 'var(--border)',
                color: saving === type ? 'var(--paper)' : 'var(--muted)',
                background: saving === type ? 'var(--ink)' : 'transparent',
                opacity: !text.trim() ? 0.4 : 1,
              }}
            >
              {saving === type ? '...' : type.toLowerCase()}
            </button>
          ))}
        </div>
        {text.length > 0 && (
          <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
            {text.split(/\s+/).filter(Boolean).length} words
          </span>
        )}
      </div>
    </div>
  )
}
