import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const analyticsRouter = createTRPCRouter({
  /**
   * Get dashboard overview stats
   */
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get current user's organization
      const userWithOrg = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          memberships: {
            include: {
              organization: true,
            },
          },
        },
      })

      const organizationId = userWithOrg?.memberships[0]?.organizationId

      // Get total users count
      const totalUsers = await ctx.db.user.count()

      // Get organization specific stats if user belongs to one
      const orgUsers = organizationId
        ? await ctx.db.organizationMember.count({
            where: { organizationId },
          })
        : 0

      // Generate realistic analytics data
      const now = new Date()
      const lastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      )

      // Simulate revenue data
      const currentRevenue = Math.floor(Math.random() * 10000) + 5000
      const lastMonthRevenue = Math.floor(Math.random() * 8000) + 4000
      const revenueGrowth =
        ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

      // Simulate user growth
      const currentUsers = totalUsers
      const lastMonthUsers = Math.floor(totalUsers * 0.85)
      const userGrowth =
        ((currentUsers - lastMonthUsers) / lastMonthUsers) * 100

      // Simulate conversion rate
      const conversionRate = Math.random() * 5 + 2 // 2-7%
      const lastMonthConversion = Math.random() * 5 + 2
      const conversionGrowth =
        ((conversionRate - lastMonthConversion) / lastMonthConversion) * 100

      return {
        totalRevenue: currentRevenue,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        totalUsers: currentUsers,
        userGrowth: Math.round(userGrowth * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        conversionGrowth: Math.round(conversionGrowth * 100) / 100,
        organizationUsers: orgUsers,
      }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch dashboard stats',
      })
    }
  }),

  /**
   * Get revenue chart data
   */
  getRevenueChart: protectedProcedure
    .input(
      z.object({
        period: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
      })
    )
    .query(async ({ input }) => {
      const { period } = input

      // Generate realistic revenue data based on period
      const getDaysFromPeriod = (period: string) => {
        switch (period) {
          case '7d':
            return 7
          case '30d':
            return 30
          case '90d':
            return 90
          case '1y':
            return 365
          default:
            return 30
        }
      }

      const days = getDaysFromPeriod(period)
      const data = []

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        // Generate realistic revenue with some growth trend
        const baseRevenue = 100 + Math.random() * 200
        const trendBonus = ((days - i) / days) * 50 // Growth trend
        const revenue = Math.floor(
          baseRevenue + trendBonus + Math.random() * 100
        )

        data.push({
          date: date.toISOString().split('T')[0],
          revenue,
          name: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        })
      }

      return data
    }),

  /**
   * Get user analytics chart data
   */
  getUserAnalytics: protectedProcedure
    .input(
      z.object({
        period: z.enum(['7d', '30d', '90d']).default('30d'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { period } = input

      // Get actual user registration data
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const userRegistrations = await ctx.db.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _count: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      // Fill in missing days with 0 counts
      const data = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const registrationsForDay = userRegistrations.filter(
          (reg: any) => reg.createdAt.toISOString().split('T')[0] === dateStr
        )

        const count = registrationsForDay.reduce(
          (sum: number, reg: any) => sum + reg._count.id,
          0
        )

        // Add some simulated data if no real registrations
        const simulatedCount = count || Math.floor(Math.random() * 10)

        data.push({
          date: dateStr,
          users: simulatedCount,
          name: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        })
      }

      return data
    }),

  /**
   * Get conversion funnel data
   */
  getConversionFunnel: protectedProcedure.query(async ({ ctx }) => {
    try {
      const totalUsers = await ctx.db.user.count()

      // Simulate realistic conversion funnel
      const visitors = Math.floor(totalUsers * 10) // Assume 10x visitors than users
      const signups = totalUsers
      const activations = Math.floor(totalUsers * 0.7) // 70% activation rate
      const subscriptions = Math.floor(totalUsers * 0.15) // 15% subscription rate

      return [
        { stage: 'Visitors', count: visitors, percentage: 100 },
        {
          stage: 'Sign-ups',
          count: signups,
          percentage: Math.round((signups / visitors) * 100),
        },
        {
          stage: 'Activations',
          count: activations,
          percentage: Math.round((activations / visitors) * 100),
        },
        {
          stage: 'Subscriptions',
          count: subscriptions,
          percentage: Math.round((subscriptions / visitors) * 100),
        },
      ]
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch conversion funnel data',
      })
    }
  }),

  /**
   * Get top performing pages/features
   */
  getTopPerformers: protectedProcedure.query(async () => {
    // Simulate top performing pages with colorful themes
    const pages = [
      { name: 'Dashboard', views: 15420, theme: 'neon', growth: 12.5 },
      { name: 'Analytics', views: 8930, theme: 'electric', growth: 8.2 },
      { name: 'Settings', views: 6750, theme: 'cyber', growth: -2.1 },
      { name: 'Pricing', views: 5680, theme: 'aurora', growth: 15.7 },
      { name: 'Profile', views: 4320, theme: 'plasma', growth: 6.9 },
      { name: 'Components', views: 3890, theme: 'neon', growth: 22.4 },
    ]

    return pages.sort((a, b) => b.views - a.views)
  }),

  /**
   * Get real-time activity feed
   */
  getActivityFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get recent user activities (registrations, updates, etc.)
        const recentUsers = await ctx.db.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: input.limit,
        })

        // Transform into activity feed format
        const activities = recentUsers.map((user: any) => ({
          id: user.id,
          type: 'user_registration',
          user: {
            name: user.name || 'Anonymous User',
            email: user.email,
            image: user.image,
          },
          timestamp: user.createdAt,
          description: `${user.name || 'New user'} joined the platform`,
          theme: ['neon', 'electric', 'cyber', 'aurora', 'plasma'][
            Math.floor(Math.random() * 5)
          ],
        }))

        return activities
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch activity feed',
        })
      }
    }),
})
