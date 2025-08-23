'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Github, Mail, User } from 'lucide-react'

interface SignInFormProps {
  callbackUrl?: string
}

const providerIcons = {
  github: Github,
  google: Mail,
  credentials: User,
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res || {})
    }
    fetchProviders()
  }, [])

  const handleSignIn = async (providerId: string) => {
    await signIn(providerId, {
      redirectTo: callbackUrl ?? '/dashboard',
    })
  }

  // If no providers are configured, show a message
  if (Object.keys(providers).length === 0) {
    return (
      <div className='space-y-4 text-center'>
        <p className='text-sm text-muted-foreground'>
          No OAuth providers configured
        </p>
        <p className='text-xs text-muted-foreground'>
          To enable authentication, add OAuth credentials to your .env.local
          file
        </p>
        <div className='rounded-md bg-muted p-3 text-xs'>
          <p className='font-mono'>GITHUB_CLIENT_ID=your_client_id</p>
          <p className='font-mono'>GITHUB_CLIENT_SECRET=your_secret</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {Object.values(providers).map((provider: any, index: number) => {
        const Icon =
          providerIcons[provider.id as keyof typeof providerIcons] || User
        const colorClasses = [
          'glass-neon border-neon-400/30 hover:bg-neon-400/10 hover:shadow-neon-400/25 text-neon-400',
          'glass-electric border-electric-400/30 hover:bg-electric-400/10 hover:shadow-electric-400/25 text-electric-400',
          'glass-cyber border-cyber-400/30 hover:bg-cyber-400/10 hover:shadow-cyber-400/25 text-cyber-400',
        ]
        return (
          <Button
            key={provider.id}
            variant='outline'
            className={`w-full transition-all duration-300 ${colorClasses[index % colorClasses.length]}`}
            onClick={() => handleSignIn(provider.id)}
          >
            <Icon className='mr-2 h-4 w-4' />
            Continue with {provider.name}
          </Button>
        )
      })}
    </div>
  )
}
