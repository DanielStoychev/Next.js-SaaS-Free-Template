import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import BillingDashboard from '@/components/dashboard/billing-dashboard'

export default async function BillingPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>
          Billing & Subscription
        </h1>
        <p className='text-gray-400'>
          Manage your subscription, billing, and payment methods
        </p>
      </div>

      <BillingDashboard />
    </div>
  )
}
