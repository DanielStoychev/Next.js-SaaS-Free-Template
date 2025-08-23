'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TestSignInFormProps {
  callbackUrl?: string
}

export function TestSignInForm({ callbackUrl }: TestSignInFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleTestSignIn = async (userType: 'user' | 'admin') => {
    setIsLoading(true)
    try {
      await signIn('test-user', {
        testUser: userType,
        redirectTo: callbackUrl ?? '/dashboard',
      })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-3'>
      <h3 className='text-lg font-medium text-center'>
        Development Test Login
      </h3>

      <Button
        onClick={() => handleTestSignIn('user')}
        disabled={isLoading}
        className='w-full'
        variant='outline'
      >
        Sign In as Regular User
      </Button>

      <Button
        onClick={() => handleTestSignIn('admin')}
        disabled={isLoading}
        className='w-full'
        variant='outline'
      >
        Sign In as Admin User
      </Button>

      <p className='text-xs text-muted-foreground text-center'>
        Development only - creates test users in the database
      </p>
    </div>
  )
}
