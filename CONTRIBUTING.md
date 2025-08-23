# Contributing to Next.js SaaS Free Template

Thank you for your interest in contributing to this project! 🎉

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Next.js-SaaS-Free-Template.git
   ```
3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Initialize the database:**
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

## Code Style

- We use **ESLint** and **Prettier** for code formatting
- Run `pnpm lint` to check for linting issues
- Run `pnpm type-check` to verify TypeScript types
- Follow the existing code style and conventions

## Commit Guidelines

Please use clear and descriptive commit messages:

- ✨ `feat: add new authentication provider`
- 🐛 `fix: resolve dashboard loading issue`
- 📚 `docs: update installation guide`
- 🎨 `style: improve color theme system`
- ♻️ `refactor: optimize database queries`
- 🧪 `test: add unit tests for auth`

## Pull Request Process

1. **Update documentation** if needed
2. **Add or update tests** for new features
3. **Ensure all tests pass** and code is properly formatted
4. **Update the README.md** with details of changes if applicable
5. **Submit your pull request** with a clear description

## Areas for Contribution

We welcome contributions in these areas:

### 🎨 UI/UX Improvements
- New color themes
- Component enhancements
- Mobile responsiveness
- Accessibility improvements

### 🔧 Features
- Additional authentication providers
- New dashboard widgets
- Integration with other services
- Performance optimizations

### 📚 Documentation
- Tutorial improvements
- Code examples
- API documentation
- Deployment guides

### 🧪 Testing
- Unit tests
- Integration tests
- End-to-end tests
- Performance tests

## Questions or Issues?

- **Bug reports**: Open an issue with detailed reproduction steps
- **Feature requests**: Open an issue describing the feature and its use case
- **Questions**: Start a discussion in the GitHub Discussions tab

## Code of Conduct

Please be respectful and constructive in all interactions. We want to maintain a welcoming environment for all contributors.

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make this template better! 🚀
