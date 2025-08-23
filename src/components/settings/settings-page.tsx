'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Database, Zap } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface SettingsPageProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

interface SettingsSectionProps {
  title: string
  description: string
  icon: any
  children: React.ReactNode
  color?: string
  delay?: number
}

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  color = 'neon',
  delay = 0,
}: SettingsSectionProps) {
  const colorClasses = {
    neon: 'glass-neon border-neon-400/30 hover:shadow-neon-400/25',
    electric:
      'glass-electric border-electric-400/30 hover:shadow-electric-400/25',
    cyber: 'glass-cyber border-cyber-400/30 hover:shadow-cyber-400/25',
    aurora: 'glass-aurora border-aurora-400/30 hover:shadow-aurora-400/25',
    plasma: 'glass-plasma border-plasma-400/30 hover:shadow-plasma-400/25',
  }

  const iconColors = {
    neon: 'text-neon-400',
    electric: 'text-electric-400',
    cyber: 'text-cyber-400',
    aurora: 'text-aurora-400',
    plasma: 'text-plasma-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card
        className={`transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        <CardHeader>
          <div className='flex items-center space-x-3'>
            <div
              className={`p-2 rounded-full bg-gradient-to-br from-${color}-400/20 to-${color}-600/10`}
            >
              <Icon
                className={`h-5 w-5 ${iconColors[color as keyof typeof iconColors]}`}
              />
            </div>
            <div>
              <CardTitle className='gradient-text'>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

export function SettingsPage({ user }: SettingsPageProps) {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Colorful animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-background/95' />
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-neon-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse' />
        <div className='absolute top-0 right-0 w-96 h-96 bg-electric-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-300' />
        <div className='absolute bottom-0 left-1/3 w-96 h-96 bg-cyber-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-600' />
        <div className='absolute bottom-0 right-1/3 w-96 h-96 bg-aurora-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-900' />
      </div>

      <div className='container mx-auto py-8 space-y-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center space-y-4'
        >
          <h1 className='text-4xl font-bold gradient-text'>Settings</h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Customize your account preferences and manage your SaaS experience
          </p>
          <div className='flex items-center justify-center space-x-2'>
            <Badge
              variant='outline'
              className='glass-electric border-electric-400/30 text-electric-400'
            >
              {user.role || 'USER'}
            </Badge>
            <Badge
              variant='outline'
              className='glass-neon border-neon-400/30 text-neon-400'
            >
              {user.email}
            </Badge>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className='max-w-4xl mx-auto space-y-6'>
          <SettingsSection
            title='Profile Settings'
            description='Manage your personal information and profile details'
            icon={User}
            color='neon'
            delay={0.1}
          >
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Name
                  </label>
                  <p className='text-base font-medium'>
                    {user.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email
                  </label>
                  <p className='text-base font-medium'>{user.email}</p>
                </div>
              </div>
              <Button className='gradient-neon text-white hover:shadow-lg hover:shadow-neon-400/25'>
                Update Profile
              </Button>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Notifications'
            description='Configure how you receive updates and alerts'
            icon={Bell}
            color='electric'
            delay={0.2}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Email Notifications</p>
                  <p className='text-sm text-muted-foreground'>
                    Receive updates via email
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-electric border-electric-400/30'
                >
                  Enable
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Push Notifications</p>
                  <p className='text-sm text-muted-foreground'>
                    Browser notifications for important updates
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-electric border-electric-400/30'
                >
                  Configure
                </Button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Security'
            description='Manage your account security and privacy settings'
            icon={Shield}
            color='cyber'
            delay={0.3}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Two-Factor Authentication</p>
                  <p className='text-sm text-muted-foreground'>
                    Add an extra layer of security
                  </p>
                </div>
                <Button className='gradient-cyber text-white hover:shadow-lg hover:shadow-cyber-400/25'>
                  Setup 2FA
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Password</p>
                  <p className='text-sm text-muted-foreground'>
                    Change your account password
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-cyber border-cyber-400/30'
                >
                  Change Password
                </Button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Appearance'
            description='Customize the look and feel of your interface'
            icon={Palette}
            color='aurora'
            delay={0.4}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Theme</p>
                  <p className='text-sm text-muted-foreground'>
                    Choose your preferred color theme
                  </p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='glass-neon border-neon-400/30'
                  >
                    Neon
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='glass-electric border-electric-400/30'
                  >
                    Electric
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='glass-cyber border-cyber-400/30'
                  >
                    Cyber
                  </Button>
                </div>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Layout Density</p>
                  <p className='text-sm text-muted-foreground'>
                    Adjust spacing and component sizes
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-aurora border-aurora-400/30'
                >
                  Customize
                </Button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Data & Storage'
            description='Manage your data, exports, and storage preferences'
            icon={Database}
            color='plasma'
            delay={0.5}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Export Data</p>
                  <p className='text-sm text-muted-foreground'>
                    Download your account data
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-plasma border-plasma-400/30'
                >
                  Export
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Storage Usage</p>
                  <p className='text-sm text-muted-foreground'>
                    Monitor your storage consumption
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className='glass-plasma border-plasma-400/30 text-plasma-400'
                >
                  2.4 GB / 10 GB
                </Badge>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title='Performance'
            description='Optimize performance and advanced settings'
            icon={Zap}
            color='neon'
            delay={0.6}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Auto-sync</p>
                  <p className='text-sm text-muted-foreground'>
                    Automatically sync data across devices
                  </p>
                </div>
                <Button className='gradient-neon text-white hover:shadow-lg hover:shadow-neon-400/25'>
                  Enabled
                </Button>
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Cache Settings</p>
                  <p className='text-sm text-muted-foreground'>
                    Manage local cache and performance
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='glass-neon border-neon-400/30'
                >
                  Clear Cache
                </Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  )
}
