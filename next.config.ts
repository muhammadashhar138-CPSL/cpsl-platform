import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Netlify (no server-side rendering)
  output: 'export',
  // Optimize images for static hosting
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  // Disable static generation for dynamic routes
  staticPageGenerationTimeout: 60,
};

export default nextConfig;
