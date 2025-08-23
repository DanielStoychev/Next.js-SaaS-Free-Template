#!/usr/bin/env tsx

/**
 * Database migration script
 * Handles database schema migrations in different environments
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

interface MigrationOptions {
  environment: 'development' | 'production' | 'test'
  force?: boolean
  preview?: boolean
}

class DatabaseMigrator {
  private options: MigrationOptions

  constructor(options: MigrationOptions) {
    this.options = options
  }

  async migrate(): Promise<void> {
    console.log(
      `🔄 Running database migrations for ${this.options.environment} environment...`
    )

    try {
      // Check if Prisma schema exists
      if (!existsSync('prisma/schema.prisma')) {
        throw new Error('Prisma schema not found at prisma/schema.prisma')
      }

      // Generate Prisma client first
      console.log('📦 Generating Prisma client...')
      execSync('npx prisma generate', { stdio: 'inherit' })

      if (this.options.preview) {
        // Preview mode - show what would be migrated
        console.log('👀 Preview mode - showing migration preview:')
        execSync('npx prisma migrate diff --preview-feature', {
          stdio: 'inherit',
        })
        return
      }

      if (this.options.environment === 'production') {
        // Production migration - deploy only
        console.log('🚀 Deploying migrations to production database...')
        execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      } else {
        // Development migration
        if (this.options.force) {
          console.log('⚠️  Force resetting database...')
          execSync('npx prisma migrate reset --force', { stdio: 'inherit' })
        } else {
          console.log('🛠️  Running development migration...')
          execSync('npx prisma migrate dev', { stdio: 'inherit' })
        }
      }

      console.log('✅ Database migration completed successfully!')
    } catch (error) {
      console.error(
        '❌ Migration failed:',
        error instanceof Error ? error.message : String(error)
      )
      process.exit(1)
    }
  }

  async validateConnection(): Promise<void> {
    try {
      console.log('🔍 Validating database connection...')
      execSync('npx prisma db pull --print', { stdio: 'pipe' })
      console.log('✅ Database connection validated')
    } catch (error) {
      console.error(
        '❌ Database connection failed:',
        error instanceof Error ? error.message : String(error)
      )
      throw error
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)

  const options: MigrationOptions = {
    environment: (process.env.NODE_ENV as any) || 'development',
    force: args.includes('--force'),
    preview: args.includes('--preview'),
  }

  // Override environment if specified
  if (args.includes('--production')) {
    options.environment = 'production'
  } else if (args.includes('--test')) {
    options.environment = 'test'
  }

  const migrator = new DatabaseMigrator(options)

  try {
    // Validate connection first
    await migrator.validateConnection()

    // Run migration
    await migrator.migrate()
  } catch (error) {
    console.error(
      '💥 Migration process failed:',
      error instanceof Error ? error.message : String(error)
    )
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { DatabaseMigrator }
export type { MigrationOptions }
