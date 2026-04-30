"use client";

import { useState, useEffect, useCallback } from "react";
import type { SiteConfig } from "@/lib/admin-storage";

const DEFAULT: SiteConfig = {
  freeShippingEnabled: true,
  freeShippingThreshold: 200_000,
};

export function useConfig() {
  const [config, setConfigState] = useState<SiteConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error cargando config");
      if (data.config) setConfigState(data.config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando config");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateConfig = useCallback(async (next: SiteConfig) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error guardando config");
      if (data.config) setConfigState(data.config);
      return data.config as SiteConfig;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error guardando config";
      setError(msg);
      throw err;
    }
  }, []);

  return { config, loading, error, refresh, updateConfig };
}
