# Contributing Guide

Thank you for your interest in contributing to the Next.js SaaS Free Template! This guide will help you get started with contributing to the project.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20.0.0 or higher
- **pnpm** 8.0.0 or higher
- **Git**
- **PostgreSQL** (for local development)

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Next.js-SaaS-Free-Template.git
   cd Next.js-SaaS-Free-Template
   ```

3. **Set up the development environment**:
   ```bash
   make setup
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

5. **Set up the database**:
   ```bash
   make db-migrate
   make db-seed
   ```

6. **Start the development server**:
   ```bash
   make dev
   ```

## Project Structure

Understanding the project structure will help you navigate and contribute effectively:

```
├── app/                    # Next.js App Router pages
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── layout/       # Layout components
│   │   └── forms/        # Form components
│   ├── server/           # Server-side code
│   │   ├── auth/         # Authentication
│   │   ├── db/           # Database utilities
│   │   └── api/          # tRPC routers
│   ├── lib/              # Utility functions
│   ├── styles/           # Global styles
│   └── tests/            # Test utilities
├── prisma/               # Database schema
├── docs/                 # Documentation
└── scripts/              # Build scripts
```

## Development Workflow

### 1. Create a Branch

Create a descriptive branch name:
```bash
git checkout -b feat/user-dashboard
git checkout -b fix/stripe-webhook-handling
git checkout -b docs/update-readme
```

### 2. Make Your Changes

Follow our coding standards:
- **TypeScript strict mode**: No `any` types
- **ESLint**: Follow the configured rules
- **Prettier**: Code formatting is enforced
- **Conventional Commits**: Use conventional commit messages

### 3. Write Tests

All contributions must include appropriate tests:
- **Unit tests** for utility functions and business logic
- **Component tests** for React components
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows

### 4. Run Quality Checks

Before committing, run these checks:
```bash
make typecheck    # TypeScript compilation
make lint         # ESLint checking
make test         # All tests
make coverage     # Test coverage
```

### 5. Commit Your Changes

Use conventional commit messages:
```bash
git commit -m "feat(auth): add magic link authentication"
git commit -m "fix(billing): handle failed stripe webhooks"
git commit -m "docs(readme): update installation instructions"
```

### 6. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

- **Strict mode enabled**: All code must compile in strict mode
- **No `any` types**: Use proper typing or `unknown` when necessary
- **Interfaces over types**: Prefer interfaces for object shapes
- **Branded types**: Use branded types for IDs and sensitive data

```typescript
// Good
interface User {
  id: UserId
  email: string
  name: string
}

type UserId = string & { readonly brand: unique symbol }

// Avoid
const user: any = getUserData()
```

### React Components

- **Server Components by default**: Use Client Components only when necessary
- **Props interfaces**: Define clear prop interfaces
- **Forward refs**: Use forwardRef for components that need DOM refs
- **Error boundaries**: Implement proper error handling

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }))} {...props}>
        {children}
      </button>
    )
  }
)
```

### API Development

- **tRPC procedures**: Use tRPC for type-safe APIs
- **Zod validation**: Validate all inputs with Zod schemas
- **Error handling**: Use proper error types and messages
- **Authentication**: Check authentication and authorization

```typescript
// Good
const createUserProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      organizationId: z.string().uuid()
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Implementation with proper error handling
  })
```

### Database

- **Prisma migrations**: Use migrations for schema changes
- **Proper relations**: Define clear database relationships
- **Indexes**: Add indexes for frequently queried fields
- **Soft deletes**: Implement soft deletes where appropriate

```typescript
// Good - Prisma schema
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  name           String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@index([organizationId])
}
```

## Testing Guidelines

### Unit Tests

Test individual functions and modules:
```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { calculateMRR } from './billing'

describe('calculateMRR', () => {
  it('should calculate monthly recurring revenue correctly', () => {
    const subscriptions = [
      { amount: 2000, interval: 'month' },
      { amount: 24000, interval: 'year' }
    ]
    
    expect(calculateMRR(subscriptions)).toBe(4000) // $40.00
  })
})
```

### Component Tests

Test React components:
```typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with correct variant classes', () => {
    render(<Button variant="primary">Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('bg-primary')
  })
})
```

### E2E Tests

Test critical user flows:
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign up and create organization', async ({ page }) => {
  await page.goto('/signup')
  
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="name"]', 'Test User')
  await page.click('[type="submit"]')
  
  await expect(page).toHaveURL('/onboarding')
})
```

## Documentation

### Code Documentation

- **JSDoc comments**: Document complex functions and classes
- **README updates**: Update README for new features
- **Architecture decisions**: Document significant changes in ADRs

### API Documentation

- **tRPC**: APIs are self-documenting through TypeScript
- **Environment variables**: Document all env vars in `.env.example`
- **Database schema**: Document complex relationships

## Pull Request Process

### PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows the style guidelines
- [ ] All tests pass locally
- [ ] New tests are added for new functionality
- [ ] Documentation is updated
- [ ] PR description explains the change
- [ ] Screenshots for UI changes
- [ ] Breaking changes are documented

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Breaking Changes
List any breaking changes and migration steps.
```

### Review Process

1. **Automated checks**: CI must pass
2. **Code review**: At least one maintainer review
3. **Testing**: Verify tests cover the changes
4. **Documentation**: Ensure docs are updated
5. **Merge**: Maintainer merges after approval

## Issue Guidelines

### Bug Reports

When reporting bugs:
- Use the bug report template
- Provide reproduction steps
- Include environment details
- Add screenshots if applicable

### Feature Requests

When requesting features:
- Use the feature request template
- Explain the use case and value
- Consider implementation complexity
- Provide mockups if helpful

### Questions

For questions:
- Check existing documentation first
- Search existing issues
- Provide context and details
- Be specific about what you need help with

## Release Process

The project follows semantic versioning:
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features (backward compatible)
- **Patch** (0.0.X): Bug fixes

### Changelog

All changes are documented in `CHANGELOG.md` following the format:
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

## Community

### Getting Help

- **Documentation**: Check the `/docs` directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions

### Recognition

Contributors are recognized in:
- **README**: Contributors section
- **Release notes**: Major contributions mentioned
- **GitHub**: Contributor graph and statistics

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making this SaaS template better for everyone! 🚀
