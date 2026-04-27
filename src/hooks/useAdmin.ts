"use client";

import { useState, useEffect, useCallback } from "react";
import type { DbProduct, DbCategory, DbBrand } from "@/lib/db";

export function useAdmin() {
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [brands, setBrands] = useState<DbBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setDbProducts(data.dbProducts || []);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProduct = useCallback(
    async (data: {
      nombre: string;
      precio: number;
      descuento: number;
      descripcion: string;
      categoria: string;
      imagen: string;
      peso_gramos?: number;
      images?: string[];
    }) => {
      setError(null);
      try {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Error creando producto");
        if (result.product) {
          setDbProducts((prev) => [result.product, ...prev]);
        }
        return result.product;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al crear";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (
      id: string,
      data: {
        nombre: string;
        precio: number;
        descuento: number;
        descripcion: string;
        categoria: string;
        imagen: string;
        peso_gramos?: number;
        images?: string[];
      }
    ) => {
      setError(null);
      try {
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...data }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Error actualizando");
        if (result.product) {
          setDbProducts((prev) =>
            prev.map((p) => (p.id === id ? result.product : p))
          );
        }
        return result.product;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al actualizar";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const removeProduct = useCallback(async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error eliminando");
      setDbProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al eliminar";
      setError(msg);
      throw err;
    }
  }, []);

  const addCategory = useCallback(async (nombre: string) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error creando categoría");
      const created = result.category as DbCategory;
      setCategories((prev) => {
        if (prev.some((c) => c.id === created.id)) return prev;
        return [...prev, created].sort((a, b) => a.nombre.localeCompare(b.nombre));
      });
      return created;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear categoría";
      setError(msg);
      throw err;
    }
  }, []);

  const removeCategory = useCallback(async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error eliminando categoría");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al eliminar categoría";
      setError(msg);
      throw err;
    }
  }, []);

  const addBrand = useCallback(async (nombre: string) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error creando marca");
      const created = result.brand as DbBrand;
      setBrands((prev) => {
        if (prev.some((b) => b.id === created.id)) return prev;
        return [...prev, created].sort((a, b) => a.nombre.localeCompare(b.nombre));
      });
      return created;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear marca";
      setError(msg);
      throw err;
    }
  }, []);

  const removeBrand = useCallback(async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error eliminando marca");
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al eliminar marca";
      setError(msg);
      throw err;
    }
  }, []);

  return {
    dbProducts,
    categories,
    brands,
    loading,
    error,
    refreshData,
    addProduct,
    updateProduct,
    removeProduct,
    addCategory,
    removeCategory,
    addBrand,
    removeBrand,
  };
}
