/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, createTRPCRouter } from './trpc'
import { userRouter } from './routers/user'
import { organizationRouter } from './routers/organization'
import { analyticsRouter } from './routers/analytics'
import { subscriptionRouter } from './routers/subscription'

export const appRouter = createTRPCRouter({
  user: userRouter,
  organization: organizationRouter,
  analytics: analyticsRouter,
  subscription: subscriptionRouter,
})

export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.user.getCurrentUser();
 */
export const createCaller = createCallerFactory(appRouter)
