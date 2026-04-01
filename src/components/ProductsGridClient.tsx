"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import type { BrandSlug } from "@/types";

interface ProductsGridClientProps {
  brand: BrandSlug;
  initialProducts: Product[];
}

export default function ProductsGridClient({
  brand,
  initialProducts,
}: ProductsGridClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const filtered = data.products.filter((p: Product) => p.brand === brand);
          setProducts(filtered.length > 0 ? filtered : initialProducts);
        }
      })
      .catch(() => {});
  }, [brand, initialProducts]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
