import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // Disable TypeScript and ESLint checks during build (we use Biome)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
