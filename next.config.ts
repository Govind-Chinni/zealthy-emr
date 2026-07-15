import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs', 'jsonwebtoken'],
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

export default nextConfig