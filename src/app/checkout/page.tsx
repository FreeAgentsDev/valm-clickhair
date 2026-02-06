"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/lib/cart-context";
import { CreditCard, Wallet, Truck } from "lucide-react";
import type { ShippingAddress } from "@/types";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"wompi" | "addi">("wompi");
  const [shippingCost, setShippingCost] = useState(15000); // Default Manizales
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "Caldas",
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderTotal = total + shippingCost;
      const reference = `ORD-${Date.now()}`;

      if (paymentMethod === "wompi") {
        const res = await fetch("/api/wompi/create-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: orderTotal,
            reference,
            customerEmail: address.email,
            customerName: address.name,
            redirectUrl: `${window.location.origin}/checkout/success?ref=${reference}`,
          }),
        });
        const data = await res.json();
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }
        if (data.error) throw new Error(data.error);
      } else {
        const res = await fetch("/api/addi/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: orderTotal,
            orderId: reference,
            customerEmail: address.email,
            customerName: address.name,
            customerPhone: address.phone,
          }),
        });
        const data = await res.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
          return;
        }
        if (data.error) throw new Error(data.error);
      }

      // Si no hay redirect (modo demo), ir a success
      router.push(`/checkout/success?ref=${reference}`);
      clearCart();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-gray-600 mb-6">Tu carrito está vacío</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-pink-500 px-6 py-3 font-medium text-white"
          >
            Ver productos
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos de envío */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Truck size={20} />
              Datos de envío
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nombre completo *"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                required
                className="rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                type="email"
                placeholder="Email *"
                value={address.email}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                required
                className="rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                type="tel"
                placeholder="Teléfono *"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                required
                className="rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="rounded-xl border border-gray-200 px-4 py-3"
              />
              <input
                type="text"
                placeholder="Dirección *"
                value={address.address}
                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                required
                className="sm:col-span-2 rounded-xl border border-gray-200 px-4 py-3"
              />
              <select
                value={address.department}
                onChange={(e) => setAddress({ ...address, department: e.target.value })}
                className="rounded-xl border border-gray-200 px-4 py-3"
              >
                <option value="Caldas">Caldas</option>
                <option value="Antioquia">Antioquia</option>
                <option value="Bogotá">Bogotá D.C.</option>
                <option value="Valle">Valle del Cauca</option>
                <option value="Risaralda">Risaralda</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Envío estimado: {formatPrice(shippingCost)} (Skydropx - integración disponible)
            </p>
          </section>

          {/* Método de pago */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-5">Método de pago</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label
                className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-5 transition-all has-[:checked]:shadow-lg ${
                  paymentMethod === "wompi"
                    ? "border-[#6366F1] bg-indigo-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="wompi"
                  checked={paymentMethod === "wompi"}
                  onChange={() => setPaymentMethod("wompi")}
                  className="sr-only"
                />
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    paymentMethod === "wompi" ? "bg-indigo-500 text-white" : "bg-white text-indigo-600 shadow-sm"
                  }`}>
                    <CreditCard size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900">Wompi</p>
                    <p className="mt-0.5 text-sm font-medium text-indigo-600">Tarjeta · PSE · Nequi</p>
                    <p className="mt-2 text-xs text-gray-500">Pago inmediato con débito, crédito o PSE. Transacciones seguras.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">Pago instantáneo</span>
                </div>
              </label>
              <label
                className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-5 transition-all has-[:checked]:shadow-lg ${
                  paymentMethod === "addi"
                    ? "border-[#10B981] bg-emerald-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="addi"
                  checked={paymentMethod === "addi"}
                  onChange={() => setPaymentMethod("addi")}
                  className="sr-only"
                />
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    paymentMethod === "addi" ? "bg-emerald-500 text-white" : "bg-white text-emerald-600 shadow-sm"
                  }`}>
                    <Wallet size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900">ADDI</p>
                    <p className="mt-0.5 text-sm font-medium text-emerald-600">Compra ahora, paga después</p>
                    <p className="mt-2 text-xs text-gray-500">Hasta 12 cuotas sin tarjeta de crédito. Aprobación en minutos.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Hasta 12 cuotas</span>
                </div>
              </label>
            </div>
          </section>

          {/* Resumen */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Resumen</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span>{formatPrice(total + shippingCost)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full rounded-xl py-4 font-bold text-white disabled:opacity-50 transition-all ${
                paymentMethod === "wompi"
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {loading ? "Procesando..." : `Pagar con ${paymentMethod === "wompi" ? "Wompi" : "ADDI"}`}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}
