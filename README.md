# Next.js SaaS Free Template

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)
![Stripe](https://img.shields.io/badge/Stripe-test--mode-635BFF)
![License](https://img.shields.io/badge/license-MIT-blue)

**A production-ready, ultra-modern Next.js 15 SaaS template with TypeScript, Stripe billing,
NextAuth, and complete testing setup.**

[Demo](#) · [Documentation](./docs/README.md) ·
[Report Bug](https://github.com/DanielStoychev/Next.js-SaaS-Free-Template/issues) ·
[Request Feature](https://github.com/DanielStoychev/Next.js-SaaS-Free-Template/issues)

</div>

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/DanielStoychev/Next.js-SaaS-Free-Template.git
cd Next.js-SaaS-Free-Template

# Install dependencies
make setup

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations
make db-migrate

# Start development server
make dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your SaaS in action!

## ✨ Features

### 🏗️ **Modern Architecture**

- **Next.js 15.5.0** with App Router and Server Components
- **TypeScript** strict mode with full type safety
- **tRPC** for end-to-end type-safe APIs
- **Prisma 6.14.0** ORM with PostgreSQL
- **Server Actions** for seamless client-server communication

### 🔐 **Authentication & Authorization**

- **NextAuth.js v5** with multiple providers
- Magic link authentication
- Role-based access control (RBAC)
- Organization-based permissions
- Session management with JWT

### 💳 **Billing & Subscriptions**

- **Stripe** integration with test mode
- Subscription management (Free, Pro, Team plans)
- Usage-based billing with metering
- Webhook handling with signature verification
- Customer portal for billing management

### 🎨 **UI/UX Excellence**

- **Tailwind CSS** for styling
- **shadcn/ui** components with Radix UI primitives
- Dark/light theme support with system preference
- Fully responsive design
- Accessibility-first approach (WCAG compliant)
- Loading states and error boundaries

### 🧪 **Testing & Quality**

- **Vitest** for unit testing
- **React Testing Library** for component testing
- **Playwright** for end-to-end testing
- **MSW** for API mocking
- 80%+ test coverage requirement
- ESLint + Prettier with strict rules

### 📊 **Observability**

- Structured logging with Pino
- Error tracking with Sentry (optional)
- Performance monitoring
- Audit logging for compliance
- Request tracing

### 🛡️ **Security**

- Input validation with Zod schemas
- CSRF protection
- Rate limiting
- Secure headers configuration
- SQL injection prevention
- XSS protection

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   └── forms/        # Form components
│   ├── server/           # Server-side code
│   │   ├── auth/         # Authentication logic
│   │   ├── db/           # Database utilities
│   │   └── api/          # tRPC routers
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
├── prisma/               # Database schema & migrations
├── docs/                 # Documentation
├── scripts/              # Build & deployment scripts
└── infra/                # Infrastructure as code
```

## 🛠️ Tech Stack

| Category           | Technology                                     |
| ------------------ | ---------------------------------------------- |
| **Framework**      | Next.js 15.5.0, React 18.3.1, TypeScript 5.5.4 |
| **Database**       | PostgreSQL, Prisma ORM 6.14.0                  |
| **Authentication** | NextAuth.js v5                                 |
| **Payments**       | Stripe (test mode)                             |
| **API**            | tRPC, React Query                              |
| **UI**             | Tailwind CSS, shadcn/ui, Radix UI              |
| **Testing**        | Vitest, Playwright, Testing Library            |
| **Deployment**     | Vercel, Docker                                 |

## 📖 Documentation

- [Architecture Overview](./docs/architecture.md)
- [Getting Started Guide](./docs/getting-started.md)
- [Environment Setup](./docs/environment.md)
- [Database Setup](./docs/database.md)
- [Authentication Guide](./docs/auth.md)
- [Stripe Integration](./docs/billing.md)
- [Testing Guide](./docs/testing.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing](./docs/contributing.md)

## 🚦 Available Commands

Run these commands using `make <command>` or check the [Makefile](./Makefile) for details:

```bash
make setup          # Install dependencies and setup
make dev             # Start development server
make build           # Build for production
make start           # Start production server
make typecheck       # Run TypeScript type checking
make lint            # Run ESLint
make test            # Run all tests
make test:unit       # Run unit tests only
make test:e2e        # Run end-to-end tests
make coverage        # Generate test coverage report
make db-migrate      # Run database migrations
make db-seed         # Seed database with sample data
```

## 🌟 Screenshots

_Coming soon - screenshots of the application will be added here_

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [shadcn](https://ui.shadcn.com/) for the beautiful UI components
- [Stripe](https://stripe.com/) for payment processing
- All contributors and the open-source community

---

<div align="center">
Made with ❤️ by <a href="https://github.com/DanielStoychev">Daniel Stoychev</a>
</div>
