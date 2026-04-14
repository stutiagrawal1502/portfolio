import { Nav } from '@/components/navigation/Nav'
import { PageTransition } from '@/components/PageTransition'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <PageTransition>{children}</PageTransition>
      <InstallPrompt />
    </>
  )
}
