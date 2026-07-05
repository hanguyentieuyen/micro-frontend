import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@commerce/shared-types', '@commerce/shared-ui'],
};

export default nextConfig;
