import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Removed 'output: export' to enable server-side features (NextAuth, API routes)
  // For static export, remove API routes and 'use server' code before exporting
  images: { unoptimized: true },
};

export default nextConfig;
