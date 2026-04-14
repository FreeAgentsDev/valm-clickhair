import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Valm Beauty",
    short_name: "Valm",
    description:
      "Tienda virtual de belleza en Manizales. Skincare, perfumes capilares, exfoliantes y cuidado corporal con envíos a todo Colombia.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#E93B3C",
    lang: "es-CO",
    orientation: "portrait",
    categories: ["shopping", "lifestyle", "beauty"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
