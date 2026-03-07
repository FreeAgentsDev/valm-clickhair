"use client";

import { useEffect } from "react";
import { storageService } from "@/lib/storage";
import { PRODUCTS } from "@/lib/products";
import { BRANDS } from "@/lib/brands";
import type { BrandSlug } from "@/types";

/**
 * Inicializa los datos en localStorage si no existen.
 * Asegura que la tienda siempre tenga datos para mostrar,
 * incluso antes de usar el panel admin.
 */
export default function DataInitializer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedProducts = localStorage.getItem("admin_products");
    if (!storedProducts) {
      storageService.saveProducts(PRODUCTS);
    }

    const storedContent = localStorage.getItem("admin_brand_content");
    if (!storedContent) {
      const initial = (["valm-beauty", "click-hair"] as BrandSlug[]).map((slug) => ({
        brand: slug,
        description: BRANDS[slug].description,
        brandsCarried: BRANDS[slug].brandsCarried,
        categories: BRANDS[slug].categories,
        highlights: BRANDS[slug].highlights,
      }));
      storageService.saveBrandContent(initial);
    }

    const storedPopup = localStorage.getItem("admin_popup");
    if (!storedPopup) {
      storageService.savePopup({
        enabled: false,
        title: "¡Bienvenido!",
        content: "Descubre nuestras ofertas en belleza y cuidado capilar.",
        ctaText: "Ver productos",
        ctaUrl: "/",
      });
    }
  }, []);

  return null;
}
