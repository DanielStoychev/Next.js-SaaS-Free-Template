'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface SignOutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
    })
  }

  return (
    <Button variant='ghost' className={className} onClick={handleSignOut}>
      {children ?? (
        <>
          <LogOut className='mr-2 h-4 w-4' />
          Sign out
        </>
      )}
    </Button>
  )
}
