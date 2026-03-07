"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types";
import { PRODUCTS } from "@/lib/products";
import { storageService } from "@/lib/storage";

export function useAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const storedProducts = storageService.getProducts(PRODUCTS);
      setProducts(storedProducts);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err instanceof Error ? err.message : "Error al cargar");
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProduct = useCallback((newProduct: Product) => {
    setProducts((prev) => {
      const updated = [...prev, newProduct];
      storageService.saveProducts(updated);
      return updated;
    });
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prev) => {
      const newProducts = prev.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      storageService.saveProducts(newProducts);
      return newProducts;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      storageService.saveProducts(updated);
      return updated;
    });
  }, []);

  return {
    products,
    loading,
    error,
    refreshData,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
