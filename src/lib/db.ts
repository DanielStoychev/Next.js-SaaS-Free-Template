/**
 * Database connection using Prisma
 * This file handles the database connection and ensures only one instance
 * is created during development (hot reloading protection)
 *
 * IMPORTANT: This should only be used on the server-side
 */

import { PrismaClient } from '@prisma/client'

// Prevent client-side usage
if (typeof window !== 'undefined') {
  throw new Error(
    'Database client cannot be used on the client-side. This is a server-only module.'
  )
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Handle graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}

export type Database = typeof db
