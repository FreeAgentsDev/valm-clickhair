"use client";

import { useState, useEffect, useCallback } from "react";
import type { PopupConfig } from "@/types";

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

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/popup");
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      } else {
        setConfig(DEFAULT);
      }
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

  const updatePopup = useCallback((next: PopupConfig) => {
    setConfig(next);
    fetch("/api/admin/popup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: next }),
    }).catch((err) => console.error("Error guardando popup:", err));
  }, []);

  return { config, loading, updatePopup, refresh };
}
