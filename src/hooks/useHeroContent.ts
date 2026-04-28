"use client";

import { useState, useEffect, useCallback } from "react";
import type { HeroContent } from "@/lib/admin-storage";

export const DEFAULT_HERO: HeroContent = {
  title: "Tu destino de belleza",
  titleHighlight: "en Colombia",
  subtitle: "Skincare, cuidado capilar y corporal. Productos originales con envios a todo Colombia.",
  badge: "Belleza & Cuidado Profesional",
  ctaText: "Ver catalogo",
  ctaWhatsappText: "Escribenos",
  aboutTitle: "Belleza que se siente, se huele y se vive",
  aboutText: "Desde Manizales para toda Colombia. Productos 100% originales de Walaky, Girly, Ole y Fresa Morada con envios seguros y asesoria personalizada.",
  catalogTitle: "Explora el catalogo",
  catalogSubtitle: "Mas de 170 productos originales para tu belleza y cuidado personal.",
  categoriesTitle: "Encuentra lo que buscas",
  contactTitle: "Escríbenos por WhatsApp",
  contactAddress: "Calle 68 # 27-24 Casa Ágape · Barrio Palermo · Manizales",
  contactStoreHours: "Lunes a Sábado · 10:00am - 7:00pm",
  contactWhatsappNumber: "310 407 7106",
  contactWhatsappHours: "Todos los días · 8:00am - 8:00pm",
  contactCtaText: "Escríbenos ahora",
  contactWhatsappUrl: "https://wa.me/573104077106",
};

export function useHeroContent() {
  const [content, setContent] = useState<HeroContent>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      if (data.content) {
        setContent({ ...DEFAULT_HERO, ...data.content });
      }
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateContent = useCallback(async (next: HeroContent) => {
    setContent(next);
    try {
      await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: next }),
      });
    } catch (err) {
      console.error("Error guardando hero:", err);
    }
  }, []);

  return { content, loading, updateContent, refresh };
}
