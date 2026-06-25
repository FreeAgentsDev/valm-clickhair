import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Servidor mínimo: empaqueta solo lo necesario para producción.
  // Reduce el RSS del proceso (~682MB -> ~250MB) y por ende el costo en Railway.
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "pub-c7abec3e87d54bfd9b24859ff08c5d50.r2.dev", pathname: "/**" },
    ],
  },
};

export default nextConfig;
