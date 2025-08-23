'use client'

import { useState } from 'react'

import { api } from '@/trpc/react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')

  const { data: user, isLoading } = api.user.getCurrentUser.useQuery()
  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false)
      // Invalidate the query to refetch the updated data
      utils.user.getCurrentUser.invalidate()
    },
  })

  const utils = api.useUtils()

  const handleUpdateProfile = async () => {
    if (!name.trim()) return

    await updateProfile.mutateAsync({ name })
  }

  if (isLoading) {
    return <div>Loading user profile...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <label className='text-sm font-medium'>Name</label>
          {isEditing ? (
            <div className='flex gap-2'>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={user.name || 'Enter your name'}
                className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              />
              <Button
                size='sm'
                onClick={handleUpdateProfile}
                disabled={updateProfile.isPending}
              >
                Save
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <p className='text-sm'>{user.name}</p>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setName(user.name || '')
                  setIsEditing(true)
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className='text-sm font-medium'>Email</label>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
        </div>

        <div>
          <label className='text-sm font-medium'>Role</label>
          <p className='text-sm text-muted-foreground'>{user.role}</p>
        </div>

        <div>
          <label className='text-sm font-medium'>Member Since</label>
          <p className='text-sm text-muted-foreground'>
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
