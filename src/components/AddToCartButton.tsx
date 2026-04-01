"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all ${
        added
          ? "bg-emerald-500 text-white scale-[1.02]"
          : "bg-[#E93B3C] text-white hover:shadow-lg hover:shadow-[#E93B3C]/25 hover:scale-[1.02]"
      }`}
    >
      {added ? (
        <>
          <Check size={18} /> Agregado al carrito
        </>
      ) : (
        <>
          <ShoppingCart size={18} /> Agregar al carrito
        </>
      )}
    </button>
  );
}
