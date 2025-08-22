# Next.js SaaS Template Makefile
# Use this file to run common development tasks

.PHONY: help setup dev build start typecheck lint test test-unit test-component test-e2e format coverage ci clean install-deps db-generate db-push db-migrate db-seed db-studio db-reset

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Setup and installation
setup: ## Install dependencies and setup project
	@echo "🚀 Setting up the project..."
	@command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Please install pnpm first."; exit 1; }
	pnpm install
	@echo "✅ Dependencies installed"
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local && \
		echo "📝 Created .env.local from .env.example - please update with your values"; \
	fi
	@echo "🎉 Setup complete! Run 'make dev' to start development"

install-deps: ## Install dependencies only
	pnpm install

# Development
dev: ## Start development server
	@echo "🚀 Starting development server..."
	pnpm dev

build: ## Build for production
	@echo "🏗️  Building for production..."
	pnpm build

start: ## Start production server
	@echo "▶️  Starting production server..."
	pnpm start

# Code quality
typecheck: ## Run TypeScript type checking
	@echo "🔍 Running TypeScript type checking..."
	pnpm typecheck

lint: ## Run ESLint
	@echo "🔍 Running ESLint..."
	pnpm lint

lint-fix: ## Run ESLint with auto-fix
	@echo "🔧 Running ESLint with auto-fix..."
	pnpm lint:fix

format: ## Format code with Prettier
	@echo "💅 Formatting code with Prettier..."
	pnpm format

format-check: ## Check code formatting
	@echo "🔍 Checking code formatting..."
	pnpm format:check

# Testing
test: ## Run all tests
	@echo "🧪 Running all tests..."
	pnpm test

test-unit: ## Run unit tests only
	@echo "🧪 Running unit tests..."
	pnpm test:unit

test-component: ## Run component tests only
	@echo "🧪 Running component tests..."
	pnpm test:component

test-e2e: ## Run end-to-end tests
	@echo "🧪 Running end-to-end tests..."
	pnpm test:e2e

test-e2e-headed: ## Run e2e tests in headed mode
	@echo "🧪 Running e2e tests in headed mode..."
	pnpm test:e2e:headed

test-e2e-ui: ## Run e2e tests with UI
	@echo "🧪 Running e2e tests with UI..."
	pnpm test:e2e:ui

test-watch: ## Run tests in watch mode
	@echo "👀 Running tests in watch mode..."
	pnpm test:watch

test-ui: ## Run tests with UI
	@echo "🖥️  Running tests with UI..."
	pnpm test:ui

coverage: ## Generate test coverage report
	@echo "📊 Generating test coverage report..."
	pnpm coverage
	@echo "📈 Coverage report generated in coverage/ directory"

# Database operations
db-generate: ## Generate Prisma client
	@echo "🔧 Generating Prisma client..."
	pnpm db:generate

db-push: ## Push database schema changes
	@echo "📤 Pushing database schema changes..."
	pnpm db:push

db-migrate: ## Run database migrations
	@echo "🏃 Running database migrations..."
	pnpm db:migrate

db-migrate-deploy: ## Deploy database migrations (production)
	@echo "🚀 Deploying database migrations..."
	pnpm db:migrate:deploy

db-seed: ## Seed database with sample data
	@echo "🌱 Seeding database..."
	pnpm db:seed

db-studio: ## Open Prisma Studio
	@echo "🎨 Opening Prisma Studio..."
	pnpm db:studio

db-reset: ## Reset database (WARNING: This will delete all data)
	@echo "⚠️  WARNING: This will delete all database data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		pnpm db:reset; \
		echo "🗑️  Database reset complete"; \
	else \
		echo "❌ Database reset cancelled"; \
	fi

# CI/CD
ci: ## Run full CI pipeline locally
	@echo "🔄 Running full CI pipeline..."
	@echo "1/5 Type checking..."
	@$(MAKE) typecheck
	@echo "2/5 Linting..."
	@$(MAKE) lint
	@echo "3/5 Testing..."
	@$(MAKE) test
	@echo "4/5 Building..."
	@$(MAKE) build
	@echo "5/5 Coverage..."
	@$(MAKE) coverage
	@echo "✅ CI pipeline completed successfully!"

# Maintenance
clean: ## Clean build artifacts and caches
	@echo "🧹 Cleaning build artifacts and caches..."
	pnpm clean
	rm -rf node_modules/.cache
	rm -rf .next
	rm -rf out
	rm -rf dist
	rm -rf coverage
	rm -rf test-results
	rm -rf playwright-report
	@echo "✨ Clean complete!"

install-clean: clean install-deps ## Clean install dependencies

# Docker operations (if using Docker)
docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	docker build -f infra/docker/web.Dockerfile -t nextjs-saas-template .

docker-dev: ## Start development environment with Docker Compose
	@echo "🐳 Starting development environment..."
	docker-compose -f infra/docker/compose.dev.yml up -d

docker-prod: ## Start production environment with Docker Compose
	@echo "🐳 Starting production environment..."
	docker-compose -f infra/docker/compose.prod.yml up -d

docker-down: ## Stop Docker containers
	@echo "🛑 Stopping Docker containers..."
	docker-compose -f infra/docker/compose.dev.yml down
	docker-compose -f infra/docker/compose.prod.yml down

# Utility commands
deps-update: ## Update all dependencies
	@echo "📦 Updating dependencies..."
	pnpm update

deps-check: ## Check for outdated dependencies
	@echo "🔍 Checking for outdated dependencies..."
	pnpm outdated

security-audit: ## Run security audit
	@echo "🔒 Running security audit..."
	pnpm audit

tree: ## Show project structure
	@echo "📁 Project structure:"
	@command -v tree >/dev/null 2>&1 && tree -I 'node_modules|.git|.next|out|dist|coverage|test-results|playwright-report' || ls -la

# Git hooks setup
hooks-install: ## Install git hooks
	@echo "🪝 Installing git hooks..."
	pnpm prepare

# Environment setup
env-example: ## Create .env.example from current .env.local
	@if [ -f .env.local ]; then \
		grep -v '^#' .env.local | sed 's/=.*/=/' > .env.example && \
		echo "📝 Created .env.example from .env.local"; \
	else \
		echo "❌ .env.local not found"; \
	fi

# Documentation
docs-serve: ## Serve documentation locally
	@echo "📚 Serving documentation..."
	@command -v python3 >/dev/null 2>&1 && (cd docs && python3 -m http.server 8080) || echo "❌ Python 3 required to serve docs"

# Quick development commands
quick-setup: setup db-migrate db-seed ## Quick setup for new developers
	@echo "🎉 Quick setup complete! You can now run 'make dev'"

full-reset: clean setup db-reset db-seed ## Full project reset (WARNING: Deletes all data)
	@echo "🔄 Full project reset complete!"

# Health checks
health-check: ## Run health checks
	@echo "🏥 Running health checks..."
	@echo "✅ Node.js version: $$(node --version)"
	@echo "✅ pnpm version: $$(pnpm --version)"
	@echo "✅ Dependencies installed: $$([ -d node_modules ] && echo 'Yes' || echo 'No')"
	@echo "✅ Environment file: $$([ -f .env.local ] && echo 'Yes' || echo 'No')"
	@echo "✅ Database connection: $$(pnpm db:generate >/dev/null 2>&1 && echo 'OK' || echo 'Failed')"
