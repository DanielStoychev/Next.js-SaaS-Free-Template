import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { api } from '@/trpc/server'
import { SignOutButton } from '@/components/auth/signout-button'
import { UserProfile } from '@/components/user/user-profile'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { AnalyticsSection } from '@/components/dashboard/analytics'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  // Test the tRPC API (server-side)
  const user = await api.user.getCurrentUser()

  // Mock stats for demonstration
  const stats = {
    totalUsers: 1,
    organizations: user?.memberships?.length || 0,
    activeProjects: Math.floor(Math.random() * 10) + 1,
    joinedDate: new Date(user?.createdAt || Date.now()).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
      }
    ),
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Colorful animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-background/95' />
      <div className='absolute inset-0'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-electric-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-cyber-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-400' />
        <div className='absolute top-1/3 left-1/2 w-72 h-72 bg-neon-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-800' />
      </div>

      <div className='container mx-auto py-8 space-y-8 relative z-10'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-12 w-12'>
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || 'User'}
              />
              <AvatarFallback className='text-lg'>
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-3xl font-bold'>
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className='text-muted-foreground'>
                Here's what's happening with your account
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <Badge variant='outline' className='hidden sm:inline-flex'>
              {user?.role || 'USER'}
            </Badge>
            <SignOutButton />
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Analytics Section */}
        <AnalyticsSection />

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* User Profile Card */}
          <Card className='glass-electric border-electric-400/30 hover:shadow-electric-400/25 transition-all duration-300'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-xl gradient-text'>
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and settings
                  </CardDescription>
                </div>
                <SignOutButton />
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Name
                  </p>
                  <p className='text-base font-medium'>
                    {user?.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Email
                  </p>
                  <p className='text-base font-medium'>{user?.email}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Role
                  </p>
                  <Badge
                    variant='outline'
                    className='glass-neon border-neon-400/30 text-neon-400'
                  >
                    {user?.role}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Member Since
                  </p>
                  <p className='text-base font-medium'>{stats.joinedDate}</p>
                </div>
              </div>
              <Separator />
              <div className='pt-2'>
                <UserProfile />
              </div>
            </CardContent>
          </Card>

          {/* Organizations Card */}
          <Card className='glass-cyber border-cyber-400/30 hover:shadow-cyber-400/25 transition-all duration-300'>
            <CardHeader>
              <CardTitle className='gradient-text'>Organizations</CardTitle>
              <CardDescription>Teams you belong to</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.memberships && user.memberships.length > 0 ? (
                <div className='space-y-3'>
                  {user.memberships.map((membership: any) => (
                    <div
                      key={membership.id}
                      className='flex items-center justify-between p-3 rounded-lg glass-aurora border-aurora-400/20 hover:bg-aurora-400/10 transition-colors'
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='h-8 w-8 rounded-full gradient-aurora flex items-center justify-center shadow-lg shadow-aurora-400/25'>
                          <span className='text-sm font-medium text-white'>
                            {membership.organization.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className='font-medium'>
                            {membership.organization.name}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Organization
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant='secondary'
                        className='text-xs glass-plasma border-plasma-400/30 text-plasma-400'
                      >
                        {membership.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-6'>
                  <p className='text-muted-foreground mb-2'>
                    No organizations yet
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Join or create an organization to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
