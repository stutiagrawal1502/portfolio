'use client'

import { Nav } from '@/components/navigation/Nav'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { usePathname } from 'next/navigation'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <Nav />
      {/*
        The Nav is position:fixed (64px tall).
        Inner pages need a 64px spacer so content starts below the nav.
        The homepage manages its own clearance inside the full-screen hero section.
      */}
      {!isHome && (
        <div style={{ height: 80 }} aria-hidden="true" />
      )}
      {children}
      <InstallPrompt />
    </>
  )
}
