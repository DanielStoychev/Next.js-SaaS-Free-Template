import { TRPCError } from '@trpc/server'
import { z } from 'zod'

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
        name: z.string().min(1).max(100),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      })

      return updatedUser
    }),

  /**
   * Delete user account
   */
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
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

    return { success: true }
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
