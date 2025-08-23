import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

// Environment variables - replace with your actual Stripe keys
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const STRIPE_STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID || ''
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || ''
const STRIPE_ENTERPRISE_PRICE_ID = process.env.STRIPE_ENTERPRISE_PRICE_ID || ''

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

// Pricing plans configuration
const PRICING_PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    interval: 'month' as const,
    features: [
      'Up to 3 projects',
      'Basic analytics',
      'Community support',
      '1 team member',
    ],
    stripePriceId: null,
  },
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 9,
    interval: 'month' as const,
    features: [
      'Up to 10 projects',
      'Advanced analytics',
      'Email support',
      '5 team members',
      'Custom integrations',
    ],
    stripePriceId: STRIPE_STARTER_PRICE_ID,
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 29,
    interval: 'month' as const,
    features: [
      'Unlimited projects',
      'Premium analytics',
      'Priority support',
      'Unlimited team members',
      'Advanced integrations',
      'Custom branding',
    ],
    stripePriceId: STRIPE_PRO_PRICE_ID,
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 99,
    interval: 'month' as const,
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom features',
      'SLA guarantee',
      'On-premise deployment',
      'Advanced security',
    ],
    stripePriceId: STRIPE_ENTERPRISE_PRICE_ID,
  },
} as const

