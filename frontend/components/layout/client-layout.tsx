'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
