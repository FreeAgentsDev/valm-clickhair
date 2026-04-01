"use client";

import { useEffect, useState } from "react";
import { Package, FileText, Megaphone, ShoppingBag, Truck } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

import { usePopup } from "@/hooks/usePopup";
import { useOrders } from "@/hooks/useOrders";
import { useMarquee } from "@/hooks/useMarquee";
import { useHeroContent } from "@/hooks/useHeroContent";
import { useShipping } from "@/hooks/useShipping";
import AdminLayout from "./layout/AdminLayout";
import ProductEditor from "./editors/ProductEditor";

import PopupEditor from "./editors/PopupEditor";
import OrdersViewer from "./editors/OrdersViewer";
import MarqueeEditor from "./editors/MarqueeEditor";
import HeroContentEditor from "./editors/HeroContentEditor";
import ShippingEditor from "./editors/ShippingEditor";

type TabId = "productos" | "ordenes" | "envios" | "contenido" | "popup";

export default function AdminPanel() {
  const [tab, setTab] = useState<TabId>("productos");
  const {
    dbProducts,
    categories,
    addProduct,
    updateProduct,
    removeProduct,
    loading,
    error,
  } = useAdmin();
  const { config: popupConfig, updatePopup, loading: popupLoading } = usePopup();
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    refreshOrders,
    updateStatus,
  } = useOrders();
  const { messages: marqueeMessages, loading: marqueeLoading, updateMessages: updateMarquee } = useMarquee();
  const { content: heroContent, loading: heroLoading, updateContent: updateHero } = useHeroContent();
  const {
    barrios,
    nacional,
    loading: shippingLoading,
    addBarrio,
    updateBarrio,
    removeBarrio,
    updateNacional,
  } = useShipping();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) window.location.href = "/admin/login";
      })
      .catch(() => {
        window.location.href = "/admin/login";
      });
  }, []);

  if (loading && !dbProducts.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-[#D62839]">
        <p className="font-bold uppercase tracking-widest animate-pulse">Cargando Panel...</p>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: typeof Package; badge?: number }[] = [
    { id: "productos", label: "Productos", icon: Package, badge: dbProducts.length },
    { id: "ordenes", label: "Órdenes", icon: ShoppingBag, badge: orders.length },
    { id: "envios", label: "Envíos", icon: Truck, badge: barrios.length },
    { id: "contenido", label: "Contenido", icon: FileText },
    { id: "popup", label: "Popup", icon: Megaphone },
  ];

  return (
    <AdminLayout onLogout={handleLogout}>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200 scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              tab === id ? "border-[#D62839] text-[#D62839]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={18} />
            {label}
            {badge !== undefined && badge > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === id ? "bg-[#D62839]/10 text-[#D62839]" : "bg-gray-100 text-gray-500"}`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {tab === "productos" && (
        <ProductEditor
          products={dbProducts}
          categories={categories}
          onAdd={addProduct}
          onUpdate={updateProduct}
          onDelete={removeProduct}
        />
      )}

      {tab === "ordenes" && (
        <OrdersViewer
          orders={orders}
          loading={ordersLoading}
          error={ordersError}
          onRefresh={refreshOrders}
          onUpdateStatus={updateStatus}
        />
      )}

      {tab === "envios" && (
        <>
          {shippingLoading && !barrios.length ? (
            <p className="text-gray-500 animate-pulse">Cargando precios de envío...</p>
          ) : (
            <ShippingEditor
              barrios={barrios}
              nacional={nacional}
              onAddBarrio={addBarrio}
              onUpdateBarrio={updateBarrio}
              onRemoveBarrio={removeBarrio}
              onUpdateNacional={updateNacional}
            />
          )}
        </>
      )}

      {tab === "contenido" && (
        <div className="space-y-8">
          {/* Hero Content */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <HeroContentEditor content={heroContent} onSave={updateHero} loading={heroLoading} />
          </div>

          {/* Marquee */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <MarqueeEditor messages={marqueeMessages} onSave={updateMarquee} loading={marqueeLoading} />
          </div>

        </div>
      )}

      {tab === "popup" && (
        <>
          {popupLoading ? (
            <p className="text-gray-500 animate-pulse">Cargando...</p>
          ) : (
            <PopupEditor config={popupConfig} onSave={updatePopup} />
          )}
        </>
      )}
    </AdminLayout>
  );
}
