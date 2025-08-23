import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const organizationRouter = createTRPCRouter({
  /**
   * Get user's organizations
   */
  getUserOrganizations: protectedProcedure.query(async ({ ctx }) => {
    const memberships = await ctx.db.membership.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        organization: {
          include: {
            _count: {
              select: { memberships: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return memberships.map((membership: any) => ({
      ...membership.organization,
      role: membership.role,
      memberCount: membership.organization._count.memberships,
    }))
  }),

  /**
   * Get organization by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if user has access to this organization
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.id,
        },
        include: {
          organization: {
            include: {
              memberships: {
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
              },
            },
          },
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied to this organization',
        })
      }

      return {
        ...membership.organization,
        userRole: membership.role,
      }
    }),

  /**
   * Create new organization
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z
          .string()
          .min(1)
          .max(50)
          .regex(/^[a-z0-9-]+$/),
        description: z.string().max(500).optional(),
        website: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if slug is available
      const existingOrg = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      })

      if (existingOrg) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Organization slug already exists',
        })
      }

      // Create organization and membership in a transaction
      const result = await ctx.db.$transaction(async (tx: any) => {
        const organization = await tx.organization.create({
          data: input,
        })

        await tx.membership.create({
          data: {
            userId: ctx.session.user.id,
            organizationId: organization.id,
            role: 'OWNER',
          },
        })

        return organization
      })

      return result
    }),

  /**
   * Update organization
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        website: z.string().url().optional(),
        logo: z.string().url().optional(),
        settings: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has admin access
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.id,
          role: { in: ['OWNER', 'ADMIN'] },
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient permissions to update organization',
        })
      }

      const { id, ...updateData } = input
      const updatedOrg = await ctx.db.organization.update({
        where: { id },
        data: updateData,
      })

      return updatedOrg
    }),

  /**
   * Delete organization
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is owner
      const membership = await ctx.db.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: input.id,
          role: 'OWNER',
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only organization owners can delete organizations',
        })
      }

      // Delete organization (cascade will handle related records)
      await ctx.db.organization.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  /**
   * Check if slug is available
   */
  checkSlugAvailable: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const existingOrg = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      })

      return { available: !existingOrg }
    }),
})
