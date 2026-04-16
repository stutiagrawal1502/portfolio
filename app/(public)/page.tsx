'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DawnBackground } from '@/components/home/DawnBackground'
import { TheToggle } from '@/components/home/TheToggle'
import { WorkMode } from '@/components/home/WorkMode'
import { LifeMode } from '@/components/home/LifeMode'
import Link from 'next/link'

type Mode = 'work' | 'life'

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('work')
  const [dayNumber, setDayNumber] = useState<number | undefined>()

  useEffect(() => {
    fetch('/api/journey')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.dayNumber) setDayNumber(d.dayNumber) })
      .catch(() => {})
  }, [])

  return (
    <div style={{ background: 'var(--paper)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--hero-bg)',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <DawnBackground />

        <div
          className="relative z-10"
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', paddingTop: 100 }}
        >
          {/* Eyebrow — role label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--dawn-rose)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(250,248,244,0.42)',
              }}
            >
              Consultant · Poet · Athlete
            </span>
          </motion.div>

          {/* Name — the hero */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(4.5rem, 11vw, 9rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              color: '#F8F4EE',
              marginBottom: 36,
            }}
          >
            Stuti
            <br />
            <span style={{ color: 'rgba(248,244,238,0.55)' }}>Agrawal</span>
          </motion.h1>

          {/* Descriptor — changes with mode */}
          <motion.p
            key={`desc-${mode}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              color: 'rgba(248,244,238,0.46)',
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: 420,
              marginBottom: 48,
            }}
          >
            {mode === 'work'
              ? 'EY Risk Advisory & Internal Controls · 3 years · Mumbai'
              : 'Poet · Athlete · 180-day journey · Figuring it out in public'}
          </motion.p>

          {/* The toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TheToggle onChange={setMode} />
          </motion.div>
        </div>

        {/* Scroll indicator — bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: 36,
            left: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 1, height: 44, background: 'rgba(248,244,238,0.14)' }} />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(248,244,238,0.22)',
            }}
          >
            Scroll to explore
          </span>
        </motion.div>
      </section>

      {/* ── MODE CONTENT ─────────────────────────────────────────────── */}
      <div style={{ background: 'var(--paper)' }}>
        <AnimatePresence mode="wait">
          <motion.section
            key={`mode-${mode}`}
            style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {mode === 'work' ? (
              <WorkMode />
            ) : (
              <LifeMode dayNumber={dayNumber} />
            )}
          </motion.section>
        </AnimatePresence>

        {/* Journey progress strip */}
        {dayNumber && (
          <div style={{ borderTop: '1px solid var(--border-solid)' }}>
            <Link href="/fitness" className="block group">
              <div
                style={{
                  maxWidth: 1100,
                  margin: '0 auto',
                  padding: '16px 48px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                  }}
                >
                  Journey
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  Day {dayNumber} / 180
                </span>
                <div className="progress-bar-track" style={{ maxWidth: 200, flex: 1 }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, (dayNumber / 180) * 100)}%` }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: 'var(--muted)',
                    marginLeft: 'auto',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                  className="group-hover:opacity-100"
                >
                  View →
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Latest writing */}
        <LatestWriting />
      </div>
    </div>
  )
}

/* ── Latest Writing ─────────────────────────────────────────────────────── */
function LatestWriting() {
  const [posts, setPosts] = useState<{
    id: string; title: string; slug: string
    type: string; mood?: string | null; excerpt?: string | null
  }[]>([])

  useEffect(() => {
    fetch('/api/posts?status=PUBLISHED&limit=3')
      .then(r => r.ok ? r.json() : [])
      .then(setPosts).catch(() => {})
  }, [])

  if (!posts.length) return null

  const typeClass: Record<string, string> = {
    POEM: 'type-badge-poem',
    BLOG: 'type-badge-blog',
    JOURNAL: 'type-badge-journal',
    ESSAY: 'type-badge-essay',
    CSR: 'type-badge-csr',
    SPORTS: 'type-badge-sports',
    FITNESS_REFLECTION: 'type-badge-fitness',
  }

  return (
    <section
      style={{
        borderTop: '1px solid var(--border-solid)',
        padding: '80px 48px',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 48,
        }}
      >
        <div>
          <span className="section-eyebrow">Writing</span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 400,
              color: 'var(--ink)',
              lineHeight: 1.1,
            }}
          >
            Latest expressions
          </h2>
        </div>
        <Link
          href="/expressions"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          View all →
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {posts.map(post => (
          <Link
            key={post.id}
            href={`/expressions/${post.slug}`}
            style={{ display: 'block', textDecoration: 'none' }}
          >
            <div className="card" style={{ cursor: 'pointer' }}>
              <span
                className={`type-badge ${typeClass[post.type] ?? 'type-badge-journal'}`}
                style={{ marginBottom: 12, display: 'inline-block' }}
              >
                {post.type.replace('_', ' ').toLowerCase()}
              </span>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 400,
                  color: 'var(--ink)',
                  lineHeight: 1.35,
                  marginBottom: 8,
                }}
              >
                {post.title}
              </h3>
              {post.excerpt && (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: 'var(--muted)',
                    lineHeight: 1.55,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.excerpt}
                </p>
              )}
              {post.mood && (
                <span className="mood-tag" style={{ marginTop: 12, display: 'inline-block' }}>
                  {post.mood}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
