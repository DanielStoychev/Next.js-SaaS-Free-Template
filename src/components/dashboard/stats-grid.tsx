'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, TrendingUp, Calendar } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: any
  trend?: {
    value: string
    type: 'up' | 'down' | 'neutral'
  }
  isLoading?: boolean
  delay?: number
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading = false,
  delay = 0,
  color = 'neon',
}: StatsCardProps & { color?: string }) {
  if (isLoading) {
    return (
      <Card className='glass-neon border-neon-400/20'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-4 rounded' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-8 w-20 mb-2' />
          <Skeleton className='h-3 w-32' />
        </CardContent>
      </Card>
    )
  }

  const colorClasses = {
    neon: 'glass-neon border-neon-400/30 hover:shadow-neon-400/25',
    electric:
      'glass-electric border-electric-400/30 hover:shadow-electric-400/25',
    cyber: 'glass-cyber border-cyber-400/30 hover:shadow-cyber-400/25',
    aurora: 'glass-aurora border-aurora-400/30 hover:shadow-aurora-400/25',
  }

  const iconColors = {
    neon: 'text-neon-400 group-hover:text-neon-300',
    electric: 'text-electric-400 group-hover:text-electric-300',
    cyber: 'text-cyber-400 group-hover:text-cyber-300',
    aurora: 'text-aurora-400 group-hover:text-aurora-300',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <Card
        className={`relative overflow-hidden group transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-${color}-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            {title}
          </CardTitle>
          <div
            className={`p-2 rounded-full bg-gradient-to-br from-${color}-400/20 to-${color}-600/10 group-hover:from-${color}-400/30 group-hover:to-${color}-600/20 transition-all duration-300`}
          >
            <Icon
              className={`h-4 w-4 ${iconColors[color as keyof typeof iconColors]} transition-colors duration-300`}
            />
          </div>
        </CardHeader>
        <CardContent className='relative'>
          <div className='text-2xl font-bold mb-1'>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-muted-foreground'>{description}</p>
            {trend && (
              <Badge
                variant={
                  trend.type === 'up'
                    ? 'default'
                    : trend.type === 'down'
                      ? 'destructive'
                      : 'secondary'
                }
                className='text-xs'
              >
                {trend.type === 'up'
                  ? '↗'
                  : trend.type === 'down'
                    ? '↘'
                    : '→'}{' '}
                {trend.value}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StatsGridProps {
  stats?: {
    totalUsers?: number
    organizations?: number
    activeProjects?: number
    joinedDate?: string
  }
  isLoading?: boolean
}

export function StatsGrid({ stats, isLoading = false }: StatsGridProps) {
  const defaultStats = {
    totalUsers: 0,
    organizations: 0,
    activeProjects: 0,
    joinedDate: 'N/A',
  }

  const currentStats = stats || defaultStats

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
      <StatsCard
        title='Total Users'
        value={currentStats.totalUsers ?? 0}
        description='Active members'
        icon={Users}
        trend={{
          value: '12%',
          type: 'up',
        }}
        isLoading={isLoading}
        delay={0}
        color='neon'
      />
      <StatsCard
        title='Organizations'
        value={currentStats.organizations ?? 0}
        description='Teams created'
        icon={Building2}
        trend={{
          value: '3%',
          type: 'up',
        }}
        isLoading={isLoading}
        delay={0.1}
        color='electric'
      />
      <StatsCard
        title='Active Projects'
        value={currentStats.activeProjects ?? 0}
        description='Projects in progress'
        icon={TrendingUp}
        trend={{
          value: '8%',
          type: 'up',
        }}
        isLoading={isLoading}
        delay={0.2}
        color='cyber'
      />
      <StatsCard
        title='Member Since'
        value={currentStats.joinedDate ?? 'N/A'}
        description='Account created'
        icon={Calendar}
        isLoading={isLoading}
        delay={0.3}
        color='aurora'
      />
    </div>
  )
}
