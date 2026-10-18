import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pages replay autonomes (public/replay*.html) : /replay (soirée 1) et /replay/soiree-2.
  async rewrites() {
    return [
      { source: "/replay", destination: "/replay.html" },
      // Soirée 2 : réactiver avec public/replay-soiree-2.html quand son replay est prêt.
      // { source: "/replay/soiree-2", destination: "/replay-soiree-2.html" },
    ];
  },
};

export default nextConfig;
