import { PrismaAdapter } from '@auth/prisma-adapter'
import { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Discord from 'next-auth/providers/discord'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'

import { db } from '@/lib/db'
import { env } from '@/lib/env.mjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User {
    role?: string
  }
}

const providers = []

// Add development test user provider (only in development)
if (process.env.NODE_ENV === 'development') {
  providers.push(
    Credentials({
      id: 'test-user',
      name: 'Test User (Development)',
      credentials: {
        testUser: {
          label: 'Test User Type',
          type: 'text',
          placeholder: 'user or admin',
        },
      },
      async authorize(credentials) {
        try {
          // This is for development only - creates a test user
          if (!credentials?.testUser) return null

          const isAdmin = credentials.testUser === 'admin'
          const email = isAdmin ? 'admin@example.com' : 'user@example.com'
          const role = isAdmin ? 'ADMIN' : 'USER'

          // Check if test user already exists in database
          let user = await db.user.findUnique({
            where: { email: email },
          })

          // Create test user if it doesn't exist
          if (!user) {
            user = await db.user.create({
              data: {
                email: email,
                name: isAdmin ? 'Test Admin' : 'Test User',
                role: role,
              },
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Test user auth error:', error)
          return null
        }
      },
    })
  )
}

// Add GitHub provider if configured
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  )
}

// Add Google provider if configured
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  )
}

// Add Discord provider if configured
if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
  providers.push(
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  )
}

// Add Resend provider if configured
if (env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
    })
  )
}

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers,
  pages: {
    signIn: '/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/onboarding',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authorized, otherwise redirect to login page
      return !!auth
    },
    jwt: async ({ token, user }) => {
      if (user) {
        // Add role to token on sign in
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string | undefined
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: env.NODE_ENV === 'development',
} satisfies NextAuthConfig
