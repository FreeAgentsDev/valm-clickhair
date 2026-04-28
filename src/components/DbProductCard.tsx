"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import type { DbProduct } from "@/lib/db";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";

interface DbProductCardProps {
  product: DbProduct;
  /** Índice en la grilla. Se usa para escalonar la animación de aparición. */
  index?: number;
}

// Delay máximo de 0.6s para no tener cascadas eternas en grids grandes
const MAX_STAGGER_INDEX = 15;
const STAGGER_STEP = 0.04;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

/** Convierte DbProduct (DB) a Product (Cart) */
function toCartProduct(p: DbProduct): Product {
  const discountedPrice = p.descuento > 0
    ? p.precio * (1 - p.descuento / 100)
    : p.precio;
  return {
    id: String(p.id),
    brand: "valm-beauty",
    name: p.nombre,
    description: p.descripcion || "",
    price: discountedPrice,
    image: p.images[0] || "/logos/logo.png",
    images: p.images,
    category: p.categoria,
    stock: 99,
  };
}

export default function DbProductCard({ product, index }: DbProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const staggerDelay = index !== undefined
    ? `${Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP}s`
    : undefined;

  const imageUrl = product.images[0] || "/logos/valmlogo.png";
  const hasDiscount = product.descuento > 0;
  const discountedPrice = hasDiscount
    ? product.precio * (1 - product.descuento / 100)
    : product.precio;
  const isOutOfStock = product.agotado;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(toCartProduct(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/catalogo/${product.id}`} className="group block">
      <article
        className={`relative flex flex-col overflow-hidden rounded-2xl bg-white border-2 transition-all duration-300 h-full ${
          index !== undefined ? "animate-slide-up" : ""
        } ${
          isOutOfStock
            ? "border-[#F6BCCB]/40"
            : "border-[#F6BCCB]/30 hover:shadow-xl hover:shadow-[#F6BCCB]/15 hover:-translate-y-1 hover:border-[#E93B3C]/30"
        }`}
        style={staggerDelay ? { animationDelay: staggerDelay } : undefined}
      >
        <div className="aspect-square relative overflow-hidden bg-[#FDF2F4]">
          <Image
            src={imageUrl}
            alt={product.nombre}
            fill
            className={`object-cover transition-transform duration-500 ${
              isOutOfStock ? "grayscale opacity-60" : "group-hover:scale-110"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hasDiscount && !isOutOfStock && (
            <span className="absolute top-3 right-3 rounded-full bg-[#E93B3C] px-2.5 py-1 text-xs font-bold text-white shadow-md">
              -{product.descuento}%
            </span>
          )}
          <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
            {product.categoria}
          </span>

          {/* Cinta AGOTADO */}
          {isOutOfStock && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
              <div className="w-full bg-[#E93B3C] py-2 shadow-lg border-y-2 border-white/40 rotate-[-6deg]">
                <p className="text-center text-white text-base sm:text-lg font-extrabold tracking-[0.25em] uppercase drop-shadow">
                  Agotado
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className={`font-bold text-sm sm:text-base line-clamp-2 mb-1 tracking-tight ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}>
            {product.nombre}
          </h3>
          {product.descripcion && (
            <p className="text-xs text-gray-400 line-clamp-2 mb-3">
              {product.descripcion}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <p className={`text-lg sm:text-xl font-extrabold ${isOutOfStock ? "text-gray-400 line-through" : "text-[#E93B3C]"}`}>
                {formatPrice(discountedPrice)}
              </p>
              {hasDiscount && !isOutOfStock && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(product.precio)}
                </p>
              )}
            </div>
            {isOutOfStock ? (
              <span
                className="shrink-0 inline-flex items-center rounded-xl border border-[#F6BCCB] bg-[#FDF2F4] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#E93B3C]"
                aria-label="Producto agotado"
              >
                Agotado
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`shrink-0 flex items-center justify-center rounded-xl p-2.5 transition-all duration-300 ${
                  added
                    ? "bg-emerald-500 text-white scale-110"
                    : "bg-[#E93B3C] text-white hover:bg-[#c9282a] active:scale-95"
                }`}
                aria-label="Agregar al carrito"
              >
                {added ? <Check size={18} /> : <ShoppingCart size={18} />}
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
