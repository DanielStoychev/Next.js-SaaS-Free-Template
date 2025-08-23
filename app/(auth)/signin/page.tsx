import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { auth } from '@/lib/auth'
import { SignInForm } from '@/components/auth/signin-form'
import { SimpleTestSignInForm } from '@/components/auth/simple-test-signin-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const searchParams = await props.searchParams
  const session = await auth()

  if (session) {
    redirect(searchParams?.callbackUrl ?? '/dashboard')
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden'>
      {/* Colorful animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-background/95' />
      <div className='absolute inset-0'>
        <div className='absolute top-0 -left-4 w-96 h-96 bg-neon-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse' />
        <div className='absolute bottom-0 -right-4 w-96 h-96 bg-electric-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-300' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyber-400/15 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-600' />
      </div>

      {/* Background Elements */}
      <div className='absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]' />

      <div className='w-full max-w-md relative z-10'>
        {/* Back Button */}
        <div className='mb-6'>
          <Button
            variant='ghost'
            size='sm'
            asChild
            className='group glass-neon border-neon-400/20 hover:bg-neon-400/10 hover:shadow-neon-400/25'
          >
            <Link href='/'>
              <ArrowLeft className='w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform text-neon-400' />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className='w-full glass-electric border-electric-400/30 shadow-lg hover:shadow-electric-400/25 transition-all duration-300'>
          <CardHeader className='space-y-3 text-center'>
            <div className='mx-auto w-12 h-12 rounded-full gradient-neon flex items-center justify-center mb-2 shadow-lg shadow-neon-400/25'>
              <span className='text-white font-bold text-lg'>S</span>
            </div>
            <CardTitle className='text-2xl font-bold gradient-text'>
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <Suspense
              fallback={
                <div className='flex items-center justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent'></div>
                </div>
              }
            >
              <SignInForm callbackUrl={searchParams?.callbackUrl} />
            </Suspense>

            {process.env.NODE_ENV === 'development' && (
              <div className='border-t pt-6 space-y-3'>
                <div className='flex items-center justify-center'>
                  <Badge
                    variant='outline'
                    className='glass-aurora border-aurora-400/30 text-aurora-400 bg-aurora-400/10'
                  >
                    Development Mode
                  </Badge>
                </div>
                <SimpleTestSignInForm />
              </div>
            )}

            <div className='text-center pt-4'>
              <p className='text-xs text-muted-foreground'>
                By signing in, you agree to our{' '}
                <Link href='/terms' className='underline hover:text-primary'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href='/privacy' className='underline hover:text-primary'>
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
