import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/lib/auth'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/settings', '/billing', '/api/trpc']

// Public routes that authenticated users shouldn't access
const authRoutes = ['/signin', '/signup', '/auth/error']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Check if route is auth-related
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without session, redirect to signin
  if (isProtectedRoute && !session) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // If accessing auth route with session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add security headers
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  return response
}

export const config = {
  matcher: [],
}
