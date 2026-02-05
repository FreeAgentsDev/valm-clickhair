"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import WhatsAppCartButton from "./WhatsAppCartButton";

export default function CartSummary() {
  const { items, updateQuantity, removeItem, total } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-gray-600 mb-6">Tu carrito está vacío</p>
        <Link
          href="/"
          className="rounded-xl px-6 py-3 font-medium text-white transition-colors"
          style={{ backgroundColor: "#D62839" }}
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  const primaryBrand =
    items.length > 0 ? BRANDS[items[0].product.brand] : BRANDS["valm-beauty"];

  return (
    <div className="space-y-6">
      {items.map(({ product, quantity }) => {
        const brand = BRANDS[product.brand];
        return (
          <div
            key={product.id}
            className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm" style={{ color: brand.primaryColor }}>
                  {brand.name}
                </p>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-2 hover:bg-gray-100 rounded-l-lg"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-2 hover:bg-gray-100 rounded-r-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="font-bold" style={{ color: brand.primaryColor }}>
                  {formatPrice(product.price * quantity)}
                </p>
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span style={{ color: primaryBrand.primaryColor }}>
            {formatPrice(total)}
          </span>
        </div>
        <WhatsAppCartButton />
        <Link
          href="/checkout"
          className="flex w-full items-center justify-center rounded-xl py-3 font-medium text-white transition-colors"
          style={{ backgroundColor: primaryBrand.primaryColor }}
        >
          Ir a pagar (Wompi / ADDI)
        </Link>
      </div>
    </div>
  );
}
