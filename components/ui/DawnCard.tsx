'use client'

import Link from 'next/link'

interface DawnCardProps {
  title: string
  subtitle?: string
  badge?: string
  badgeClass?: string
  mood?: string
  href?: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  featured?: boolean
}

export function DawnCard({
  title,
  subtitle,
  badge,
  badgeClass,
  mood,
  href,
  children,
  className = '',
  onClick,
  featured = false,
}: DawnCardProps) {
  const base = featured ? 'card-featured' : 'card'

  const inner = (
    <div
      className={`${base} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick || href ? 'pointer' : 'default' }}
    >
      {badge && (
        <span
          className={`type-badge ${badgeClass ?? ''}`}
          style={{ marginBottom: 14, display: 'inline-block' }}
        >
          {badge}
        </span>
      )}
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: featured ? 22 : 18,
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1.3,
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
      {mood && (
        <span className="mood-tag" style={{ marginTop: 12, display: 'inline-block' }}>
          {mood}
        </span>
      )}
      {children}
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
        {inner}
      </Link>
    )
  }

  return inner
}
