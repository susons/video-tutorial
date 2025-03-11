import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  dynamicIO: true,
  authInterrupts: true,
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
