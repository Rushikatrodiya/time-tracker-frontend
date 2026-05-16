import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "https://time-tracker-backend-q90p.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
