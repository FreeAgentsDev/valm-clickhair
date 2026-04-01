import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "pub-c7abec3e87d54bfd9b24859ff08c5d50.r2.dev", pathname: "/**" },
    ],
  },
};

export default nextConfig;
