'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
  message?: string
}

export function LoadingSpinner({
  size = 'default',
  variant = 'default',
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const variantClasses = {
    default: 'border-primary border-t-transparent',
    neon: 'border-neon-400 border-t-transparent shadow-neon-glow',
    electric: 'border-electric-400 border-t-transparent shadow-electric-glow',
    cyber: 'border-cyber-400 border-t-transparent shadow-cyber-glow',
    aurora: 'border-aurora-400 border-t-transparent shadow-aurora-glow',
    plasma: 'border-plasma-400 border-t-transparent shadow-plasma-glow',
  }

  return (
    <div className='flex items-center justify-center gap-3'>
      <motion.div
        className={`${sizeClasses[size]} border-2 ${variantClasses[variant]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {message && (
        <span className='text-sm text-muted-foreground'>{message}</span>
      )}
    </div>
  )
}

export function LoadingPulse({
  variant = 'neon',
}: {
  variant?: 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
}) {
  const colors = {
    neon: 'bg-neon-400',
    electric: 'bg-electric-400',
    cyber: 'bg-cyber-400',
    aurora: 'bg-aurora-400',
    plasma: 'bg-plasma-400',
  }

  return (
    <div className='flex items-center justify-center space-x-2'>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className={`w-3 h-3 ${colors[variant]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function LoadingWave({
  variant = 'electric',
}: {
  variant?: 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
}) {
  const colors = {
    neon: 'bg-neon-500',
    electric: 'bg-electric-500',
    cyber: 'bg-cyber-500',
    aurora: 'bg-aurora-500',
    plasma: 'bg-plasma-500',
  }

  return (
    <div className='flex items-end justify-center space-x-1'>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className={`w-2 ${colors[variant]} rounded-full`}
          animate={{
            height: [20, 40, 20],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

export function LoadingProgress({
  progress = 0,
  variant = 'cyber',
  showPercentage = true,
}: {
  progress?: number
  variant?: 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
  showPercentage?: boolean
}) {
  const colors = {
    neon: 'bg-gradient-to-r from-neon-400 to-neon-600',
    electric: 'bg-gradient-to-r from-electric-400 to-electric-600',
    cyber: 'bg-gradient-to-r from-cyber-400 to-cyber-600',
    aurora: 'bg-gradient-to-r from-aurora-400 to-aurora-600',
    plasma: 'bg-gradient-to-r from-plasma-400 to-plasma-600',
  }

  return (
    <div className='w-full space-y-2'>
      <div className='w-full bg-muted/30 rounded-full h-2 overflow-hidden'>
        <motion.div
          className={`h-full ${colors[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {showPercentage && (
        <div className='text-center text-sm text-muted-foreground'>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

export function LoadingSkeleton({
  variant = 'aurora',
  lines = 3,
  className = '',
}: {
  variant?: 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
  lines?: number
  className?: string
}) {
  const colors = {
    neon: 'from-neon-200/20 to-neon-400/20',
    electric: 'from-electric-200/20 to-electric-400/20',
    cyber: 'from-cyber-200/20 to-cyber-400/20',
    aurora: 'from-aurora-200/20 to-aurora-400/20',
    plasma: 'from-plasma-200/20 to-plasma-400/20',
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-4 bg-gradient-to-r ${colors[variant]} rounded-md`}
          style={{ width: `${90 - i * 10}%` }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function LoadingPage({
  variant = 'neon',
  message = 'Loading your experience...',
  showProgress = false,
  progress = 0,
}: {
  variant?: 'neon' | 'electric' | 'cyber' | 'aurora' | 'plasma'
  message?: string
  showProgress?: boolean
  progress?: number
}) {
  const gradients = {
    neon: 'from-neon-900/10 via-background to-neon-900/10',
    electric: 'from-electric-900/10 via-background to-electric-900/10',
    cyber: 'from-cyber-900/10 via-background to-cyber-900/10',
    aurora: 'from-aurora-900/10 via-background to-aurora-900/10',
    plasma: 'from-plasma-900/10 via-background to-plasma-900/10',
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${gradients[variant]}`}
    >
      <div className='text-center space-y-8 max-w-md mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LoadingSpinner size='lg' variant={variant} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='space-y-4'
        >
          <p className='text-lg font-medium text-foreground'>{message}</p>

          {showProgress && (
            <div className='w-full max-w-xs mx-auto'>
              <LoadingProgress
                progress={progress}
                variant={variant}
                showPercentage={true}
              />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <LoadingPulse variant={variant} />
        </motion.div>
      </div>
    </div>
  )
}
