import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin Turbopack root so it doesn't scan parent folders (e.g. ~/Repositorios).
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    // Known Turbopack dev leak in 16.2.x — disables server-side HMR loop.
    turbopackServerFastRefresh: false,
  },
};

export default nextConfig;
