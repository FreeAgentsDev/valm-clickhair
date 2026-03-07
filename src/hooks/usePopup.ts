"use client";

import { useState, useEffect, useCallback } from "react";
import type { PopupConfig } from "@/types";
import { storageService } from "@/lib/storage";

const DEFAULT: PopupConfig = {
  enabled: false,
  title: "¡Bienvenido!",
  content: "Descubre nuestras ofertas en belleza y cuidado capilar.",
  ctaText: "Ver productos",
  ctaUrl: "/",
};

export function usePopup() {
  const [config, setConfig] = useState<PopupConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    try {
      setConfig(storageService.getPopup(DEFAULT));
    } catch (err) {
      console.error("Error cargando popup:", err);
      setConfig(DEFAULT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("storage-update", handler);
    return () => window.removeEventListener("storage-update", handler);
  }, [refresh]);

  const updatePopup = useCallback((next: PopupConfig) => {
    setConfig(next);
    storageService.savePopup(next);
  }, []);

  return { config, loading, updatePopup, refresh };
}
