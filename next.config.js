/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable optimizePackageImports for better performance
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Note: serverActions and instrumentationHook are now enabled by default in Next.js 15
  },

  // Compiler options
  compiler: {
    // Enable styled-components if needed
    // styledComponents: true,
  },

  // Image optimization
  images: {
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Environment variables to expose to the client
  env: {
    // Add any environment variables that should be available on the client
  },

  // Redirects
  async redirects() {
    return [
      // Add any redirects here
    ]
  },

  // Rewrites
  async rewrites() {
    return [
      // Add any rewrites here
    ]
  },

  // Output configuration
  output: 'standalone',

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Note: telemetry is disabled by default in Next.js 15
}

module.exports = nextConfig
