import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TeamManagement from '@/components/dashboard/team-management-v2'

export default async function TeamPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // For now, we'll use the user's ID as the organization ID
  // In a real app, you'd have proper organization management
  const organizationId = session.user.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <TeamManagement organizationId={organizationId} />
      </div>
    </div>
  )
}
