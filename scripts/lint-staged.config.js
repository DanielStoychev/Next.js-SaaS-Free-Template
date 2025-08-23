module.exports = {
  // TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': ['eslint --fix --max-warnings 0', 'prettier --write'],

  // JSON files
  '*.json': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write'],

  // CSS files
  '*.{css,scss,sass}': ['prettier --write'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write'],

  // Prisma schema
  '*.prisma': ['prisma format'],

  // Package.json
  'package.json': ['prettier --write'],
}
