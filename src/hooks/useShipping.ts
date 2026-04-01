"use client";

import { useState, useEffect, useCallback } from "react";
import type { DbBarrio, DbShippingNacional } from "@/lib/db";

export function useShipping() {
  const [barrios, setBarrios] = useState<DbBarrio[]>([]);
  const [nacional, setNacional] = useState<DbShippingNacional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/shipping");
      const data = await res.json();
      setBarrios(data.barrios || []);
      setNacional(data.nacional || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBarrio = useCallback(async (nombre: string, precio: number) => {
    const res = await fetch("/api/admin/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setBarrios((prev) => {
      const exists = prev.findIndex((b) => b.id === data.barrio.id);
      if (exists >= 0) {
        return prev.map((b) => (b.id === data.barrio.id ? data.barrio : b));
      }
      return [...prev, data.barrio].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    });
    return data.barrio;
  }, []);

  const updateBarrio = useCallback(async (id: number, updates: { nombre?: string; precio?: number; activo?: boolean }) => {
    const res = await fetch("/api/admin/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "barrio", id, ...updates }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setBarrios((prev) => prev.map((b) => (b.id === id ? data.barrio : b)));
    return data.barrio;
  }, []);

  const removeBarrio = useCallback(async (id: number) => {
    const res = await fetch(`/api/admin/shipping?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setBarrios((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const updateNacional = useCallback(async (id: number, updates: Partial<DbShippingNacional>) => {
    const res = await fetch("/api/admin/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "nacional", id, ...updates }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setNacional((prev) => prev.map((f) => (f.id === id ? data.fila : f)));
    return data.fila;
  }, []);

  return {
    barrios,
    nacional,
    loading,
    error,
    refresh,
    addBarrio,
    updateBarrio,
    removeBarrio,
    updateNacional,
  };
}
