/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/watchmatch',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/watchmatch',
  },
  // We don't use next/image (photos go through /api/img), so switch the
  // built-in optimizer off. Leaving it on with a wildcard host let anyone make
  // the server fetch and resize images from anywhere.
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
