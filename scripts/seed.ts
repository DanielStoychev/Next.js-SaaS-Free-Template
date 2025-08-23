#!/usr/bin/env tsx

/**
 * Database seed script
 * Populates the database with sample data for development and colorful analytics
 */

import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface SeedOptions {
  environment: 'development' | 'test'
  userCount?: number
  organizationCount?: number
  reset?: boolean
}

class DatabaseSeeder {
  private options: SeedOptions

  constructor(options: SeedOptions = { environment: 'development' }) {
    this.options = {
      userCount: 50, // Increased for better analytics data
      organizationCount: 5,
      ...options,
    }
  }

  async seed(): Promise<void> {
    console.log(
      `🌱 Seeding database for ${this.options.environment} environment...`
    )

    try {
      if (this.options.reset) {
        await this.cleanup()
      }

      const organizations = await this.seedOrganizations()
      await this.seedUsers(organizations)
      await this.seedPlans()

      console.log('✅ Database seeding completed successfully!')
    } catch (error) {
      console.error('❌ Seeding failed:', error)
      throw error
    } finally {
      await prisma.$disconnect()
    }
  }

  private async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up existing data...')

    // Delete in order due to foreign key constraints
    await prisma.subscription?.deleteMany()
    await prisma.membership?.deleteMany()
    await prisma.user?.deleteMany()
    await prisma.organization?.deleteMany()
    await prisma.plan?.deleteMany()

    console.log('✅ Cleanup completed')
  }

  private async seedPlans(): Promise<void> {
    console.log('💰 Creating subscription plans...')

    const plans = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started',
        price: 0,
        interval: 'MONTH' as const,
        features: ['Up to 3 projects', 'Basic analytics', 'Email support'],
        stripePriceId: null,
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'For growing businesses',
        price: 1900, // $19.00
        interval: 'MONTH' as const,
        features: [
          'Unlimited projects',
          'Advanced analytics',
          'Priority email support',
          'API access',
        ],
        stripePriceId: 'price_pro_monthly', // Would be real Stripe price ID
      },
      {
        id: 'team',
        name: 'Team',
        description: 'For larger organizations',
        price: 4900, // $49.00
        interval: 'MONTH' as const,
        features: [
          'Everything in Pro',
          'Team collaboration',
          'Custom integrations',
          'Phone support',
          'SLA guarantee',
        ],
        stripePriceId: 'price_team_monthly', // Would be real Stripe price ID
      },
    ]

    for (const plan of plans) {
      await prisma.plan?.upsert({
        where: { id: plan.id },
        update: plan,
        create: plan,
      })
    }

    console.log(`✅ Created ${plans.length} subscription plans`)
  }

  private async seedOrganizations(): Promise<any[]> {
    console.log(
      `🏢 Creating ${this.options.organizationCount} organizations...`
    )

    const organizations = []

    for (let i = 0; i < this.options.organizationCount!; i++) {
      const organization = await prisma.organization?.create({
        data: {
          name: faker.company.name(),
          slug: faker.lorem.slug(),
          description: faker.company.catchPhrase(),
          website: faker.internet.url(),
          logo: faker.image.avatar(),
          settings: {
            theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
            notifications: {
              email: faker.datatype.boolean(),
              push: faker.datatype.boolean(),
            },
          },
        },
      })

      organizations.push(organization)
    }

    console.log(`✅ Created ${organizations.length} organizations`)
    return organizations
  }

  private async seedUsers(organizations: any[]): Promise<void> {
    console.log(`👥 Creating ${this.options.userCount} users...`)

    const hashedPassword = await bcrypt.hash('password123', 12)

    // Create admin user
    const adminUser = await prisma.user?.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        emailVerified: new Date(),
        image: faker.image.avatar(),
        password: hashedPassword,
      },
    })

    // Create admin membership in first organization
    if (organizations.length > 0) {
      await prisma.membership?.create({
        data: {
          userId: adminUser.id,
          organizationId: organizations[0].id,
          role: 'OWNER',
        },
      })
    }

    // Create regular users
    const users = []
    for (let i = 0; i < this.options.userCount! - 1; i++) {
      const user = await prisma.user?.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          emailVerified: faker.datatype.boolean() ? new Date() : null,
          image: faker.image.avatar(),
          password: hashedPassword,
        },
      })

      // Assign to random organization
      if (organizations.length > 0) {
        const randomOrg = faker.helpers.arrayElement(organizations)
        const role = faker.helpers.arrayElement(['ADMIN', 'MEMBER', 'MEMBER']) // Bias towards MEMBER

        await prisma.membership?.create({
          data: {
            userId: user.id,
            organizationId: randomOrg.id,
            role: role as any,
          },
        })
      }

      users.push(user)
    }

    console.log(`✅ Created ${users.length + 1} users (including admin)`)
    console.log('📧 Admin login: admin@example.com / password123')
  }

  async createTestUser(
    email: string,
    name: string,
    organizationName: string
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Create or find organization
    const organization = await prisma.organization?.upsert({
      where: { slug: organizationName.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: organizationName,
        slug: organizationName.toLowerCase().replace(/\s+/g, '-'),
        description: `${organizationName} organization`,
      },
    })

    // Create user
    const user = await prisma.user?.create({
      data: {
        name,
        email,
        emailVerified: new Date(),
        image: faker.image.avatar(),
        password: hashedPassword,
      },
    })

    // Create membership
    await prisma.membership?.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: 'OWNER',
      },
    })

    console.log(`✅ Created test user: ${email} / password123`)
    return user
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)

  const options: SeedOptions = {
    environment:
      (process.env.NODE_ENV as 'development' | 'test') || 'development',
    reset: args.includes('--reset'),
    userCount: parseInt(
      args.find(arg => arg.startsWith('--users='))?.split('=')[1] || '10'
    ),
    organizationCount: parseInt(
      args.find(arg => arg.startsWith('--orgs='))?.split('=')[1] || '3'
    ),
  }

  const seeder = new DatabaseSeeder(options)

  try {
    await seeder.seed()
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { DatabaseSeeder }
export type { SeedOptions }
