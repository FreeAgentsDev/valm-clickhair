"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import { ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/types";

const FEEDBACK_DURATION_MS = 2000;

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const brand = BRANDS[product.brand];

  const handleClick = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), FEEDBACK_DURATION_MS);
  };

  return (
    <button
      onClick={handleClick}
      disabled={justAdded}
      className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-medium text-white transition-all duration-300 hover:opacity-90 disabled:pointer-events-none"
      style={{ backgroundColor: brand.primaryColor }}
    >
      {justAdded ? (
        <>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 animate-scale-in">
            <Check size={16} strokeWidth={3} />
          </span>
          <span className="animate-fade-in">¡Añadido!</span>
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          Agregar al carrito
        </>
      )}
    </button>
  );
}
