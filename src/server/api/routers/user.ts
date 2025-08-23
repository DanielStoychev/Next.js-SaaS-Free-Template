import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

export const userRouter = createTRPCRouter({
  /**
   * Get current user profile
   */
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
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

    return user
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        email: z.string().email('Invalid email address').optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if email is being changed and is already taken
        if (input.email) {
          const existingUser = await ctx.db.user.findFirst({
            where: {
              email: input.email,
              NOT: { id: ctx.session.user.id },
            },
          })

          if (existingUser) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email address is already taken',
            })
          }
        }

        const updatedUser = await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            name: input.name,
            email: input.email,
            image: input.image,
            emailVerified: input.email ? null : undefined, // Reset email verification if email changed
          },
        })

        return updatedUser
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        })
      }
    }),

  /**
   * Change user password
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
          .string()
          .min(8, 'Password must be at least 8 characters')
          .max(100, 'Password too long'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { id: true, password: true },
        })

        if (!user || !user.password) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found or password not set',
          })
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(
          input.currentPassword,
          user.password
        )

        if (!isValidPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Current password is incorrect',
          })
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(input.newPassword, 12)

        // Update password
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { password: hashedNewPassword },
        })

        return { success: true, message: 'Password updated successfully' }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to change password',
        })
      }
    }),

  /**
   * Get user preferences/settings
   */
  getPreferences: protectedProcedure.query(async () => {
    try {
      // For now, we'll return default preferences since we don't have a preferences table
      // In a real app, you might want to create a UserPreferences model
      return {
        emailNotifications: true,
        marketingEmails: false,
        twoFactorEnabled: false,
        theme: 'neon',
        timezone: 'UTC',
        language: 'en',
      }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch preferences',
      })
    }
  }),

  /**
   * Update user preferences/settings
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        emailNotifications: z.boolean().optional(),
        marketingEmails: z.boolean().optional(),
        theme: z.enum(['neon', 'electric', 'cyber', 'aurora', 'plasma']).optional(),
        timezone: z.string().optional(),
        language: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // For now, we'll just return the input as if it was saved
        // In a real app, you'd save this to a UserPreferences table
        return {
          success: true,
          message: 'Preferences updated successfully',
          preferences: input,
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update preferences',
        })
      }
    }),

  /**
   * Export user data (GDPR compliance)
   */
  exportData: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          memberships: {
            include: {
              organization: true,
            },
          },
          accounts: true,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      // Return user data for export (excluding sensitive information)
      return {
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        organizations: user.memberships.map((membership: any) => ({
          organizationId: membership.organizationId,
          organizationName: membership.organization.name,
          role: membership.role,
          joinedAt: membership.createdAt,
        })),
        connectedAccounts: user.accounts.map((account: any) => ({
          provider: account.provider,
          type: account.type,
          createdAt: account.createdAt,
        })),
        exportedAt: new Date().toISOString(),
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to export user data',
      })
    }
  }),

  /**
   * Delete user account
   */
  deleteAccount: protectedProcedure
    .input(
      z.object({
        password: z.string().min(1, 'Password confirmation is required'),
        confirmation: z.literal('DELETE', {
          errorMap: () => ({ message: 'Please type DELETE to confirm' }),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { id: true, password: true },
        })

        if (!user || !user.password) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          })
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(input.password, user.password)

        if (!isValidPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Password is incorrect',
          })
        }

        // First check if user is the owner of any organizations
        const ownedOrgs = await ctx.db.membership.findMany({
          where: {
            userId: ctx.session.user.id,
            role: 'OWNER',
          },
          include: {
            organization: true,
          },
        })

        if (ownedOrgs.length > 0) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message:
              'Cannot delete account while owning organizations. Transfer ownership first.',
          })
        }

        // Delete user account (cascade will handle related records)
        await ctx.db.user.delete({
          where: { id: ctx.session.user.id },
        })

        return { success: true, message: 'Account deleted successfully' }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete account',
        })
      }
    }),

  /**
   * Check if email is available
   */
  checkEmailAvailable: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      })

      return { available: !existingUser }
    }),
})
