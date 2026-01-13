/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000',
  },
  // Output as standalone for better production deployment
  output: 'standalone',

  // Allow cross-origin requests from the server IP (dev mode)
  allowedDevOrigins: [
    'http://139.59.75.176:3000',
    'http://localhost:3000',
  ],

  // Configure async headers for CORS support
  async headers() {
    return [
      {
        // Apply these headers to all routes including _next
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      {
        // Specifically handle _next static files
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '139.59.75.176',
        port: '8000',
        pathname: '/**',
      },
    ],
  },

  // Additional production settings
  reactStrictMode: true,
  poweredByHeader: false,

  // Compress assets
  compress: true,

  // Optimize for production
  swcMinify: true,
}

module.exports = nextConfig
