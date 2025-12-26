import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.PAGES_BASE_PATH,
  images: { unoptimized: true },
  output: 'standalone',
};

export default nextConfig;
