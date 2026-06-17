/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/watchmatch',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/watchmatch',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
}

module.exports = nextConfig
