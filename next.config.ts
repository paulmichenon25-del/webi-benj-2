import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Page replay autonome (public/replay.html) servie sur /replay.
  async rewrites() {
    return [{ source: "/replay", destination: "/replay.html" }];
  },
};

export default nextConfig;
