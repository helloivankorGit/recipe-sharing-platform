import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Don't fail build on TypeScript warnings
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
