/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.redd.it', 'preview.redd.it', 'external-preview.redd.it'],
  },
}

module.exports = nextConfig

