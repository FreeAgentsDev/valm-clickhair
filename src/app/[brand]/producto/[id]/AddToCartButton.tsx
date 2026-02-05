"use client";

import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const brand = BRANDS[product.brand];

  return (
    <button
      onClick={() => addItem(product)}
      className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-medium text-white transition-colors hover:opacity-90"
      style={{ backgroundColor: brand.primaryColor }}
    >
      <ShoppingCart size={20} />
      Agregar al carrito
    </button>
  );
}
