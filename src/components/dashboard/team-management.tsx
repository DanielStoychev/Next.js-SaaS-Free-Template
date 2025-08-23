'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, UserPlus, Crown, Shield, Eye, Search, Clock,
  MoreVertical, Trash2, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/trpc/react'

const ROLE_ICONS = {
  OWNER: Crown,
  ADMIN: Shield,
  MANAGER: Users,
  MEMBER: Eye,
  GUEST: UserMinus,
}

const ROLE_COLORS = {
  OWNER: 'bg-aurora-purple/20 text-aurora-purple border-aurora-purple/30',
  ADMIN: 'bg-electric-purple/20 text-electric-purple border-electric-purple/30',
  MANAGER: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
  MEMBER: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  GUEST: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const INVITATION_STATUS_COLORS = {
  PENDING: 'bg-amber-500/20 text-amber-500',
  ACCEPTED: 'bg-cyber-green/20 text-cyber-green',
  DECLINED: 'bg-red-500/20 text-red-500',
  EXPIRED: 'bg-gray-500/20 text-gray-400',
  REVOKED: 'bg-red-500/20 text-red-500',
}

interface TeamManagementProps {
  organizationId: string
}

export default function TeamManagement({ organizationId }: TeamManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('members')

  // Get team data
  const { 
    data: teamData, 
    isLoading, 
    refetch: refetchTeam 
  } = api.team.getTeamMembers.useQuery({
    organizationId,
    includeInvitations: true,
    search: searchQuery || undefined,
    role: roleFilter as any || undefined,
  })

  // Get role details
  const { data: roleDetails } = api.team.getRoleDetails.useQuery({
    organizationId,
  })

  // Get team activity
  const { data: activities } = api.team.getTeamActivity.useQuery({
    organizationId,
    limit: 20,
  })

  // Mutations
  const updateMember = api.team.updateTeamMember.useMutation({
    onSuccess: () => {
      refetchTeam()
      setSelectedMember(null)
    },
    onError: (error) => {
      console.error('Error updating member:', error)
    },
  })

  const removeMember = api.team.removeTeamMember.useMutation({
    onSuccess: () => {
      refetchTeam()
      setSelectedMember(null)
    },
    onError: (error) => {
      console.error('Error removing member:', error)
    },
  })

  const handleRoleChange = (membershipId: string, newRole: string) => {
    updateMember.mutate({
      membershipId,
      role: newRole as any,
    })
  }

  const handleRemoveMember = (membershipId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      removeMember.mutate({ membershipId })
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const canManageMembers = roleDetails?.currentUserRole && ['OWNER', 'ADMIN'].includes(roleDetails.currentUserRole)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
          <p className="text-gray-400">
            Manage your team members, roles, and permissions
          </p>
        </div>
        
        {canManageMembers && (
          <Button
            onClick={() => setInviteDialogOpen(true)}
            className="bg-electric-purple hover:bg-electric-purple/80 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 border-neon-cyan/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-neon-cyan/20">
                <Users className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{teamData?.members.length || 0}</p>
                <p className="text-sm text-gray-400">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-electric-purple/10 to-electric-pink/10 border-electric-purple/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-electric-purple/20">
                <Mail className="w-6 h-6 text-electric-purple" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{teamData?.invitations.length || 0}</p>
                <p className="text-sm text-gray-400">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 border-cyber-green/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-cyber-green/20">
                <Shield className="w-6 h-6 text-cyber-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {teamData?.members.filter(m => ['OWNER', 'ADMIN'].includes(m.role)).length || 0}
                </p>
                <p className="text-sm text-gray-400">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-aurora-purple/10 to-aurora-pink/10 border-aurora-purple/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-aurora-purple/20">
                <Clock className="w-6 h-6 text-aurora-purple" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {activities?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Recent Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white">Team Members</CardTitle>
                  <CardDescription>Manage your team members and their roles</CardDescription>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-gray-900/50 border-gray-700"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-700">
                        <Filter className="w-4 h-4 mr-2" />
                        {roleFilter || 'All Roles'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setRoleFilter('')}>
                        All Roles
                      </DropdownMenuItem>
                      {roleDetails?.roles.map((role) => (
                        <DropdownMenuItem key={role.id} onClick={() => setRoleFilter(role.id)}>
                          {role.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamData?.members.map((member) => {
                  const RoleIcon = ROLE_ICONS[member.role as keyof typeof ROLE_ICONS]
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.user.image || undefined} />
                          <AvatarFallback className="bg-electric-purple/20 text-electric-purple">
                            {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">
                              {member.user.name || 'Unknown User'}
                            </h4>
                            <Badge className={ROLE_COLORS[member.role as keyof typeof ROLE_COLORS]}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{member.user.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined {formatDate(member.joinedAt)}
                          </p>
                        </div>
                      </div>
                      
                      {canManageMembers && member.role !== 'OWNER' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Manage Member</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => setSelectedMember(member)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Pending Invitations</CardTitle>
              <CardDescription>Track and manage team invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamData?.invitations.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No pending invitations</h3>
                    <p className="text-gray-400">All team invitations have been processed</p>
                  </div>
                ) : (
                  teamData?.invitations.map((invitation) => (
                    <motion.div
                      key={invitation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-amber-500/20">
                          <Mail className="w-6 h-6 text-amber-500" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">{invitation.email}</h4>
                            <Badge className={ROLE_COLORS[invitation.role as keyof typeof ROLE_COLORS]}>
                              {invitation.role}
                            </Badge>
                            <Badge className={INVITATION_STATUS_COLORS[invitation.status as keyof typeof INVITATION_STATUS_COLORS]}>
                              {invitation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            Invited by {invitation.invitedBy.name} on {formatDate(invitation.invitedAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires {formatDateTime(invitation.expiresAt)}
                          </p>
                        </div>
                      </div>
                      
                      {canManageMembers && (
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <XCircle className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Team Activity</CardTitle>
              <CardDescription>Recent team actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities?.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No recent activity</h3>
                    <p className="text-gray-400">Team activity will appear here</p>
                  </div>
                ) : (
                  activities?.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.user?.image || undefined} />
                        <AvatarFallback className="bg-electric-purple/20 text-electric-purple">
                          {activity.user?.name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <p className="text-white">
                          <span className="font-medium">{activity.user?.name || 'Someone'}</span>{' '}
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatDateTime(activity.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="grid gap-6">
            {roleDetails?.roles.map((role) => {
              const RoleIcon = ROLE_ICONS[role.id as keyof typeof ROLE_ICONS]
              
              return (
                <Card 
                  key={role.id} 
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${ROLE_COLORS[role.id as keyof typeof ROLE_COLORS]}`}>
                        <RoleIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {role.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="justify-start border-gray-700 text-gray-300"
                        >
                          <CheckCircle className="w-3 h-3 mr-1 text-cyber-green" />
                          {permission.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
