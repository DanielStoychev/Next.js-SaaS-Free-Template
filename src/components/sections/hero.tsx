'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Sparkles, Rocket } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Colorful animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-background/95' />
      <div className='absolute inset-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-neon-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-electric-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-200' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-cyber-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-500' />
        <div className='absolute -bottom-8 right-20 w-72 h-72 bg-aurora-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-700' />
      </div>

      {/* Animated background grid */}
      <div className='absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]' />

      {/* Floating colorful orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className='absolute top-20 left-20 w-72 h-72 gradient-neon rounded-full blur-3xl opacity-30'
      />
      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 80, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 2,
        }}
        className='absolute bottom-20 right-20 w-96 h-96 gradient-electric rounded-full blur-3xl opacity-20'
      />

      <div className='container mx-auto px-4 py-32 relative z-10'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant='outline'
              className='mb-6 px-4 py-2 glass-neon border-neon-400/30'
            >
              <Sparkles className='w-4 h-4 mr-2 text-neon-400' />
              Super Ultra Modern SaaS Template
            </Badge>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8'
          >
            Build Your Next <span className='gradient-text'>SaaS Product</span>
            <br />
            in Record Time
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed'
          >
            A production-ready Next.js 15 template with authentication,
            payments, and everything you need to launch your SaaS in days, not
            months.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'
          >
            <Button
              size='lg'
              asChild
              className='group gradient-neon text-white border-0 hover:shadow-lg hover:shadow-neon-400/25 transition-all duration-300'
            >
              <Link href='/signin'>
                Get Started Free
                <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              asChild
              className='glass-electric border-electric-400/30 hover:bg-electric-400/10 hover:shadow-lg hover:shadow-electric-400/25 transition-all duration-300'
            >
              <Link href='/dashboard'>View Live Demo</Link>
            </Button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className='grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto'
          >
            <FeatureItem
              icon={Zap}
              title='Lightning Fast'
              description='Built with Next.js 15 and optimized for performance'
              color='neon'
            />
            <FeatureItem
              icon={Shield}
              title='Enterprise Ready'
              description='Production-grade security and authentication'
              color='electric'
            />
            <FeatureItem
              icon={Rocket}
              title='Modern Stack'
              description='TypeScript, tRPC, Prisma, and Tailwind CSS'
              color='cyber'
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeatureItem({
  icon: Icon,
  title,
  description,
  color = 'neon',
}: {
  icon: any
  title: string
  description: string
  color?: string
}) {
  const colorClasses = {
    neon: 'glass-neon border-neon-400/20 hover:shadow-neon-400/25',
    electric:
      'glass-electric border-electric-400/20 hover:shadow-electric-400/25',
    cyber: 'glass-cyber border-cyber-400/20 hover:shadow-cyber-400/25',
    aurora: 'glass-aurora border-aurora-400/20 hover:shadow-aurora-400/25',
  }

  const iconColors = {
    neon: 'text-neon-400',
    electric: 'text-electric-400',
    cyber: 'text-cyber-400',
    aurora: 'text-aurora-400',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`flex flex-col items-center p-6 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} hover:shadow-lg transition-all duration-300`}
    >
      <div
        className={`p-3 rounded-full bg-gradient-to-br from-${color}-400/20 to-${color}-600/10 mb-4`}
      >
        <Icon
          className={`h-6 w-6 ${iconColors[color as keyof typeof iconColors]}`}
        />
      </div>
      <h3 className='text-lg font-semibold mb-2'>{title}</h3>
      <p className='text-sm text-muted-foreground text-center leading-relaxed'>
        {description}
      </p>
    </motion.div>
  )
}
