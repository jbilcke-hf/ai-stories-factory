/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  experimental: {
    serverActions: {
      bodySizeLimit: '16mb'
    }
  }
}

module.exports = nextConfig
