"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, X } from "lucide-react";

export default function CartToast() {
  const { lastAdded, clearLastAdded } = useCart();

  if (!lastAdded) return null;

  const { product, quantity } = lastAdded;
  const label =
    quantity === 1
      ? product.name
      : `${quantity} × ${product.name}`;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-md sm:left-auto sm:right-6 sm:bottom-6"
    >
      <div className="animate-toast-in flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl ring-2 ring-gray-900/5">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={product.image}
            alt=""
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            ¡Añadido al carrito!
          </p>
          <p className="truncate text-sm text-gray-600">{label}</p>
          <Link
            href="/cart"
            onClick={clearLastAdded}
            className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-[#D62839] hover:underline"
          >
            <ShoppingCart size={16} />
            Ver carrito
          </Link>
        </div>
        <button
          type="button"
          onClick={clearLastAdded}
          className="shrink-0 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
