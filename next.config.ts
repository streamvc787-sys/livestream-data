import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "prod-livestream-thumbnails-841162682567.s3.us-east-1.amazonaws.com",
      "ipfs.io",
    ],
  },
};

export default nextConfig;
