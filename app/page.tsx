import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Hero } from '@/components/sections/hero'

export default async function HomePage() {
  const session = await auth()

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return <Hero />
}
