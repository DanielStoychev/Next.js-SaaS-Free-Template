#!/bin/bash

# Post-install script for Next.js SaaS Template
# This script runs after npm/pnpm install

set -e

echo "🚀 Running post-install setup..."

# Check if we're in development
if [ "$NODE_ENV" = "production" ]; then
  echo "📦 Production environment detected"

  # Generate Prisma client for production
  if command -v prisma >/dev/null 2>&1; then
    echo "🔧 Generating Prisma client..."
    npx prisma generate
  fi

  echo "✅ Production post-install complete"
  exit 0
fi

echo "🛠️  Development environment setup"

# Generate Prisma client
if command -v prisma >/dev/null 2>&1; then
  echo "🔧 Generating Prisma client..."
  npx prisma generate
else
  echo "⚠️  Prisma not found, skipping client generation"
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual values"
  else
    echo "⚠️  .env.example not found, please create .env.local manually"
  fi
fi

# Setup git hooks if in a git repository
if [ -d .git ]; then
  echo "🪝 Setting up git hooks..."
  if command -v husky >/dev/null 2>&1; then
    npx husky install
    echo "✅ Git hooks installed"
  else
    echo "⚠️  Husky not found, skipping git hooks setup"
  fi
fi

# Check Node.js version
if command -v node >/dev/null 2>&1; then
  NODE_VERSION=$(node --version | sed 's/v//')
  REQUIRED_VERSION="20.0.0"

  if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "⚠️  Warning: Node.js version $NODE_VERSION detected, but $REQUIRED_VERSION or higher is recommended"
  else
    echo "✅ Node.js version $NODE_VERSION is compatible"
  fi
fi

echo "🎉 Post-install setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your environment variables"
echo "2. Set up your database connection"
echo "3. Run 'make db-migrate' to set up the database"
echo "4. Run 'make dev' to start the development server"
echo ""
echo "For more information, see the README.md file."
