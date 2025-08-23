import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import bcrypt from 'bcryptjs'

// Team invitation status
enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

// Enhanced team roles with granular permissions
const ROLE_PERMISSIONS = {
  OWNER: {
    name: 'Owner',
    level: 100,
    permissions: [
      'manage.organization',
      'manage.billing',
      'manage.members',
      'manage.roles',
      'manage.settings',
      'manage.integrations',
      'view.analytics',
      'manage.projects',
      'delete.organization',
    ],
    description: 'Full access to all organization features',
  },
  ADMIN: {
    name: 'Admin',
    level: 80,
    permissions: [
      'manage.members',
      'manage.settings',
      'manage.integrations',
      'view.analytics',
      'manage.projects',
    ],
    description: 'Can manage team members, settings, and projects',
  },
  MANAGER: {
    name: 'Manager',
    level: 60,
    permissions: ['view.analytics', 'manage.projects', 'invite.members'],
    description: 'Can manage projects and invite team members',
  },
  MEMBER: {
    name: 'Member',
    level: 40,
    permissions: ['view.projects', 'edit.projects'],
    description: 'Can view and edit assigned projects',
  },
  GUEST: {
    name: 'Guest',
    level: 20,
    permissions: ['view.projects'],
    description: 'Read-only access to assigned projects',
  },
} as const

