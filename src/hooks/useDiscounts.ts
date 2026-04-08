"use client";

import { useState, useEffect, useCallback } from "react";
import type { DbCategoryDiscount, DbCategory } from "@/lib/db";

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<DbCategoryDiscount[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/discounts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cargar");
      setDiscounts(data.discounts || []);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar descuentos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upsertDiscount = useCallback(
    async (categoria: string, descuento: number) => {
      setError(null);
      try {
        const res = await fetch("/api/admin/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoria, descuento }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al guardar");
        // Refresh full list to stay in sync
        await refresh();
        return data.discount;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar";
        setError(msg);
        throw err;
      }
    },
    [refresh]
  );

  const toggleDiscount = useCallback(
    async (id: number, activo: boolean) => {
      setError(null);
      try {
        const res = await fetch("/api/admin/discounts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, activo }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al actualizar");
        setDiscounts((prev) =>
          prev.map((d) => (d.id === id ? { ...d, activo } : d))
        );
        return data.discount;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al actualizar";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const removeDiscount = useCallback(
    async (id: number) => {
      setError(null);
      try {
        const res = await fetch(`/api/admin/discounts?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al eliminar");
        setDiscounts((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar";
        setError(msg);
        throw err;
      }
    },
    []
  );

  return {
    discounts,
    categories,
    loading,
    error,
    refresh,
    upsertDiscount,
    toggleDiscount,
    removeDiscount,
  };
}
