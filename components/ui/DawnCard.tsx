'use client'

import { motion } from 'framer-motion'
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
}: DawnCardProps) {
  const inner = (
    <motion.div
      className={`dawn-card cursor-pointer ${className}`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={onClick}
    >
      {badge && (
        <span className={`type-badge mb-3 block w-fit ${badgeClass ?? ''}`}>
          {badge}
        </span>
      )}
      <h3 className="font-display text-xl font-normal text-ink leading-snug mb-1">
        {title}
      </h3>
      {subtitle && (
        <p className="font-sans text-muted text-sm mt-1">{subtitle}</p>
      )}
      {mood && <span className="mood-tag mt-3 inline-block">{mood}</span>}
      {children}
    </motion.div>
  )

  if (href) return <Link href={href}>{inner}</Link>
  return inner
}
