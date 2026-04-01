"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";
import { BRANDS } from "@/lib/brands";

const FEEDBACK_DURATION_MS = 2000;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const brand = BRANDS[product.brand];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border-2 border-brand-pink/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-pink/15 hover:-translate-y-1 hover:border-brand-red/30">
      <Link href={`/${product.brand}/producto/${product.id}`} className="flex-1">
        <div className="aspect-square relative overflow-hidden bg-brand-rose">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
          <span className="absolute top-3 left-3 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold text-white shadow-md">
            {brand.name}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 tracking-tight">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-3">
            {product.description}
          </p>
          <p className="mt-auto text-lg sm:text-xl font-extrabold text-brand-red">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          addItem(product);
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), FEEDBACK_DURATION_MS);
        }}
        disabled={justAdded}
        className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm text-white transition-all duration-300 hover:opacity-90 disabled:pointer-events-none bg-brand-red hover:shadow-lg hover:shadow-brand-red/25"
      >
        {justAdded ? (
          <>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 animate-scale-in">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>Agregado</span>
          </>
        ) : (
          <>
            <ShoppingCart size={16} />
            Agregar
          </>
        )}
      </button>
    </article>
  );
}
