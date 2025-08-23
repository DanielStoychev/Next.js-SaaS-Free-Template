'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Rocket, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { api } from '@/trpc/react'

const PLANS = [
  {
    id: 'FREE' as const,
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    interval: 'month',
    features: [
      'Up to 3 projects',
      'Basic analytics',
      'Community support',
      '1 team member',
      '5GB storage',
      'Basic integrations',
    ],
    icon: Sparkles,
    colorClasses: {
      gradient: 'from-neon-cyan/20 to-neon-blue/20',
      border: 'border-neon-cyan/30',
      button: 'bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border-neon-cyan/30',
      accent: 'text-neon-cyan',
    },
    popular: false,
  },
  {
    id: 'STARTER' as const,
    name: 'Starter',
    description: 'For growing teams',
    price: 9,
    interval: 'month',
    features: [
      'Up to 10 projects',
      'Advanced analytics',
      'Email support',
      '5 team members',
      '50GB storage',
      'Custom integrations',
      'API access',
      'Priority support',
    ],
    icon: Rocket,
    colorClasses: {
      gradient: 'from-electric-purple/20 to-electric-pink/20',
      border: 'border-electric-purple/30',
      button: 'bg-electric-purple hover:bg-electric-purple/80 text-white',
      accent: 'text-electric-purple',
    },
    popular: true,
  },
  {
    id: 'PRO' as const,
    name: 'Pro',
    description: 'For professional teams',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited projects',
      'Premium analytics',
      'Priority support',
      'Unlimited team members',
      '500GB storage',
      'Advanced integrations',
      'Custom branding',
      'Advanced security',
      'Export capabilities',
    ],
    icon: Building2,
    colorClasses: {
      gradient: 'from-cyber-green/20 to-cyber-blue/20',
      border: 'border-cyber-green/30',
      button: 'bg-cyber-green hover:bg-cyber-green/80 text-gray-900',
      accent: 'text-cyber-green',
    },
    popular: false,
  },
  {
    id: 'ENTERPRISE' as const,
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom features',
      'SLA guarantee',
      'Unlimited storage',
      'On-premise deployment',
      'Advanced security',
      'Custom contracts',
      'Training & onboarding',
    ],
    icon: Building2,
    colorClasses: {
      gradient: 'from-aurora-purple/20 to-aurora-pink/20',
      border: 'border-aurora-purple/30',
      button: 'bg-aurora-purple hover:bg-aurora-purple/80 text-white',
      accent: 'text-aurora-purple',
    },
    popular: false,
  },
]

type Plan = typeof PLANS[number]

export default function PricingSection() {
  const { data: session } = useSession()
  const [isAnnual, setIsAnnual] = useState(false)
  
  const { data: currentSubscription } = api.subscription.getSubscription.useQuery(
    undefined,
    { enabled: !!session }
  )

  const createCheckoutSession = api.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    },
    onError: (error) => {
      console.error(error.message || 'Failed to create checkout session')
    },
  })

  const handleUpgrade = async (planId: 'STARTER' | 'PRO' | 'ENTERPRISE') => {
    if (!session) {
      // Redirect to sign up
      window.location.href = '/auth/signup'
      return
    }

    try {
      await createCheckoutSession.mutateAsync({ planId })
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan === planId
  }

  const getButtonText = (plan: typeof PLANS[0]) => {
    if (!session) {
      return plan.id === 'FREE' ? 'Get Started Free' : 'Start Free Trial'
    }
    
    if (isCurrentPlan(plan.id)) {
      return 'Current Plan'
    }
    
    if (plan.id === 'FREE') {
      return 'Downgrade'
    }
    
    return 'Upgrade Now'
  }

  const isButtonDisabled = (plan: Plan) => {
    if (!session) return false
    return isCurrentPlan(plan.id) || createCheckoutSession.isPending
  }

  return (
    <div className="relative py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-electric-purple/5 to-cyber-green/5" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric-purple/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-electric-purple/20 border border-neon-cyan/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">Simple, Transparent Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-neon-cyan via-electric-purple to-cyber-green bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
          >
            Start free and scale as you grow. All plans include our core features with varying limits and support levels.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-4 p-1 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual
                  ? 'bg-electric-purple text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                isAnnual
                  ? 'bg-electric-purple text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <Badge className="absolute -top-2 -right-2 bg-cyber-green text-gray-900 text-xs px-2 py-1">
                Save 20%
              </Badge>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-16">
          {PLANS.map((plan, index) => {
            const Icon = plan.icon
            const monthlyPrice = plan.price
            const annualPrice = Math.floor(monthlyPrice * 12 * 0.8) // 20% discount
            const displayPrice = isAnnual && monthlyPrice > 0 ? annualPrice : monthlyPrice

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-electric-purple/10 to-electric-pink/10 border-electric-purple/50 shadow-2xl'
                    : `bg-gradient-to-br ${plan.colorClasses.gradient} ${plan.colorClasses.border}`
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-electric-purple text-white px-4 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Current Plan Badge */}
                {session && isCurrentPlan(plan.id) && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-cyber-green text-gray-900 px-3 py-1">
                      Current
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.colorClasses.gradient} ${plan.colorClasses.border} border`}>
                    <Icon className={`w-6 h-6 ${plan.colorClasses.accent}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      ${displayPrice}
                    </span>
                    <span className="text-gray-400">
                      /{isAnnual && monthlyPrice > 0 ? 'year' : 'month'}
                    </span>
                  </div>
                  {isAnnual && monthlyPrice > 0 && (
                    <p className="text-sm text-cyber-green mt-1">
                      ${Math.floor(annualPrice / 12)}/month billed annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.colorClasses.accent}`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => {
                    if (plan.id !== 'FREE') {
                      handleUpgrade(plan.id as 'STARTER' | 'PRO' | 'ENTERPRISE')
                    } else if (!session) {
                      window.location.href = '/auth/signup'
                    }
                  }}
                  disabled={isButtonDisabled(plan)}
                  className={`w-full py-6 text-base font-semibold rounded-xl transition-all ${plan.colorClasses.button} ${
                    isButtonDisabled(plan) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {createCheckoutSession.isPending ? 'Processing...' : getButtonText(plan)}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Questions about our pricing?
          </h3>
          <p className="text-gray-400 mb-8">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="outline" className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20">
                Contact Sales
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/20">
                View Documentation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
