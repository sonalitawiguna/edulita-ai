/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable server components for better compatibility
    serverComponentsExternalPackages: ['ai', '@ai-sdk/google'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Expose environment variables to the client
  env: {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
  // Optimize bundle for better loading
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // Enable static optimization
  output: 'standalone',
  // Disable strict mode to prevent double rendering issues
  reactStrictMode: false,
}

export default nextConfig
