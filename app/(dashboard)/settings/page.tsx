import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SettingsPage } from '@/components/settings/settings-page'

export const metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
}

export default async function Settings() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  return <SettingsPage />
}
