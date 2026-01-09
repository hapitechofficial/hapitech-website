import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
  },
  // Enable static file serving
  staticPageGenerationTimeout: 300,
  poweredByHeader: false,
  // Optimize video serving
  headers: async () => {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
