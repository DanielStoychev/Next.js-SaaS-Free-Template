import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { db } from '@/lib/db'

// Environment variables - replace with your actual Stripe keys
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const STRIPE_STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID || ''
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || ''
const STRIPE_ENTERPRISE_PRICE_ID = process.env.STRIPE_ENTERPRISE_PRICE_ID || ''

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

const webhookSecret = STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new Response('No signature provided', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('Webhook handled successfully', { status: 200 })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response('Webhook handling failed', { status: 500 })
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { organizationId, planId } = session.metadata || {}

  if (!organizationId || !planId) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  try {
    // Update organization with new plan
    await db.organization.update({
      where: { id: organizationId },
      data: {
        plan: planId as 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE',
        stripeCustomerId: session.customer as string,
        updatedAt: new Date(),
      },
    })

    console.log(`Organization ${organizationId} upgraded to ${planId}`)
  } catch (error) {
    console.error('Error updating organization after checkout:', error)
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    
    // Find organization by Stripe customer ID
    const organization = await db.organization.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (!organization) {
      console.error('Organization not found for customer:', customerId)
      return
    }

    // Determine plan based on subscription price
    let planId = 'FREE'
    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0]?.price.id
      
      if (priceId === STRIPE_STARTER_PRICE_ID) {
        planId = 'STARTER'
      } else if (priceId === STRIPE_PRO_PRICE_ID) {
        planId = 'PRO'
      } else if (priceId === STRIPE_ENTERPRISE_PRICE_ID) {
        planId = 'ENTERPRISE'
      }
    }

    // Update organization plan based on subscription status
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (subscription.status === 'active') {
      updateData.plan = planId
    } else if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
      // Downgrade to free plan if subscription is not active
      updateData.plan = 'FREE'
    }

    await db.organization.update({
      where: { id: organization.id },
      data: updateData,
    })

    console.log(`Organization ${organization.id} plan updated to ${updateData.plan || planId}`)
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    
    const organization = await db.organization.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (!organization) {
      console.error('Organization not found for customer:', customerId)
      return
    }

    // Downgrade to free plan
    await db.organization.update({
      where: { id: organization.id },
      data: {
        plan: 'FREE',
        updatedAt: new Date(),
      },
    })

    console.log(`Organization ${organization.id} downgraded to FREE plan`)
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string
    
    const organization = await db.organization.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (!organization) {
      console.error('Organization not found for customer:', customerId)
      return
    }

    // You could add logic here to:
    // - Send payment confirmation emails
    // - Update usage limits
    // - Log payment events
    // - Trigger other business logic

    console.log(`Payment succeeded for organization ${organization.id}`)
  } catch (error) {
    console.error('Error handling invoice payment success:', error)
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string
    
    const organization = await db.organization.findFirst({
      where: { stripeCustomerId: customerId },
    })

    if (!organization) {
      console.error('Organization not found for customer:', customerId)
      return
    }

    // You could add logic here to:
    // - Send payment failure notifications
    // - Temporarily suspend features
    // - Retry payment collection
    // - Update account status

    console.log(`Payment failed for organization ${organization.id}`)
  } catch (error) {
    console.error('Error handling invoice payment failure:', error)
  }
}
