'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserPlus,
  Mail,
  Send,
  X,
  Shield,
  Users,
  Crown,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/trpc/react'

const ROLE_ICONS = {
  OWNER: Crown,
  ADMIN: Shield,
  MANAGER: Users,
  MEMBER: Eye,
  GUEST: Eye,
}

const ROLE_COLORS = {
  OWNER: 'bg-aurora-purple/20 text-aurora-purple',
  ADMIN: 'bg-electric-purple/20 text-electric-purple',
  MANAGER: 'bg-cyber-green/20 text-cyber-green',
  MEMBER: 'bg-neon-cyan/20 text-neon-cyan',
  GUEST: 'bg-gray-500/20 text-gray-400',
}

const ROLE_DESCRIPTIONS = {
  ADMIN: 'Can manage team members and organization settings',
  MANAGER: 'Can manage projects and team workflows',
  MEMBER: 'Can access and collaborate on projects',
  GUEST: 'Limited access for external collaborators',
}

interface InviteMemberDialogProps {
  organizationId: string
  onSuccess?: () => void
}

export function InviteMemberDialog({
  organizationId,
  onSuccess,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>('MEMBER')
  const [customPermissions, setCustomPermissions] = useState<string[]>([])

  // Get role details
  const { data: roleDetails } = api.team.getRoleDetails.useQuery({
    organizationId,
  })

  // Invite mutation
  const inviteMember = api.team.inviteTeamMember.useMutation({
    onSuccess: () => {
      setOpen(false)
      setEmail('')
      setRole('MEMBER')
      setCustomPermissions([])
      onSuccess?.()
    },
    onError: error => {
      console.error('Failed to invite member:', error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    try {
      await inviteMember.mutateAsync({
        organizationId,
        email: email.trim(),
        role: role as any,
        permissions:
          customPermissions.length > 0 ? customPermissions : undefined,
      })
    } catch (error) {
      // Error handled in mutation
    }
  }

  const availableRoles =
    roleDetails?.roles.filter(role => role.id !== 'OWNER') || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-electric-purple hover:bg-electric-purple/80 text-white'>
          <UserPlus className='w-4 h-4 mr-2' />
          Invite Member
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-xl text-white flex items-center gap-2'>
            <div className='p-2 rounded-lg bg-electric-purple/20'>
              <UserPlus className='w-5 h-5 text-electric-purple' />
            </div>
            Invite Team Member
          </DialogTitle>
          <DialogDescription className='text-gray-400'>
            Send an invitation to join your team with the specified role and
            permissions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Email Input */}
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-white'>
              Email Address
            </Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='colleague@company.com'
                className='pl-10 bg-gray-900/50 border-gray-700 text-white'
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className='space-y-2'>
            <Label className='text-white'>Role</Label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className='w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white'
            >
              {availableRoles.map(roleOption => (
                <option key={roleOption.id} value={roleOption.id}>
                  {roleOption.name}
                </option>
              ))}
            </select>

            {/* Role Description */}
            {ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS] && (
              <p className='text-sm text-gray-400'>
                {ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}
              </p>
            )}
          </div>

          {/* Role Preview */}
          {availableRoles.find(r => r.id === role) && (
            <Card className='bg-gray-900/30 border-gray-800'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-lg ${ROLE_COLORS[role as keyof typeof ROLE_COLORS]}`}
                  >
                    {React.createElement(
                      ROLE_ICONS[role as keyof typeof ROLE_ICONS],
                      {
                        className: 'w-5 h-5',
                      }
                    )}
                  </div>
                  <div>
                    <CardTitle className='text-sm text-white'>
                      {availableRoles.find(r => r.id === role)?.name}{' '}
                      Permissions
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      This role includes the following permissions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pt-0'>
                <div className='flex flex-wrap gap-1'>
                  {availableRoles
                    .find(r => r.id === role)
                    ?.permissions.slice(0, 6)
                    .map((permission: string) => (
                      <Badge
                        key={permission}
                        variant='outline'
                        className='text-xs border-gray-600 text-gray-400'
                      >
                        {permission
                          .split('.')
                          .pop()
                          ?.replace(/([A-Z])/g, ' $1')
                          .trim()}
                      </Badge>
                    ))}
                  {(availableRoles.find(r => r.id === role)?.permissions
                    .length || 0) > 6 && (
                    <Badge
                      variant='outline'
                      className='text-xs border-gray-600 text-gray-400'
                    >
                      +
                      {(availableRoles.find(r => r.id === role)?.permissions
                        .length || 0) - 6}{' '}
                      more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              className='border-gray-700 text-gray-300 hover:bg-gray-800'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!email.trim() || inviteMember.isPending}
              className='bg-electric-purple hover:bg-electric-purple/80 text-white'
            >
              {inviteMember.isPending ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin' />
                  Sending...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Send className='w-4 h-4' />
                  Send Invitation
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
