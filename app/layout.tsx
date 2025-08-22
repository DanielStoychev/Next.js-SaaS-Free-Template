import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'SaaS Template',
    template: '%s | SaaS Template',
  },
  description: 'A modern, production-ready SaaS template built with Next.js 14',
  keywords: ['SaaS', 'Template', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  authors: [
    {
      name: 'SaaS Template',
    },
  ],
  creator: 'SaaS Template',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'SaaS Template',
    description: 'A modern, production-ready SaaS template built with Next.js 14',
    siteName: 'SaaS Template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Template',
    description: 'A modern, production-ready SaaS template built with Next.js 14',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
