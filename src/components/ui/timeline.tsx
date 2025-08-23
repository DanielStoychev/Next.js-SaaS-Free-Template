'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, AlertCircle, User, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: Date | string
  status?: 'pending' | 'completed' | 'in-progress' | 'cancelled'
  user?: {
    name: string
    avatar?: string
    email?: string
  }
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
  animated?: boolean
}

const statusIcons = {
  pending: Clock,
  completed: CheckCircle2,
  'in-progress': AlertCircle,
  cancelled: AlertCircle,
}

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/20',
  completed: 'text-green-400 bg-green-400/20',
  'in-progress': 'text-blue-400 bg-blue-400/20',
  cancelled: 'text-red-400 bg-red-400/20',
}

const colorVariants = {
  blue: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
  green: 'text-green-400 bg-green-400/20 border-green-400/30',
  yellow: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30',
  red: 'text-red-400 bg-red-400/20 border-red-400/30',
  purple: 'text-purple-400 bg-purple-400/20 border-purple-400/30',
}

export function Timeline({ items, className, animated = true }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div className='absolute left-4 top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent' />

      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={animated ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className='relative flex items-start gap-4 pb-8 last:pb-0'
          >
            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 backdrop-blur-sm',
                item.status
                  ? statusColors[item.status]
                  : 'text-white/70 bg-white/10 border-white/20',
                item.color && colorVariants[item.color]
              )}
            >
              {item.icon ? (
                <div className='h-4 w-4'>{item.icon}</div>
              ) : item.status ? (
                React.createElement(statusIcons[item.status], {
                  className: 'h-4 w-4',
                })
              ) : (
                <div className='h-2 w-2 rounded-full bg-current' />
              )}
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-4 hover:bg-black/60 transition-all duration-200'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-sm font-medium text-white leading-tight'>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className='mt-1 text-sm text-white/70 leading-relaxed'>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.status && (
                    <Badge
                      variant='secondary'
                      className={cn(
                        'text-xs border-0 font-medium',
                        statusColors[item.status]
                      )}
                    >
                      {item.status.replace('-', ' ')}
                    </Badge>
                  )}
                </div>

                <div className='flex items-center justify-between mt-3 pt-3 border-t border-white/5'>
                  <div className='flex items-center gap-2 text-xs text-white/50'>
                    <Calendar className='h-3 w-3' />
                    <span>
                      {typeof item.timestamp === 'string'
                        ? item.timestamp
                        : item.timestamp.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                    </span>
                  </div>

                  {item.user && (
                    <div className='flex items-center gap-2'>
                      {item.user.avatar ? (
                        <img
                          src={item.user.avatar}
                          alt={item.user.name}
                          className='h-5 w-5 rounded-full border border-white/10'
                        />
                      ) : (
                        <div className='h-5 w-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center'>
                          <User className='h-3 w-3 text-white/50' />
                        </div>
                      )}
                      <span className='text-xs text-white/70'>
                        {item.user.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
