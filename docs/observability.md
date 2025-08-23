# Observability Guide

This document outlines the observability practices, monitoring, logging, and performance tracking
implemented in the Next.js SaaS Template.

## Overview

Observability is crucial for maintaining a production SaaS application. Our observability stack
provides insights into application performance, user behavior, errors, and system health.

## Logging

### Structured Logging with Pino

We use Pino for high-performance, structured logging throughout the application:

```typescript
// src/lib/logger.ts
import pino from 'pino'

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
})

// Usage with request context
export const createRequestLogger = (requestId: string) => {
  return logger.child({ requestId })
}
```

### Log Levels and Categories

#### Error Logs

- **Authentication failures**: Failed login attempts, invalid tokens
- **Authorization denials**: Insufficient permissions
- **Payment errors**: Stripe webhook failures, billing issues
- **System errors**: Database connection issues, external API failures

#### Info Logs

- **User actions**: Login, signup, subscription changes
- **Business events**: New organizations created, invitations sent
- **System events**: Database migrations, deployments

#### Debug Logs (Development only)

- **Request/Response**: API call details
- **Query performance**: Slow database queries
- **Cache operations**: Cache hits/misses

### Request Tracing

Every request gets a unique identifier for tracing:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID()

  // Add to request headers
  request.headers.set('x-request-id', requestId)

  // Log request start
  logger.info(
    {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
    },
    'Request started'
  )

  return NextResponse.next({
    headers: {
      'x-request-id': requestId,
    },
  })
}
```

## Error Tracking

### Sentry Integration (Optional)

Sentry provides comprehensive error tracking and performance monitoring:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Error filtering
  beforeSend(event, hint) {
    // Don't send client-side 404 errors
    if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
      return null
    }
    return event
  },

  // User context
  initialScope: {
    tags: {
      component: 'nextjs-saas-template',
    },
  },
})
```

### Error Boundaries

React Error Boundaries catch and handle component errors:

```typescript
// src/components/error-boundary.tsx
'use client'

import * as Sentry from '@sentry/nextjs'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">
            We've been notified of this error and will fix it soon.
          </p>
          <button
            onClick={resetError}
            className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </div>
      )}
      beforeCapture={(scope, error, errorInfo) => {
        scope.setContext('errorBoundary', errorInfo)
      }}
    >
      {children}
    </SentryErrorBoundary>
  )
}
```

## Performance Monitoring

### Web Vitals Tracking

Track Core Web Vitals for performance insights:

```typescript
// src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics 4
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    })
  }
}

// Track all Web Vitals
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### Database Query Monitoring

Monitor database performance with Prisma:

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],

    // Query event logging
    __internal: {
      engine: {
        enableEngineDebugMode: process.env.NODE_ENV === 'development',
      },
    },
  })

// Log slow queries in production
if (process.env.NODE_ENV === 'production') {
  prisma.$on('query', e => {
    if (e.duration > 1000) {
      // Log queries > 1 second
      logger.warn(
        {
          query: e.query,
          params: e.params,
          duration: e.duration,
          target: e.target,
        },
        'Slow database query detected'
      )
    }
  })
}
```

## Metrics and Analytics

### Business Metrics

Track key business metrics for SaaS success:

```typescript
// src/lib/metrics.ts
interface MetricEvent {
  name: string
  value: number
  labels?: Record<string, string>
  timestamp?: Date
}

export class Metrics {
  // User metrics
  static trackUserSignup(userId: string, source: string) {
    this.track('user_signup', 1, { source, userId })
  }

  static trackSubscriptionCreated(plan: string, amount: number) {
    this.track('subscription_created', amount, { plan })
  }

  static trackFeatureUsage(feature: string, userId: string) {
    this.track('feature_usage', 1, { feature, userId })
  }

  // System metrics
  static trackApiRequest(endpoint: string, method: string, duration: number) {
    this.track('api_request', duration, { endpoint, method })
  }

  static trackDatabaseQuery(operation: string, duration: number) {
    this.track('db_query', duration, { operation })
  }

  private static track(name: string, value: number, labels?: Record<string, string>) {
    // Implementation depends on your metrics backend
    // Examples: Prometheus, DataDog, New Relic
    logger.info(
      {
        metric: name,
        value,
        labels,
        timestamp: new Date().toISOString(),
      },
      'Metric tracked'
    )
  }
}
```

