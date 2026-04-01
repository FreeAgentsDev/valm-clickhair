"use client";

import { useEffect } from "react";
import { PRODUCTS } from "@/lib/products";
import { BRANDS } from "@/lib/brands";
import type { BrandSlug } from "@/types";

/**
 * Inicializa los datos en el servidor si no existen.
 * Envía los datos por defecto al API solo si el servidor no tiene datos previos.
 */
export default function DataInitializer() {
  useEffect(() => {
    async function init() {
      try {
        const [productsRes, contentRes, popupRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/brand-content"),
          fetch("/api/admin/popup"),
        ]);

        const [productsData, contentData, popupData] = await Promise.all([
          productsRes.json(),
          contentRes.json(),
          popupRes.json(),
        ]);

        // Solo inicializar si el servidor no tiene datos
        if (!productsData.products) {
          fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: PRODUCTS }),
          }).catch(() => {});
        }

        if (!contentData.content) {
          const initial = (["valm-beauty", "click-hair"] as BrandSlug[]).map((slug) => ({
            brand: slug,
            description: BRANDS[slug].description,
            brandsCarried: BRANDS[slug].brandsCarried,
            categories: BRANDS[slug].categories,
            highlights: BRANDS[slug].highlights,
          }));
          fetch("/api/admin/brand-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: initial }),
          }).catch(() => {});
        }

        if (!popupData.config) {
          fetch("/api/admin/popup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              config: {
                enabled: false,
                title: "¡Bienvenido!",
                content: "Descubre nuestras ofertas en belleza y cuidado capilar.",
                ctaText: "Ver productos",
                ctaUrl: "/",
              },
            }),
          }).catch(() => {});
        }
      } catch {
        // Silenciar errores de inicialización
      }
    }

    init();
  }, []);

  return null;
}
