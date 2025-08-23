'use client'

import { testUserSignInAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SimpleTestSignInForm() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className='border-dashed border-2'>
      <CardHeader>
        <CardTitle className='text-lg'>Development Test Login</CardTitle>
        <CardDescription>
          Quick login buttons for testing (development only)
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <form action={testUserSignInAction}>
          <input type='hidden' name='userType' value='user' />
          <Button type='submit' variant='outline' className='w-full'>
            Sign In as Regular User
          </Button>
        </form>
        <form action={testUserSignInAction}>
          <input type='hidden' name='userType' value='admin' />
          <Button type='submit' variant='outline' className='w-full'>
            Sign In as Admin User
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
