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
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        borderColor: `${brand.primaryColor}30`,
      }}
    >
      <Link href={`/${product.brand}/producto/${product.id}`} className="flex-1">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span
            className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-white shadow-md"
            style={{ backgroundColor: brand.primaryColor }}
          >
            {brand.name}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
          <p
            className="mt-auto text-lg font-bold"
            style={{ color: brand.primaryColor }}
          >
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
        className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-xl py-3 font-medium text-white transition-all duration-300 hover:opacity-90 shadow-md disabled:pointer-events-none"
        style={{ backgroundColor: brand.primaryColor }}
      >
        {justAdded ? (
          <>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 animate-scale-in">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>¡Añadido!</span>
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Agregar al carrito
          </>
        )}
      </button>
    </article>
  );
}
