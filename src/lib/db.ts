/**
 * Database connection using Prisma
 * This file handles the database connection and ensures only one instance
 * is created during development (hot reloading protection)
 */

import { PrismaClient } from '@prisma/client'
import { env } from '@/lib/env.mjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Handle graceful shutdown
if (env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}

export type Database = typeof db
