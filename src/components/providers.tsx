import { cookies } from 'next/headers'
import { ClientProviders } from './client-providers'

export async function Providers({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  return (
    <ClientProviders cookies={cookieStore.toString()}>
      {children}
    </ClientProviders>
  )
}
