/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Render-specific optimizations
  output: 'standalone',
  poweredByHeader: false,
  swcMinify: true,
}

module.exports = nextConfig
