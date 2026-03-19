import { fileURLToPath } from 'url'
import path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'http://192.168.120.175:3000',
    'http://192.168.120.175:3001',
    '192.168.120.175',
  ],
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