export const subscriptionRouter = createTRPCRouter({
  /**
   * Get all available pricing plans
   */
  getPlans: protectedProcedure.query(async () => {
    return Object.values(PRICING_PLANS)
  }),

  /**
   * Get current user's subscription status
   */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          memberships: {
            include: {
              organization: true,
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Get the user's primary organization (first one they belong to)
      const primaryMembership = user.memberships[0]
      
      if (!primaryMembership) {
        return {
          plan: 'FREE',
          status: 'active',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          organization: null,
        }
      }

      const organization = primaryMembership.organization
      
      // If organization has a Stripe customer ID, get subscription from Stripe
      if (organization.stripeCustomerId) {
        try {
          const subscriptions = await stripe.subscriptions.list({
            customer: organization.stripeCustomerId,
            status: 'all',
            limit: 1,
          })

          const subscription = subscriptions.data[0]
          
          if (subscription) {
            return {
              plan: organization.plan,
              status: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              organization: {
                id: organization.id,
                name: organization.name,
              },
              stripeSubscriptionId: subscription.id,
            }
          }
        } catch (error) {
          console.error('Error fetching Stripe subscription:', error)
        }
      }

      return {
        plan: organization.plan,
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        organization: {
          id: organization.id,
          name: organization.name,
        },
      }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch subscription',
      })
    }
  }),

  /**
   * Create Stripe checkout session for subscription
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planId: z.enum(['STARTER', 'PRO', 'ENTERPRISE']),
        organizationId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const plan = PRICING_PLANS[input.planId]
        
        if (!plan.stripePriceId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid plan selected',
          })
        }

        // Get or create organization
        let organization
        if (input.organizationId) {
          // Check if user has access to this organization
          const membership = await ctx.db.membership.findFirst({
            where: {
              userId: ctx.session.user.id,
              organizationId: input.organizationId,
              role: { in: ['OWNER', 'ADMIN'] },
            },
            include: {
              organization: true,
            },
          })

          if (!membership) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Insufficient permissions for this organization',
            })
          }

          organization = membership.organization
        } else {
          // Get user's primary organization or create one
          const user = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
              memberships: {
                include: {
                  organization: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
          })

          if (!user) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found',
            })
          }

          organization = user.memberships[0]?.organization

          if (!organization) {
            // Create a new organization for the user
            organization = await ctx.db.organization.create({
              data: {
                name: `${user.name || 'My'} Organization`,
                slug: `${user.id}-org`,
                plan: 'FREE',
                memberships: {
                  create: {
                    userId: user.id,
                    role: 'OWNER',
                  },
                },
              },
            })
          }
        }

        // Create or get Stripe customer
        let customerId = organization.stripeCustomerId

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: ctx.session.user.email!,
            name: ctx.session.user.name || undefined,
            metadata: {
              organizationId: organization.id,
              userId: ctx.session.user.id,
            },
          })

          customerId = customer.id

          // Update organization with Stripe customer ID
          await ctx.db.organization.update({
            where: { id: organization.id },
            data: { stripeCustomerId: customerId },
          })
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          billing_address_collection: 'required',
          line_items: [
            {
              price: plan.stripePriceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${NEXTAUTH_URL}/dashboard/billing?success=true`,
          cancel_url: `${NEXTAUTH_URL}/pricing?canceled=true`,
          metadata: {
            organizationId: organization.id,
            userId: ctx.session.user.id,
            planId: input.planId,
          },
        })

        return {
          checkoutUrl: session.url,
          sessionId: session.id,
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session',
        })
      }
    }),

  /**
   * Create billing portal session for subscription management
   */
  createBillingPortalSession: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get organization
        let organization
        if (input.organizationId) {
          const membership = await ctx.db.membership.findFirst({
            where: {
              userId: ctx.session.user.id,
              organizationId: input.organizationId,
              role: { in: ['OWNER', 'ADMIN'] },
            },
            include: {
              organization: true,
            },
          })

          if (!membership) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Insufficient permissions for this organization',
            })
          }

          organization = membership.organization
        } else {
          const user = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
              memberships: {
                include: {
                  organization: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
          })

          if (!user?.memberships[0]) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'No organization found',
            })
          }

          organization = user.memberships[0].organization
        }

        if (!organization.stripeCustomerId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No billing information found',
          })
        }

        const session = await stripe.billingPortal.sessions.create({
          customer: organization.stripeCustomerId,
          return_url: `${NEXTAUTH_URL}/dashboard/billing`,
        })

        return {
          portalUrl: session.url,
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create billing portal session',
        })
      }
    }),

  /**
   * Cancel subscription at period end
   */
  cancelSubscription: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get organization and check permissions
        let organization
        if (input.organizationId) {
          const membership = await ctx.db.membership.findFirst({
            where: {
              userId: ctx.session.user.id,
              organizationId: input.organizationId,
              role: { in: ['OWNER', 'ADMIN'] },
            },
            include: {
              organization: true,
            },
          })

          if (!membership) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Insufficient permissions for this organization',
            })
          }

          organization = membership.organization
        } else {
          const user = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
              memberships: {
                include: {
                  organization: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
          })

          if (!user?.memberships[0]) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'No organization found',
            })
          }

          organization = user.memberships[0].organization
        }

        if (!organization.stripeCustomerId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No active subscription found',
          })
        }

        // Get the active subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: organization.stripeCustomerId,
          status: 'active',
          limit: 1,
        })

        const subscription = subscriptions.data[0]
        
        if (!subscription) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No active subscription found',
          })
        }

        // Cancel subscription at period end
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        })

        return {
          success: true,
          message: 'Subscription will be canceled at the end of the billing period',
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to cancel subscription',
        })
      }
    }),

  /**
   * Get billing history / invoices
   */
  getBillingHistory: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get organization
        let organization
        if (input.organizationId) {
          const membership = await ctx.db.membership.findFirst({
            where: {
              userId: ctx.session.user.id,
              organizationId: input.organizationId,
            },
            include: {
              organization: true,
            },
          })

          if (!membership) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Access denied to this organization',
            })
          }

          organization = membership.organization
        } else {
          const user = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
              memberships: {
                include: {
                  organization: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
          })

          if (!user?.memberships[0]) {
            return []
          }

          organization = user.memberships[0].organization
        }

        if (!organization.stripeCustomerId) {
          return []
        }

        const invoices = await stripe.invoices.list({
          customer: organization.stripeCustomerId,
          limit: input.limit,
        })

        return invoices.data.map((invoice) => ({
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          amount: invoice.total,
          currency: invoice.currency,
          date: new Date(invoice.created * 1000),
          dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
          paidDate: invoice.status_transitions.paid_at 
            ? new Date(invoice.status_transitions.paid_at * 1000) 
            : null,
          downloadUrl: invoice.hosted_invoice_url,
          description: invoice.description,
        }))
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch billing history',
        })
      }
    }),
})