### Health Checks

Implement health check endpoints for monitoring:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`

    // Check external service connectivity
    const stripeHealthy = await checkStripeHealth()

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        stripe: stripeHealthy ? 'healthy' : 'degraded',
      },
      version: process.env.npm_package_version,
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    )
  }
}

async function checkStripeHealth() {
  try {
    // Simple Stripe API call to check connectivity
    await stripe.accounts.retrieve()
    return true
  } catch {
    return false
  }
}
```

## Alerting

### Alert Configuration

Set up alerts for critical issues:

```typescript
// Alert thresholds and conditions
const alertConfig = {
  // Error rate alerts
  errorRate: {
    threshold: 0.05, // 5% error rate
    window: '5m',
    condition: 'above',
  },

  // Performance alerts
  responseTime: {
    threshold: 2000, // 2 seconds
    percentile: 95,
    window: '10m',
    condition: 'above',
  },

  // Business alerts
  failedPayments: {
    threshold: 5,
    window: '1h',
    condition: 'above',
  },

  // Infrastructure alerts
  databaseConnections: {
    threshold: 80, // % of max connections
    window: '5m',
    condition: 'above',
  },
}
```

### Notification Channels

Configure multiple notification channels:

- **Slack**: For development team notifications
- **PagerDuty**: For critical production issues
- **Email**: For business stakeholders
- **SMS**: For emergency notifications

## Dashboards

### Operational Dashboard

Key metrics for day-to-day operations:

- **Request volume and error rates**
- **Response time percentiles**
- **Database query performance**
- **User activity and growth**
- **Revenue and subscription metrics**

### Business Dashboard

Key metrics for business stakeholders:

- **Monthly Recurring Revenue (MRR)**
- **Customer Acquisition Cost (CAC)**
- **Churn rate and retention**
- **Feature adoption rates**
- **Support ticket volume**

### Development Dashboard

Key metrics for development team:

- **Deployment frequency**
- **Lead time for changes**
- **Mean Time to Recovery (MTTR)**
- **Code quality metrics**
- **Test coverage**

## Log Aggregation

### Structured Logging Format

All logs follow a consistent structure:

```typescript
interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error'
  timestamp: string
  requestId?: string
  userId?: string
  organizationId?: string
  message: string
  metadata?: Record<string, any>
  error?: {
    name: string
    message: string
    stack: string
  }
}
```

### Log Retention

- **Development**: 7 days local retention
- **Staging**: 30 days retention
- **Production**: 90 days retention for errors, 30 days for info logs

## Monitoring Checklist

### Pre-Production

- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Health checks implemented
- [ ] Alert thresholds defined
- [ ] Dashboards created
- [ ] Log aggregation configured

### Post-Production

- [ ] Monitor error rates and performance
- [ ] Review and adjust alert thresholds
- [ ] Analyze user behavior patterns
- [ ] Track business metrics
- [ ] Regular dashboard reviews
- [ ] Incident post-mortems

## Tools and Services

### Recommended Stack

- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Built-in Next.js analytics
- **Prisma Pulse**: Real-time database monitoring
- **Stripe Dashboard**: Payment and billing insights

### Alternative Options

- **DataDog**: Comprehensive monitoring and logging
- **New Relic**: Application performance monitoring
- **LogRocket**: Session replay and frontend monitoring
- **Grafana + Prometheus**: Open-source monitoring stack

## Getting Started

1. **Configure Sentry** (optional):

   ```bash
   pnpm add @sentry/nextjs
   # Follow Sentry setup wizard
   ```

2. **Set up health checks**:

   ```typescript
   // Implement health check endpoint
   // Configure monitoring service to check /api/health
   ```

3. **Enable structured logging**:

   ```typescript
   // Use logger throughout application
   logger.info({ userId, action }, 'User performed action')
   ```

4. **Create dashboards**:
   - Set up monitoring service dashboards
   - Configure alerts and notifications
   - Train team on dashboard usage

Remember: Observability is most effective when implemented from the start and continuously improved
based on insights gained from production usage.
