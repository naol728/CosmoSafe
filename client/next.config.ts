import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://cdn1.iconfinder.com/data/icons/google-s-logo/150/**"),
    ],
  },
};

export default nextConfig;
