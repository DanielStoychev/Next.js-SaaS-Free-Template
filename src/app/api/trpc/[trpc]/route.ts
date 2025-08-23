import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { createTRPCContext } from '@/server/api/trpc'
import { appRouter } from '@/server/api/root'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    session: await auth(),
    headers: Object.fromEntries(req.headers.entries()),
  })
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
  })

export { handler as GET, handler as POST }
