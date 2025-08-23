'use server'

import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function testUserSignInAction(formData: FormData) {
  const userType = formData.get('userType') as 'user' | 'admin'

  try {
    await signIn('test-user', {
      testUser: userType,
      redirectTo: '/',
    })
  } catch (error) {
    console.error('Sign in error:', error)
    redirect('/signin?error=signin')
  }
}
