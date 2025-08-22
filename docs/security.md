# Security Guide

This document outlines the security practices, considerations, and implementations in the Next.js SaaS Template.

## Overview

Security is built into every layer of the application, from input validation to deployment. This guide covers our security measures and best practices.

## Authentication & Authorization

### NextAuth.js v5 Configuration
- **JWT Strategy**: Secure session management with JWT tokens
- **CSRF Protection**: Built-in CSRF protection for all forms
- **Secure Cookies**: HTTPOnly, Secure, and SameSite cookie attributes
- **Session Rotation**: Automatic session token rotation on sensitive operations

### Multi-Factor Authentication (Future)
- **TOTP Support**: Time-based one-time passwords
- **Backup Codes**: Recovery codes for account access
- **Device Trust**: Remember trusted devices

### Role-Based Access Control (RBAC)
```typescript
// Organization roles
enum Role {
  OWNER = "OWNER",     // Full access to organization
  ADMIN = "ADMIN",     // Manage users and settings
  MEMBER = "MEMBER"    // Basic access
}

// Permission checking
const hasPermission = (user: User, action: string, resource: string) => {
  // Implementation in src/server/auth/permissions.ts
}
```

## Input Validation & Sanitization

### Zod Schema Validation
All external inputs are validated using Zod schemas:

```typescript
// API route validation
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  organizationId: z.string().uuid()
})

// Environment validation
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32)
})
```

### Database Security
- **Prisma ORM**: Prevents SQL injection through parameterized queries
- **Input Sanitization**: All user inputs sanitized before database operations
- **Least Privilege**: Database user has minimal required permissions

### XSS Prevention
- **Content Security Policy**: Strict CSP headers
- **Output Encoding**: All dynamic content properly encoded
- **Sanitization**: User-generated content sanitized with DOMPurify

## API Security

### tRPC Security Middleware
```typescript
const authProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user
    }
  })
})
```

### Rate Limiting
- **API Endpoints**: Rate limiting on all public endpoints
- **User-based Limits**: Per-user rate limits for authenticated endpoints
- **Sliding Window**: Advanced rate limiting with sliding window algorithm

### Error Handling
- **Secure Errors**: No sensitive information in error messages
- **Error Logging**: All errors logged for monitoring
- **User-Friendly Messages**: Generic error messages for users

## Data Protection

### Encryption
- **At Rest**: Database encryption for sensitive fields
- **In Transit**: TLS 1.3 for all connections
- **Application Level**: Additional encryption for PII data

### Secrets Management
- **Environment Variables**: All secrets in environment variables
- **Validation**: Runtime validation of required secrets
- **Rotation**: Regular secret rotation procedures

### Data Retention
- **User Deletion**: Complete user data deletion on account closure
- **Audit Logs**: Secure storage of audit logs for compliance
- **Backups**: Encrypted backups with limited retention

## Payment Security

### Stripe Integration
- **Webhook Signatures**: All webhooks verified with signatures
- **Test Mode**: Development uses Stripe test mode only
- **PCI Compliance**: No card data stored in application
- **Idempotency**: Idempotent payment operations

### Billing Security
```typescript
// Webhook signature verification
const verifyStripeSignature = (payload: string, signature: string) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    throw new Error('Invalid signature')
  }
}
```

## Infrastructure Security

### HTTP Security Headers
```typescript
// Next.js middleware configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### Content Security Policy
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
```

## Monitoring & Incident Response

### Security Logging
- **Authentication Events**: All login attempts logged
- **Authorization Failures**: Failed permission checks logged
- **Sensitive Operations**: User management, billing changes logged
- **Error Tracking**: All security-related errors tracked

### Audit Trail
```typescript
// Audit log entry
interface AuditLog {
  userId: string
  action: string
  resource: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  success: boolean
  metadata?: Record<string, any>
}
```

### Incident Response
1. **Detection**: Automated alerts for security events
2. **Assessment**: Rapid threat assessment procedures
3. **Containment**: Immediate containment strategies
4. **Recovery**: System recovery and hardening
5. **Lessons Learned**: Post-incident analysis and improvements

## Compliance

### GDPR Compliance
- **Data Minimization**: Only collect necessary data
- **Consent Management**: Clear consent for data processing
- **Right to Deletion**: Complete data deletion capabilities
- **Data Portability**: User data export functionality
- **Privacy by Design**: Security and privacy built-in

### SOC 2 Readiness
- **Access Controls**: Comprehensive access control system
- **Change Management**: All changes tracked and approved
- **Data Protection**: Encryption and secure data handling
- **Monitoring**: Continuous monitoring and logging
- **Incident Response**: Documented incident response procedures

## Security Testing

### Static Analysis
- **ESLint Security**: Security-focused ESLint rules
- **Dependency Scanning**: Regular dependency vulnerability scans
- **Code Review**: Security-focused code reviews

### Dynamic Testing
- **Penetration Testing**: Regular penetration testing
- **Vulnerability Scanning**: Automated vulnerability scans
- **Security Headers**: Regular security header validation

### Testing Checklist
- [ ] Input validation for all endpoints
- [ ] Authentication bypass attempts
- [ ] Authorization escalation tests
- [ ] SQL injection testing (automated via ORM)
- [ ] XSS testing (automated and manual)
- [ ] CSRF protection verification
- [ ] Rate limiting validation
- [ ] Security header verification

## Security Best Practices

### Development
1. **Security by Design**: Consider security from the start
2. **Principle of Least Privilege**: Minimal required permissions
3. **Defense in Depth**: Multiple security layers
4. **Fail Secure**: Secure defaults for all configurations
5. **Regular Updates**: Keep all dependencies up-to-date

### Deployment
1. **Environment Isolation**: Separate dev/staging/production
2. **Secret Management**: Never commit secrets to code
3. **Secure Defaults**: Production-ready default configurations
4. **Monitoring**: Comprehensive security monitoring
5. **Backup Security**: Secure and tested backup procedures

### Operations
1. **Access Reviews**: Regular access permission reviews
2. **Security Training**: Regular security training for team
3. **Incident Drills**: Regular incident response drills
4. **Vulnerability Management**: Proactive vulnerability management
5. **Documentation**: Keep security documentation current

## Contact

For security issues, please contact:
- **Email**: security@yourcompany.com
- **Response Time**: 24 hours for critical issues
- **PGP Key**: [Link to public key]

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Stripe Security](https://stripe.com/docs/security)
- [Prisma Security](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Note**: This security guide should be reviewed and updated regularly as threats evolve and new security measures are implemented.
