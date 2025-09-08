import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/layout/client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinTwin - AI Financial Twin & CA Ecosystem',
  description: 'India\'s first AI Financial Twin + Chartered Accountant Ecosystem platform',
  keywords: ['financial planning', 'AI', 'CA', 'tax filing', 'accounting', 'India'],
  authors: [{ name: 'FinTwin Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'FinTwin - AI Financial Twin & CA Ecosystem',
    description: 'India\'s first AI Financial Twin + Chartered Accountant Ecosystem platform',
    type: 'website',
    locale: 'en_IN',
    siteName: 'FinTwin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinTwin - AI Financial Twin & CA Ecosystem',
    description: 'India\'s first AI Financial Twin + Chartered Accountant Ecosystem platform',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}