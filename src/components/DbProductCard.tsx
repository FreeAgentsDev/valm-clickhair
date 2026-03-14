"use client";

import Image from "next/image";
import Link from "next/link";
import type { DbProduct } from "@/lib/db";

interface DbProductCardProps {
  product: DbProduct;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

export default function DbProductCard({ product }: DbProductCardProps) {
  const imageUrl = product.images[0] || "/logos/valmlogo.png";
  const hasDiscount = product.descuento > 0;
  const discountedPrice = hasDiscount
    ? product.precio * (1 - product.descuento / 100)
    : product.precio;

  return (
    <Link href={`/catalogo/${product.id}`} className="group block">
      <article className="relative flex flex-col overflow-hidden rounded-2xl bg-white border-2 border-[#F6BCCB]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#F6BCCB]/15 hover:-translate-y-1 hover:border-[#E93B3C]/30 h-full">
        <div className="aspect-square relative overflow-hidden bg-[#FDF2F4]">
          <Image
            src={imageUrl}
            alt={product.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hasDiscount && (
            <span className="absolute top-3 right-3 rounded-full bg-[#E93B3C] px-2.5 py-1 text-xs font-bold text-white shadow-md">
              -{product.descuento}%
            </span>
          )}
          <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
            {product.categoria}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 tracking-tight">
            {product.nombre}
          </h3>
          {product.descripcion && (
            <p className="text-xs text-gray-400 line-clamp-2 mb-3">
              {product.descripcion}
            </p>
          )}
          <div className="mt-auto flex items-baseline gap-2">
            <p className="text-lg sm:text-xl font-extrabold text-[#E93B3C]">
              {formatPrice(discountedPrice)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(product.precio)}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
