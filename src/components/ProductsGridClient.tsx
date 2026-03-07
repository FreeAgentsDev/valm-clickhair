"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { storageService } from "@/lib/storage";
import { PRODUCTS } from "@/lib/products";
import type { Product } from "@/types";
import type { BrandSlug } from "@/types";

interface ProductsGridClientProps {
  brand: BrandSlug;
  initialProducts: Product[];
}

/**
 * Grid de productos que lee de localStorage (datos editados en admin)
 * o usa los productos iniciales como fallback.
 * Escucha storage-update para reflejar cambios en tiempo real.
 */
export default function ProductsGridClient({
  brand,
  initialProducts,
}: ProductsGridClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const loaded = storageService.getProducts(PRODUCTS).filter((p) => p.brand === brand);
    setProducts(loaded.length > 0 ? loaded : initialProducts);

    const handleStorageUpdate = () => {
      const updated = storageService.getProducts(PRODUCTS).filter((p) => p.brand === brand);
      setProducts(updated.length > 0 ? updated : initialProducts);
    };

    window.addEventListener("storage-update", handleStorageUpdate);
    return () => window.removeEventListener("storage-update", handleStorageUpdate);
  }, [brand, initialProducts]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
