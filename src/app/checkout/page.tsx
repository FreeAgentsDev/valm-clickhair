"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/lib/cart-context";
import { Wallet, Truck, ShoppingBag, MapPin } from "lucide-react";
import type { ShippingAddress } from "@/types";
import BarrioAutocomplete from "@/components/checkout/BarrioAutocomplete";

export default function CheckoutPage() {
  const { items, total, totalWeight, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"mercado-pago" | "addi">("mercado-pago");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingMessage, setShippingMessage] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "",
  });

  const isManizales = address.city.toLowerCase().trim() === "manizales";

  const recalcularEnvio = useCallback(async () => {
    if (isManizales) {
      if (!selectedBarrio) {
        setShippingCost(null);
        setShippingMessage("Selecciona tu barrio para ver el costo de envío");
      }
      return;
    }

    if (!address.city.trim() || !address.department) {
      setShippingCost(null);
      setShippingMessage("");
      return;
    }

    // Envío por zona via API (lee precios de DB)
    setLoadingShipping(true);
    try {
      const res = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: address.city,
          department: address.department,
          totalWeightGrams: totalWeight || 300,
        }),
      });
      const data = await res.json();
      if (data.costo != null) {
        setShippingCost(data.costo);
        setShippingMessage(data.mensaje || "Envío calculado");
      }
    } catch {
      setShippingCost(null);
      setShippingMessage("Error calculando envío");
    } finally {
      setLoadingShipping(false);
    }
  }, [address.city, address.department, isManizales, selectedBarrio, totalWeight]);

  useEffect(() => {
    recalcularEnvio();
  }, [recalcularEnvio]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const buildAddiWhatsAppMessage = (reference: string) => {
    const ship = shippingCost ?? 0;
    const orderTotal = total + ship;
    let msg = `Hola! Quiero comprar con *ADDI* (cuotas) los siguientes productos:\n\n`;
    msg += `*Pedido:* ${reference}\n\n`;
    items.forEach((item) => {
      msg += `• ${item.product.name} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}\n`;
    });
    msg += `\n*Subtotal:* ${formatPrice(total)}`;
    msg += `\n*Envío:* ${formatPrice(ship)}`;
    msg += `\n*Total:* ${formatPrice(orderTotal)}`;
    msg += `\n\n*Datos de envío:*`;
    msg += `\n${address.name}`;
    msg += `\n${address.phone}`;
    msg += `\n${address.email}`;
    msg += `\n${address.address}, ${address.city}, ${address.department}`;
    msg += `\n\nPor favor envíame el link de ADDI para realizar el pago en cuotas. Gracias!`;
    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || shippingCost == null) return;

    setLoading(true);
    try {
      const orderTotal = total + shippingCost;
      const reference = `ORD-${Date.now()}`;

      // Guardar orden en el servidor
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: reference,
          items: items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
          })),
          shipping: address,
          subtotal: total,
          shippingCost,
          total: orderTotal,
          paymentMethod,
        }),
      });

      if (paymentMethod === "mercado-pago") {
        const res = await fetch("/api/mercado-pago/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              title: item.product.name,
              quantity: item.quantity,
              unit_price: item.product.price,
              picture_url: item.product.image,
            })),
            payer: {
              name: address.name,
              email: address.email,
              phone: address.phone,
            },
            reference,
            redirectUrl: `${window.location.origin}/checkout/success?ref=${reference}`,
          }),
        });
        const data = await res.json();
        if (data.init_point) {
          window.location.href = data.init_point;
          return;
        }
        if (data.sandbox_init_point) {
          window.location.href = data.sandbox_init_point;
          return;
        }
        if (data.error) throw new Error(data.error);
      } else {
        // ADDI → WhatsApp con mensaje pre-armado
        const message = buildAddiWhatsAppMessage(reference);
        window.open(`https://wa.me/573104077106?text=${message}`, "_blank");
        clearCart();
        router.push(`/checkout/success?ref=${reference}`);
        return;
      }

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
              <input type="text" placeholder="Nombre completo *" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} required className="rounded-xl border border-gray-200 px-4 py-3" />
              <input type="email" placeholder="Email *" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} required className="rounded-xl border border-gray-200 px-4 py-3" />
              <input type="tel" placeholder="Teléfono *" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required className="rounded-xl border border-gray-200 px-4 py-3" />
              <input type="text" placeholder="Ciudad *" value={address.city} onChange={(e) => {
                setAddress({ ...address, city: e.target.value });
                if (e.target.value.toLowerCase().trim() !== "manizales") {
                  setSelectedBarrio("");
                }
              }} required className="rounded-xl border border-gray-200 px-4 py-3" />
              <input type="text" placeholder="Dirección *" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} required className="sm:col-span-2 rounded-xl border border-gray-200 px-4 py-3" />
              <select value={address.department} onChange={(e) => setAddress({ ...address, department: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3">
                <option value="">Departamento *</option>
                <option value="Caldas">Caldas</option>
                <option value="Risaralda">Risaralda</option>
                <option value="Quindío">Quindío</option>
                <option value="Antioquia">Antioquia</option>
                <option value="Valle del Cauca">Valle del Cauca</option>
                <option value="Cundinamarca">Cundinamarca</option>
                <option value="Bogotá">Bogotá D.C.</option>
                <option value="Tolima">Tolima</option>
                <option value="Santander">Santander</option>
                <option value="Norte de Santander">Norte de Santander</option>
                <option value="Boyacá">Boyacá</option>
                <option value="Huila">Huila</option>
                <option value="Nariño">Nariño</option>
                <option value="Cauca">Cauca</option>
                <option value="Meta">Meta</option>
                <option value="Atlántico">Atlántico</option>
                <option value="Bolívar">Bolívar</option>
                <option value="Magdalena">Magdalena</option>
                <option value="Cesar">Cesar</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Sucre">Sucre</option>
                <option value="La Guajira">La Guajira</option>
                <option value="Casanare">Casanare</option>
                <option value="Arauca">Arauca</option>
                <option value="Chocó">Chocó</option>
                <option value="Putumayo">Putumayo</option>
                <option value="Caquetá">Caquetá</option>
                <option value="Guaviare">Guaviare</option>
                <option value="Amazonas">Amazonas</option>
                <option value="Vaupés">Vaupés</option>
                <option value="Guainía">Guainía</option>
                <option value="Vichada">Vichada</option>
                <option value="San Andrés">San Andrés y Providencia</option>
              </select>
            </div>

            {/* Selector de barrio para Manizales */}
            {isManizales && (
              <div className="mt-4">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} />
                  Barrio
                </label>
                <BarrioAutocomplete
                  selected={selectedBarrio}
                  onSelect={(barrio) => {
                    setSelectedBarrio(barrio.nombre);
                    setShippingCost(barrio.precio);
                    setShippingMessage(`Envío local - ${barrio.nombre}`);
                  }}
                />
              </div>
            )}

            {/* Costo de envío */}
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              {loadingShipping ? (
                <p className="text-sm text-gray-500 animate-pulse">Calculando envío...</p>
              ) : shippingCost != null ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{shippingMessage}</span>
                  <span className="font-semibold text-gray-900">{formatPrice(shippingCost)}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {isManizales
                    ? "Selecciona tu barrio para ver el costo de envío"
                    : address.city && address.department
                      ? "Calculando..."
                      : "Ingresa departamento y ciudad para calcular el envío"}
                </p>
              )}
            </div>
          </section>

          {/* Método de pago */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-5">Método de pago</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Mercado Pago */}
              <label
                className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-5 transition-all has-[:checked]:shadow-lg ${
                  paymentMethod === "mercado-pago"
                    ? "border-[#009EE3] bg-sky-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <input type="radio" name="payment" value="mercado-pago" checked={paymentMethod === "mercado-pago"} onChange={() => setPaymentMethod("mercado-pago")} className="sr-only" />
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${paymentMethod === "mercado-pago" ? "bg-[#009EE3] text-white" : "bg-white text-[#009EE3] shadow-sm"}`}>
                    <ShoppingBag size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900">Mercado Pago</p>
                    <p className="mt-0.5 text-sm font-medium text-[#009EE3]">Tarjeta · PSE · Nequi · Efecty</p>
                    <p className="mt-2 text-xs text-gray-500">Todos los métodos de pago en un solo lugar. Seguro y rápido.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">Recomendado</span>
                </div>
              </label>

              {/* ADDI (redirige a WhatsApp) */}
              <label
                className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-5 transition-all has-[:checked]:shadow-lg ${
                  paymentMethod === "addi"
                    ? "border-[#10B981] bg-emerald-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <input type="radio" name="payment" value="addi" checked={paymentMethod === "addi"} onChange={() => setPaymentMethod("addi")} className="sr-only" />
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${paymentMethod === "addi" ? "bg-emerald-500 text-white" : "bg-white text-emerald-600 shadow-sm"}`}>
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
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{shippingCost != null ? formatPrice(shippingCost) : "Por calcular"}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span>{formatPrice(total + (shippingCost ?? 0))}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || shippingCost == null}
              className={`mt-6 w-full rounded-xl py-4 font-bold text-white disabled:opacity-50 transition-all ${
                paymentMethod === "mercado-pago"
                  ? "bg-[#009EE3] hover:bg-[#0087C9]"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {loading
                ? "Procesando..."
                : shippingCost == null
                  ? "Completa los datos de envío"
                  : paymentMethod === "mercado-pago"
                    ? "Pagar con Mercado Pago"
                    : "Solicitar cuotas ADDI"}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}