export const teamRouter = createTRPCRouter({
  /**
   * Get team members with enhanced details
   */
  getTeamMembers: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        includeInvitations: z.boolean().default(false),
        search: z.string().optional(),
        role: z
          .enum(['OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'GUEST'])
          .optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user has permission to view team members
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied to this organization',
        })
      }

      // Build where clause for search and filtering
      const whereClause: any = {
        organizationId: input.organizationId,
      }

      if (input.role) {
        whereClause.role = input.role
      }

      if (input.search) {
        whereClause.user = {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' } },
            { email: { contains: input.search, mode: 'insensitive' } },
          ],
        }
      }

      // Get team members
      const members = await ctx.db.membership.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            },
          },
        },
        orderBy: [
          { role: 'asc' }, // Owner first, then Admin, etc.
          { createdAt: 'asc' },
        ],
        skip: input.offset,
        take: input.limit,
      })

      // Get total count for pagination
      const totalCount = await ctx.db.membership.count({
        where: whereClause,
      })

      // Get pending invitations if requested
      let invitations: any[] = []
      if (input.includeInvitations) {
        invitations = await ctx.db.teamInvitation.findMany({
          where: {
            organizationId: input.organizationId,
            status: 'PENDING',
          },
          include: {
            invitedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      }

      return {
        members: members.map((member: any) => ({
          id: member.id,
          role: member.role,
          joinedAt: member.createdAt,
          user: member.user,
          permissions:
            ROLE_PERMISSIONS[member.role as keyof typeof ROLE_PERMISSIONS]
              ?.permissions || [],
          roleInfo:
            ROLE_PERMISSIONS[member.role as keyof typeof ROLE_PERMISSIONS],
        })),
        invitations: invitations.map((invitation: any) => ({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          invitedAt: invitation.createdAt,
          invitedBy: invitation.invitedBy,
          expiresAt: invitation.expiresAt,
        })),
        pagination: {
          total: totalCount,
          offset: input.offset,
          limit: input.limit,
          hasMore: input.offset + input.limit < totalCount,
        },
      }
    }),

  /**
   * Invite team member with enhanced options
   */
  inviteTeamMember: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        email: z.string().email(),
        role: z.enum(['ADMIN', 'MANAGER', 'MEMBER', 'GUEST']),
        message: z.string().optional(),
        permissions: z.array(z.string()).optional(),
        expiresIn: z.number().min(1).max(168).default(168), // hours, default 7 days
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission to invite members
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
          role: { in: ['OWNER', 'ADMIN', 'MANAGER'] },
        },
        include: {
          organization: true,
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient permissions to invite team members',
        })
      }

      // Check if user is already a member
      const existingMember = await ctx.db.membership.findFirst({
        where: {
          organizationId: input.organizationId,
          user: { email: input.email },
        },
      })

      if (existingMember) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User is already a member of this organization',
        })
      }

      // Check if there's already a pending invitation
      const existingInvitation = await ctx.db.teamInvitation.findFirst({
        where: {
          organizationId: input.organizationId,
          email: input.email,
          status: 'PENDING',
        },
      })

      if (existingInvitation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'An invitation is already pending for this email address',
        })
      }

      // Generate invitation token
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + input.expiresIn * 60 * 60 * 1000)

      // Create invitation
      const invitation = await ctx.db.teamInvitation.create({
        data: {
          organizationId: input.organizationId,
          email: input.email,
          role: input.role,
          token,
          message: input.message,
          permissions: input.permissions
            ? JSON.stringify(input.permissions)
            : null,
          invitedById: ctx.session.user.id,
          status: 'PENDING',
          expiresAt,
        },
        include: {
          organization: true,
          invitedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })

      // TODO: Send invitation email
      console.log(
        `Invitation sent to ${input.email} for ${invitation.organization.name}`
      )

      return {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
        message: 'Invitation sent successfully',
      }
    }),

  /**
   * Update team member role and permissions
   */
  updateTeamMember: protectedProcedure
    .input(
      z.object({
        membershipId: z.string(),
        role: z.enum(['ADMIN', 'MANAGER', 'MEMBER', 'GUEST']).optional(),
        permissions: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the membership to update
      const membership = await ctx.db.membership.findUnique({
        where: { id: input.membershipId },
        include: {
          organization: true,
          user: true,
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team member not found',
        })
      }

      // Check if current user has permission to update this member
      const currentUserMembership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: membership.organizationId,
          role: { in: ['OWNER', 'ADMIN'] },
        },
      })

      if (!currentUserMembership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient permissions to update team member',
        })
      }

      // Prevent demoting the only owner
      if (
        membership.role === 'OWNER' &&
        currentUserMembership.role !== 'OWNER'
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot change the owner role',
        })
      }

      // Update membership
      const updateData: any = {
        updatedAt: new Date(),
      }

      if (input.role) {
        updateData.role = input.role
      }

      if (input.permissions) {
        updateData.permissions = JSON.stringify(input.permissions)
      }

      const updatedMembership = await ctx.db.membership.update({
        where: { id: input.membershipId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })

      // Log the action
      await ctx.db.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          organizationId: membership.organizationId,
          action: 'MEMBER_ROLE_UPDATED',
          resource: 'MEMBERSHIP',
          resourceId: input.membershipId,
          metadata: {
            targetUserId: membership.user.id,
            targetUserEmail: membership.user.email,
            oldRole: membership.role,
            newRole: input.role || membership.role,
            permissions: input.permissions,
          },
        },
      })

      return {
        id: updatedMembership.id,
        role: updatedMembership.role,
        user: updatedMembership.user,
        permissions: input.permissions || [],
        message: 'Team member updated successfully',
      }
    }),

  /**
   * Remove team member
   */
  removeTeamMember: protectedProcedure
    .input(
      z.object({
        membershipId: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the membership to remove
      const membership = await ctx.db.membership.findUnique({
        where: { id: input.membershipId },
        include: {
          organization: true,
          user: true,
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team member not found',
        })
      }

      // Check if current user has permission to remove this member
      const currentUserMembership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: membership.organizationId,
        },
      })

      if (!currentUserMembership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied to this organization',
        })
      }

      // Check permissions
      const canRemove =
        currentUserMembership.role === 'OWNER' ||
        (currentUserMembership.role === 'ADMIN' &&
          membership.role !== 'OWNER') ||
        membership.userId === ctx.session.user.id // Users can remove themselves

      if (!canRemove) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient permissions to remove this team member',
        })
      }

      // Prevent removing the only owner
      if (membership.role === 'OWNER') {
        const ownerCount = await ctx.db.membership.count({
          where: {
            organizationId: membership.organizationId,
            role: 'OWNER',
          },
        })

        if (ownerCount <= 1) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot remove the only owner of the organization',
          })
        }
      }

      // Remove the membership
      await ctx.db.membership.delete({
        where: { id: input.membershipId },
      })

      // Log the action
      await ctx.db.auditLog.create({
        data: {
          userId: ctx.session.user.id,
          organizationId: membership.organizationId,
          action:
            membership.userId === ctx.session.user.id
              ? 'MEMBER_LEFT'
              : 'MEMBER_REMOVED',
          resource: 'MEMBERSHIP',
          resourceId: input.membershipId,
          metadata: {
            targetUserId: membership.user.id,
            targetUserEmail: membership.user.email,
            targetUserRole: membership.role,
            reason: input.reason,
          },
        },
      })

      return {
        message: 'Team member removed successfully',
      }
    }),

  /**
   * Get team activity feed
   */
  getTeamActivity: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        actionFilter: z.array(z.string()).optional(),
        userFilter: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check access
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied to this organization',
        })
      }

      // Build where clause
      const whereClause: any = {
        organizationId: input.organizationId,
      }

      if (input.actionFilter && input.actionFilter.length > 0) {
        whereClause.action = { in: input.actionFilter }
      }

      if (input.userFilter) {
        whereClause.userId = input.userFilter
      }

      // Get activity logs
      const activities = await ctx.db.auditLog.findMany({
        where: whereClause,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        skip: input.offset,
        take: input.limit,
      })

      // Get user details for activities
      const userIds = activities
        .map((a: any) => a.userId)
        .filter(Boolean) as string[]
      const users = await ctx.db.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })

      const userMap = new Map(users.map((u: any) => [u.id, u]))

      return activities.map((activity: any) => ({
        id: activity.id,
        action: activity.action,
        resource: activity.resource,
        resourceId: activity.resourceId,
        timestamp: activity.timestamp,
        user: activity.userId ? userMap.get(activity.userId) || null : null,
        metadata: activity.metadata,
        description: generateActivityDescription(activity),
      }))
    }),

  /**
   * Get role permissions and details
   */
  getRoleDetails: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check access
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.organizationId,
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied to this organization',
        })
      }

      return {
        roles: Object.entries(ROLE_PERMISSIONS).map(([key, role]) => ({
          id: key,
          ...role,
        })),
        currentUserRole: membership.role,
        currentUserPermissions:
          ROLE_PERMISSIONS[membership.role as keyof typeof ROLE_PERMISSIONS]
            ?.permissions || [],
      }
    }),
})

/**
 * Generate human-readable activity descriptions
 */
function generateActivityDescription(activity: any): string {
  const metadata = activity.metadata || {}

  switch (activity.action) {
    case 'MEMBER_INVITED':
      return `invited ${metadata.email} as ${metadata.role}`
    case 'MEMBER_JOINED':
      return `joined the organization`
    case 'MEMBER_ROLE_UPDATED':
      return `changed ${metadata.targetUserEmail}'s role from ${metadata.oldRole} to ${metadata.newRole}`
    case 'MEMBER_REMOVED':
      return `removed ${metadata.targetUserEmail} from the organization`
    case 'MEMBER_LEFT':
      return `left the organization`
    case 'ORGANIZATION_UPDATED':
      return `updated organization settings`
    case 'BILLING_UPDATED':
      return `updated billing information`
    default:
      return `performed ${activity.action.toLowerCase().replace('_', ' ')}`
  }
}
