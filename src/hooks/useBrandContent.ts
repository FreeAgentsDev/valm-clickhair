"use client";

import { useState, useEffect, useCallback } from "react";
import type { BrandContent, BrandSlug } from "@/types";
import { BRANDS } from "@/lib/brands";

function getInitialContent(): BrandContent[] {
  return (["valm-beauty", "click-hair"] as BrandSlug[]).map((slug) => ({
    brand: slug,
    description: BRANDS[slug].description,
    brandsCarried: BRANDS[slug].brandsCarried,
    categories: BRANDS[slug].categories,
    highlights: BRANDS[slug].highlights,
  }));
}

export function useBrandContent() {
  const [content, setContent] = useState<BrandContent[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brand-content");
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      } else {
        setContent(getInitialContent());
      }
    } catch (err) {
      console.error("Error cargando contenido de marca:", err);
      setContent(getInitialContent());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateBrandContent = useCallback((updated: BrandContent) => {
    setContent((prev) => {
      const next = prev.some((c) => c.brand === updated.brand)
        ? prev.map((c) => (c.brand === updated.brand ? updated : c))
        : [...prev, updated];

      fetch("/api/admin/brand-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: next }),
      }).catch((err) => console.error("Error guardando contenido:", err));

      return next;
    });
  }, []);

  const getContentForBrand = useCallback(
    (brand: BrandSlug): BrandContent => {
      const found = content.find((c) => c.brand === brand);
      if (found) return found;
      const base = BRANDS[brand];
      return {
        brand,
        description: base.description,
        brandsCarried: base.brandsCarried,
        categories: base.categories,
        highlights: base.highlights,
      };
    },
    [content]
  );

  return {
    content,
    loading,
    refreshData,
    updateBrandContent,
    getContentForBrand,
  };
}
