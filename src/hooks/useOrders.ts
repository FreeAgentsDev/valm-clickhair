"use client";

import { useState, useEffect, useCallback } from "react";
import type { Order } from "@/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Error cargando órdenes");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar órdenes");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const updateStatus = useCallback(
    async (id: string, status: Order["status"]) => {
      try {
        const res = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        if (!res.ok) throw new Error("Error actualizando estado");

        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar");
      }
    },
    []
  );

  return { orders, loading, error, refreshOrders, updateStatus };
}
