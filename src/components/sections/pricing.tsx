'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Crown, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  color: string
  icon: any
  popular?: boolean
  cta: string
  href: string
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Perfect for individuals and small projects',
    features: [
      '5 Projects',
      '10GB Storage',
      'Email Support',
      'Basic Analytics',
      'SSL Certificate',
    ],
    color: 'neon',
    icon: Zap,
    cta: 'Start Free Trial',
    href: '/signin',
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'Ideal for growing businesses and teams',
    features: [
      'Unlimited Projects',
      '100GB Storage',
      'Priority Support',
      'Advanced Analytics',
      'Custom Domain',
      'Team Collaboration',
      'API Access',
    ],
    color: 'electric',
    icon: Star,
    popular: true,
    cta: 'Get Started',
    href: '/signin',
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large organizations with advanced needs',
    features: [
      'Everything in Professional',
      '1TB Storage',
      'Dedicated Support',
      'Advanced Security',
      'White-label Options',
      'Custom Integrations',
      'SLA Guarantee',
      'Advanced Reporting',
    ],
    color: 'cyber',
    icon: Crown,
    cta: 'Contact Sales',
    href: '/contact',
  },
]

interface PricingCardProps {
  tier: PricingTier
  delay: number
}

function PricingCard({ tier, delay }: PricingCardProps) {
  const colorClasses = {
    neon: 'glass-neon border-neon-400/30 hover:shadow-neon-400/25',
    electric:
      'glass-electric border-electric-400/30 hover:shadow-electric-400/25',
    cyber: 'glass-cyber border-cyber-400/30 hover:shadow-cyber-400/25',
    aurora: 'glass-aurora border-aurora-400/30 hover:shadow-aurora-400/25',
  }

  const iconColors = {
    neon: 'text-neon-400',
    electric: 'text-electric-400',
    cyber: 'text-cyber-400',
    aurora: 'text-aurora-400',
  }

  const buttonClasses = {
    neon: 'gradient-neon text-white hover:shadow-lg hover:shadow-neon-400/25',
    electric:
      'gradient-electric text-white hover:shadow-lg hover:shadow-electric-400/25',
    cyber:
      'gradient-cyber text-white hover:shadow-lg hover:shadow-cyber-400/25',
    aurora:
      'gradient-aurora text-white hover:shadow-lg hover:shadow-aurora-400/25',
  }

  const Icon = tier.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{
        scale: tier.popular ? 1.05 : 1.03,
        y: tier.popular ? -10 : -5,
        transition: { duration: 0.2 },
      }}
      className='relative'
    >
      {tier.popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3 }}
          className='absolute -top-4 left-1/2 transform -translate-x-1/2 z-10'
        >
          <Badge className='glass-electric border-electric-400/30 text-electric-400 px-4 py-1'>
            <Sparkles className='w-3 h-3 mr-1' />
            Most Popular
          </Badge>
        </motion.div>
      )}

      <Card
        className={`relative h-full transition-all duration-300 ${colorClasses[tier.color as keyof typeof colorClasses]} ${tier.popular ? 'scale-105 border-2' : ''}`}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-${tier.color}-400/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl`}
        />

        <CardHeader className='relative text-center pb-8 pt-8'>
          <div
            className={`mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-${tier.color}-400/20 to-${tier.color}-600/10`}
          >
            <Icon
              className={`h-8 w-8 ${iconColors[tier.color as keyof typeof iconColors]}`}
            />
          </div>

          <CardTitle className='text-2xl font-bold gradient-text'>
            {tier.name}
          </CardTitle>
          <CardDescription className='text-muted-foreground mt-2'>
            {tier.description}
          </CardDescription>

          <div className='mt-6'>
            <div className='flex items-baseline justify-center'>
              <span className='text-5xl font-bold gradient-text'>
                {tier.price}
              </span>
              <span className='text-xl text-muted-foreground ml-1'>
                {tier.period}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className='relative space-y-6'>
          <ul className='space-y-3'>
            {tier.features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 + index * 0.05 }}
                className='flex items-center'
              >
                <Check
                  className={`h-4 w-4 ${iconColors[tier.color as keyof typeof iconColors]} mr-3 flex-shrink-0`}
                />
                <span className='text-sm'>{feature}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='pt-4'
          >
            <Button
              asChild
              className={`w-full transition-all duration-300 ${buttonClasses[tier.color as keyof typeof buttonClasses]}`}
              size='lg'
            >
              <Link href={tier.href}>{tier.cta}</Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function PricingSection() {
  return (
    <section className='min-h-screen relative overflow-hidden py-20'>
      {/* Colorful animated background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-background/95' />
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-neon-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse' />
        <div className='absolute top-1/4 right-0 w-96 h-96 bg-electric-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse animation-delay-300' />
        <div className='absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyber-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse animation-delay-600' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-aurora-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-900' />
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center max-w-3xl mx-auto mb-16'
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className='mb-6'
          >
            <Badge
              variant='outline'
              className='glass-aurora border-aurora-400/30 text-aurora-400 px-4 py-2'
            >
              <Sparkles className='w-4 h-4 mr-2' />
              Flexible Pricing
            </Badge>
          </motion.div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6'>
            Choose Your <span className='gradient-text'>Perfect Plan</span>
          </h1>

          <p className='text-xl text-muted-foreground leading-relaxed'>
            Start free and scale as you grow. All plans include our core
            features with transparent pricing and no hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='text-center mt-20'
        >
          <h2 className='text-2xl font-bold gradient-text mb-4'>
            Questions about pricing?
          </h2>
          <p className='text-muted-foreground mb-6'>
            Our team is here to help you choose the right plan for your needs.
          </p>
          <Button
            asChild
            variant='outline'
            className='glass-neon border-neon-400/30 hover:bg-neon-400/10 hover:shadow-neon-400/25'
            size='lg'
          >
            <Link href='/contact'>Contact Sales</Link>
          </Button>
        </motion.div>

        {/* Enterprise Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className='mt-20 text-center'
        >
          <Card className='glass-plasma border-plasma-400/30 max-w-4xl mx-auto'>
            <CardHeader>
              <CardTitle className='text-2xl gradient-text'>
                Enterprise Features
              </CardTitle>
              <CardDescription>
                All plans include these powerful features to help you succeed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
                <div className='space-y-2'>
                  <div className='p-2 rounded-full bg-gradient-to-br from-neon-400/20 to-neon-600/10 mx-auto w-fit'>
                    <Zap className='h-5 w-5 text-neon-400' />
                  </div>
                  <p className='font-medium'>99.9% Uptime</p>
                </div>
                <div className='space-y-2'>
                  <div className='p-2 rounded-full bg-gradient-to-br from-electric-400/20 to-electric-600/10 mx-auto w-fit'>
                    <Star className='h-5 w-5 text-electric-400' />
                  </div>
                  <p className='font-medium'>24/7 Support</p>
                </div>
                <div className='space-y-2'>
                  <div className='p-2 rounded-full bg-gradient-to-br from-cyber-400/20 to-cyber-600/10 mx-auto w-fit'>
                    <Crown className='h-5 w-5 text-cyber-400' />
                  </div>
                  <p className='font-medium'>Premium Security</p>
                </div>
                <div className='space-y-2'>
                  <div className='p-2 rounded-full bg-gradient-to-br from-aurora-400/20 to-aurora-600/10 mx-auto w-fit'>
                    <Sparkles className='h-5 w-5 text-aurora-400' />
                  </div>
                  <p className='font-medium'>Advanced Analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
