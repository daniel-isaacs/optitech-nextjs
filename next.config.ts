import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.cms.optimizely.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Allow all Optimizely SaaS CMS instances to embed this app in the Visual Builder iframe.
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.cms.optimizely.com",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
