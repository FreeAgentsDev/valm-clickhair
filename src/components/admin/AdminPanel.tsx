"use client";

import { useEffect, useState } from "react";
import { Package, FileText, Megaphone } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { useBrandContent } from "@/hooks/useBrandContent";
import { usePopup } from "@/hooks/usePopup";
import AdminLayout from "./layout/AdminLayout";
import ProductEditor from "./editors/ProductEditor";
import BrandContentEditor from "./editors/BrandContentEditor";
import PopupEditor from "./editors/PopupEditor";

type TabId = "productos" | "contenido" | "popup";

export default function AdminPanel() {
  const [tab, setTab] = useState<TabId>("productos");
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  } = useAdmin();
  const { content, updateBrandContent, loading: contentLoading } = useBrandContent();
  const { config: popupConfig, updatePopup, loading: popupLoading } = usePopup();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_authenticated");
      window.location.href = "/admin/login";
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_authenticated") !== "true") {
      window.location.href = "/admin/login";
    }
  }, []);

  if (loading && !products.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-[#D62839]">
        <p className="font-bold uppercase tracking-widest animate-pulse">
          Cargando Panel...
        </p>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("productos")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "productos"
              ? "border-[#D62839] text-[#D62839]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package size={18} />
          Productos
        </button>
        <button
          onClick={() => setTab("contenido")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "contenido"
              ? "border-[#D62839] text-[#D62839]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FileText size={18} />
          Contenido general
        </button>
        <button
          onClick={() => setTab("popup")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "popup"
              ? "border-[#D62839] text-[#D62839]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Megaphone size={18} />
          Anuncio popup
        </button>
      </div>

      {error && (
        <div className="mx-4 mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
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
          products={products}
          onSave={(product) => {
            const exists = products.some((p) => p.id === product.id);
            if (exists) {
              updateProduct(product);
            } else {
              addProduct(product);
            }
          }}
          onDelete={deleteProduct}
        />
      )}

      {tab === "contenido" && (
        <>
          {contentLoading && !content.length ? (
            <p className="text-gray-500 animate-pulse">Cargando contenido...</p>
          ) : (
            <BrandContentEditor
              content={content}
              onSave={updateBrandContent}
            />
          )}
        </>
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
