"use client";

import { useState, useEffect, useCallback } from "react";
import type { BrandContent, BrandSlug } from "@/types";
import { BRANDS } from "@/lib/brands";
import { storageService } from "@/lib/storage";

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

  const refreshData = useCallback(() => {
    setLoading(true);
    try {
      const stored = storageService.getBrandContent(getInitialContent());
      setContent(stored);
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

  useEffect(() => {
    const handler = () => refreshData();
    window.addEventListener("storage-update", handler);
    return () => window.removeEventListener("storage-update", handler);
  }, [refreshData]);

  const updateBrandContent = useCallback((updated: BrandContent) => {
    setContent((prev) => {
      const next = prev.some((c) => c.brand === updated.brand)
        ? prev.map((c) => (c.brand === updated.brand ? updated : c))
        : [...prev, updated];
      storageService.saveBrandContent(next);
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
