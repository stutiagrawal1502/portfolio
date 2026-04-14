import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stuti Agrawal',
  description: 'Consultant. Poet. Athlete. Figuring it out.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Stuti',
  },
  openGraph: {
    type: 'website',
    siteName: 'Stuti Agrawal',
    title: 'Stuti Agrawal',
    description: 'Consultant. Poet. Athlete. Figuring it out.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stuti Agrawal',
    description: 'Consultant. Poet. Athlete. Figuring it out.',
  },
}

export const viewport: Viewport = {
  themeColor: '#1A1714',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-mode="work">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
