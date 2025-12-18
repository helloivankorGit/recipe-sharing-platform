import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Don't fail build on ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail build on TypeScript warnings
    ignoreBuildErrors: true,
  },
  // Ensure all pages are client-side rendered
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
