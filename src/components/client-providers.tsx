'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

import { TRPCReactProvider } from '@/trpc/react'

interface ClientProvidersProps {
  children: React.ReactNode
  cookies: string
}

export function ClientProviders({ children, cookies }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <TRPCReactProvider cookies={cookies}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </TRPCReactProvider>
    </SessionProvider>
  )
}
