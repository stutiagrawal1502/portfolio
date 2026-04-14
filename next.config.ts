import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images from Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // next-pwa adds a webpack config; declare empty turbopack config so
  // Turbopack dev mode doesn't error about the mismatch (pwa is disabled in dev)
  turbopack: {},
};

// next-pwa 5.x uses CommonJS exports; disable during dev to avoid noise
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
});

export default withPWA(nextConfig);
