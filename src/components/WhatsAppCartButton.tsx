"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import { WHATSAPP_NUMBERS } from "@/types";

export default function WhatsAppCartButton() {
  const { items, total } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const buildWhatsAppMessage = () => {
    const lines = ["🛒 *Mi carrito*\n\n"];
    items.forEach(({ product, quantity }) => {
      const brand = BRANDS[product.brand];
      lines.push(`• ${product.name} (${brand.name})`);
      lines.push(`  Cantidad: ${quantity}`);
      lines.push(`  ${formatPrice(product.price * quantity)}\n`);
    });
    lines.push(`*Total: ${formatPrice(total)}*`);
    lines.push("\n📍 Cra 23A # 60-11 Tienda Virtual - Manizales");
    return encodeURIComponent(lines.join(""));
  };

  const handleSend = () => {
    if (!selectedNumber) return;
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/57${selectedNumber}?text=${msg}`;
    window.open(url, "_blank");
    setShowModal(false);
    setSelectedNumber(null);
  };

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-green-500 py-3 font-medium text-white hover:bg-green-600 transition-colors"
      >
        <MessageCircle size={20} />
        Enviar carrito por WhatsApp
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setShowModal(false);
            setSelectedNumber(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Enviar carrito por WhatsApp
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Elige la línea a la que deseas enviar tu pedido:
            </p>
            <div className="space-y-3">
              {WHATSAPP_NUMBERS.map(({ number, label }) => (
                <label
                  key={number}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                    selectedNumber === number
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="whatsapp"
                    value={number}
                    checked={selectedNumber === number}
                    onChange={() => setSelectedNumber(number)}
                    className="h-4 w-4 text-green-600"
                  />
                  <MessageCircle size={24} className="text-green-600" />
                  <span className="font-medium">📲 {label}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedNumber(null);
                }}
                className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={!selectedNumber}
                className="flex-1 rounded-xl bg-green-500 py-3 font-medium text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
