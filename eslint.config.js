/** @type {import('eslint').Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: { attributes: false },
      },
    ],

    // React/Next.js specific rules
    'react/jsx-key': 'warn',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',

    // General JavaScript rules
    'prefer-const': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off', // Use TypeScript version instead

    // Import rules
    'import/no-anonymous-default-export': 'off',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent'],
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  // Override rules for specific file patterns
  overrides: [
    // Config files
    {
      files: ['*.config.{js,ts}', '*.config.*.{js,ts}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    // Page files (Next.js App Router)
    {
      files: ['app/**/{page,layout,loading,error,not-found}.{ts,tsx}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    // API routes
    {
      files: ['app/api/**/*.{ts,tsx}', 'pages/api/**/*.{ts,tsx}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    // Test files
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
    // Scripts
    {
      files: ['scripts/**/*.{js,ts}'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}

module.exports = config
