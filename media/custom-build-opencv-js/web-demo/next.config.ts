import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['mymac-80.seungyeop-lee.com'],
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // 기존 fallback 설정을 유지
      fs: false,
      path: false,
      crypto: false
    }

    return config
  }
}

export default nextConfig
