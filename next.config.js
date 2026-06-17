/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/watchmatch',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
}

module.exports = nextConfig
