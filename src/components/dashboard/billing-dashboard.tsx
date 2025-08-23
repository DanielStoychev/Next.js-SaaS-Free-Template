'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, Download, ExternalLink, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { api } from '@/trpc/react'

const PLAN_FEATURES = {
  FREE: {
    name: 'Free',
    color: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    features: ['Up to 3 projects', 'Basic analytics', 'Community support', '1 team member'],
  },
  STARTER: {
    name: 'Starter',
    color: 'bg-electric-purple/20 text-electric-purple border-electric-purple/30',
    features: ['Up to 10 projects', 'Advanced analytics', 'Email support', '5 team members'],
  },
  PRO: {
    name: 'Pro',
    color: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
    features: ['Unlimited projects', 'Premium analytics', 'Priority support', 'Unlimited team members'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    color: 'bg-aurora-purple/20 text-aurora-purple border-aurora-purple/30',
    features: ['Everything in Pro', 'Dedicated support', 'Custom features', 'SLA guarantee'],
  },
}

const STATUS_COLORS = {
  active: 'bg-cyber-green/20 text-cyber-green',
  past_due: 'bg-amber-500/20 text-amber-500',
  canceled: 'bg-red-500/20 text-red-500',
  incomplete: 'bg-blue-500/20 text-blue-500',
  trialing: 'bg-electric-purple/20 text-electric-purple',
  unpaid: 'bg-red-500/20 text-red-500',
  paused: 'bg-gray-500/20 text-gray-500',
}

const STATUS_ICONS = {
  active: CheckCircle,
  past_due: AlertCircle,
  canceled: XCircle,
  incomplete: Clock,
  trialing: Clock,
  unpaid: AlertCircle,
  paused: Clock,
}

export default function BillingDashboard() {
  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: subscription, isLoading: subscriptionLoading } = api.subscription.getSubscription.useQuery(
    undefined,
    { enabled: !!session }
  )

  const { data: billingHistory, isLoading: billingLoading } = api.subscription.getBillingHistory.useQuery(
    { limit: 10 },
    { enabled: !!session }
  )

  const createBillingPortalSession = api.subscription.createBillingPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.location.href = data.portalUrl
      }
    },
    onError: (error) => {
      console.error('Error creating billing portal session:', error)
    },
  })

  const cancelSubscription = api.subscription.cancelSubscription.useMutation({
    onSuccess: () => {
      // Refetch subscription data
      window.location.reload()
    },
    onError: (error) => {
      console.error('Error canceling subscription:', error)
    },
  })

  const handleManageBilling = async () => {
    setIsProcessing(true)
    try {
      await createBillingPortalSession.mutateAsync({})
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      try {
        await cancelSubscription.mutateAsync({})
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view your billing information</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const planInfo = subscription ? PLAN_FEATURES[subscription.plan as keyof typeof PLAN_FEATURES] : PLAN_FEATURES.FREE
  const StatusIcon = subscription?.status ? STATUS_ICONS[subscription.status as keyof typeof STATUS_ICONS] : CheckCircle

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Current Plan</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </div>
              <Badge className={planInfo.color}>
                {planInfo.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscription && subscription.plan !== 'FREE' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Subscription Status</h4>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${STATUS_COLORS[subscription.status as keyof typeof STATUS_COLORS] || 'bg-gray-500/20 text-gray-500'}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">
                        {subscription.status?.replace('_', ' ') || 'Active'}
                      </p>
                      {subscription.currentPeriodEnd && (
                        <p className="text-sm text-gray-400">
                          {subscription.cancelAtPeriodEnd ? 'Cancels on' : 'Renews on'} {formatDate(subscription.currentPeriodEnd)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Organization</h4>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-electric-purple/20">
                      <CreditCard className="w-4 h-4 text-electric-purple" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {subscription.organization?.name || 'Personal'}
                      </p>
                      <p className="text-sm text-gray-400">Organization billing</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-white mb-3">Plan Features</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {planInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-cyber-green flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex flex-col sm:flex-row gap-4">
              {subscription?.plan !== 'FREE' ? (
                <>
                  <Button
                    onClick={handleManageBilling}
                    disabled={isProcessing || createBillingPortalSession.isPending}
                    className="bg-electric-purple hover:bg-electric-purple/80 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Opening...' : 'Manage Billing'}
                  </Button>
                  
                  {!subscription?.cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      disabled={cancelSubscription.isPending}
                      className="border-red-500/30 text-red-500 hover:bg-red-500/20"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => window.location.href = '/pricing'}
                  className="bg-cyber-green hover:bg-cyber-green/80 text-gray-900"
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing History */}
      {billingHistory && billingHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Billing History</CardTitle>
              <CardDescription>Your recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-electric-purple/20">
                        <Calendar className="w-4 h-4 text-electric-purple" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Invoice #{invoice.number || invoice.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatDate(invoice.date)} • {formatCurrency(invoice.amount, invoice.currency)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          invoice.status === 'paid'
                            ? 'bg-cyber-green/20 text-cyber-green'
                            : invoice.status === 'open'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-red-500/20 text-red-500'
                        }
                      >
                        {invoice.status}
                      </Badge>
                      
                      {invoice.downloadUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(invoice.downloadUrl!, '_blank')}
                          className="text-gray-400 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Subscription Management Notice */}
      {subscription?.cancelAtPeriodEnd && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white mb-1">Subscription Canceled</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You'll lose access to premium features after this date.
                  </p>
                  <Button
                    onClick={handleManageBilling}
                    disabled={isProcessing}
                    size="sm"
                    className="bg-cyber-green hover:bg-cyber-green/80 text-gray-900"
                  >
                    Reactivate Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
