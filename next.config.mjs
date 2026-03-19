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
    'http://192.168.*',
    'http://10.*',
    'http://172.16.*',
  ],
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
