'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  posts:  { id: string; title: string; type: string; status: string; slug: string; updatedAt: string }[]
  notes:  { id: string; content: string; tags: string[]; updatedAt: string }[]
  goals:  { id: string; title: string; area: string; status: string }[]
}

const TYPE_COLORS: Record<string, string> = {
  BLOG: '#93C5FD', POEM: '#FCD34D', JOURNAL: '#C4B5FD',
  ESSAY: '#86EFAC', CSR: '#6EE7B7', SPORTS: '#F9A8D4', FITNESS_REFLECTION: '#86EFAC',
}
const AREA_COLORS: Record<string, string> = {
  FITNESS: '#86EFAC', CAREER: '#93C5FD', CREATIVE: '#FCD34D',
  HEALTH: '#F9A8D4', FINANCE: '#6EE7B7', PERSONAL: '#C4B5FD', LEARNING: '#FB923C',
}

function firstLine(content: string) {
  return content.split('\n')[0].replace(/#\w+/g, '').trim().slice(0, 60) || 'Note'
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) { setQuery(''); setResults(null); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [isOpen])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) setResults(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => search(query), 250)
    return () => { if (debounce.current) clearTimeout(debounce.current) }
  }, [query, search])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  const hasResults = results && (results.posts.length + results.notes.length + results.goals.length) > 0
  const noResults  = results && !hasResults

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 600, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border-solid)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)', overflow: 'hidden' }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border-solid)' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: 'var(--muted)', flexShrink: 0 }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts, notes, goals…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--ink)' }}
          />
          {loading && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>…</span>}
          <button onClick={onClose} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', background: 'none', border: '1px solid var(--border-solid)', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}>ESC</button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          {!query && (
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Quick jump</p>
              {[
                { label: 'Dashboard',  href: '/dashboard'  },
                { label: 'Write',      href: '/write'      },
                { label: 'Notes',      href: '/notes'      },
                { label: 'Goals',      href: '/goals'      },
                { label: 'Review',     href: '/review'     },
                { label: 'Reading',    href: '/reading'    },
              ].map(l => (
                <Link key={l.href} href={l.href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--muted)' }}>→</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)' }}>{l.label}</span>
                </Link>
              ))}
            </div>
          )}

          {noResults && (
            <div style={{ padding: '32px 20px', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
              No results for "{query}"
            </div>
          )}

          {hasResults && results && (
            <div style={{ padding: '8px 0' }}>
              {results.posts.length > 0 && (
                <Section label="Posts">
                  {results.posts.map(p => (
                    <ResultRow
                      key={p.id}
                      href={`/write/${p.id}`}
                      badge={p.type.replace('_', ' ')}
                      badgeColor={TYPE_COLORS[p.type] ?? '#93C5FD'}
                      title={p.title || 'Untitled'}
                      meta={p.status}
                      onClose={onClose}
                    />
                  ))}
                </Section>
              )}
              {results.notes.length > 0 && (
                <Section label="Notes">
                  {results.notes.map(n => (
                    <ResultRow
                      key={n.id}
                      href="/notes"
                      badge="NOTE"
                      badgeColor="#C4B5FD"
                      title={firstLine(n.content)}
                      meta={n.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
                      onClose={onClose}
                    />
                  ))}
                </Section>
              )}
              {results.goals.length > 0 && (
                <Section label="Goals">
                  {results.goals.map(g => (
                    <ResultRow
                      key={g.id}
                      href="/goals"
                      badge={g.area}
                      badgeColor={AREA_COLORS[g.area] ?? '#C4B5FD'}
                      title={g.title}
                      meta={g.status}
                      onClose={onClose}
                    />
                  ))}
                </Section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border-solid)', display: 'flex', gap: 20 }}>
          {[['↵', 'open'], ['ESC', 'close']].map(([key, action]) => (
            <span key={key} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <kbd style={{ background: 'var(--paper)', border: '1px solid var(--border-solid)', borderRadius: 3, padding: '1px 5px', fontSize: 10 }}>{key}</kbd>
              {action}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', padding: '8px 20px 4px' }}>{label}</div>
      {children}
    </div>
  )
}

function ResultRow({ href, badge, badgeColor, title, meta, onClose }: { href: string; badge: string; badgeColor: string; title: string; meta: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 20px', textDecoration: 'none', transition: 'background 0.1s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', color: badgeColor, background: `${badgeColor}15`, border: `1px solid ${badgeColor}30`, borderRadius: 3, padding: '2px 7px', flexShrink: 0 }}>
        {badge}
      </span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--ink)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </span>
      {meta && (
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)', flexShrink: 0 }}>{meta}</span>
      )}
    </Link>
  )
}
