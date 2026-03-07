"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import type { BrandSlug } from "@/types";
import { BRANDS } from "@/lib/brands";

interface ProductEditorProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

const BRAND_OPTIONS: BrandSlug[] = ["valm-beauty", "click-hair"];

export default function ProductEditor({
  products,
  onSave,
  onDelete,
}: ProductEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<BrandSlug | "all">("all");
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        !searchTerm ||
        `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = brandFilter === "all" || p.brand === brandFilter;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSelect = (product: Product) => {
    setSelectedId(product.id);
    setEditingProduct({ ...product });
    setShowMobileEditor(true);
  };

  const handleCreateNew = () => {
    const newProduct: Product = {
      id: `new-${Date.now()}`,
      brand: "valm-beauty",
      name: "Nuevo Producto",
      description: "Descripción del producto...",
      price: 0,
      image: "",
      category: "General",
      stock: 0,
      weight: 100,
      dimensions: { width: 10, height: 15, length: 5 },
    };
    setSelectedId(newProduct.id);
    setEditingProduct(newProduct);
    setShowMobileEditor(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const handleSave = () => {
    if (!editingProduct) return;
    const toSave = { ...editingProduct };
    if (toSave.id.startsWith("new-")) {
      toSave.id = `${toSave.brand}-${toSave.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${Date.now().toString(36)}`;
    }
    onSave(toSave);
    setSelectedId(toSave.id);
    setEditingProduct(toSave);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setShowMobileEditor(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
      {/* Sidebar List */}
      <div
        className={`${
          showMobileEditor ? "hidden lg:flex" : "flex"
        } w-full lg:w-1/3 lg:min-w-[320px] lg:max-w-[400px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm`}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Productos
          </h3>
          <button
            onClick={handleCreateNew}
            className="rounded-full bg-[#D62839] p-2 text-white hover:bg-[#b82230] transition-colors"
            title="Crear Nuevo Producto"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#D62839] focus:outline-none"
          />
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value as BrandSlug | "all")}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#D62839] focus:outline-none"
          >
            <option value="all">Todas las marcas</option>
            <option value="valm-beauty">{BRANDS["valm-beauty"].name}</option>
            <option value="click-hair">{BRANDS["click-hair"].name}</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredProducts.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No se encontraron productos
            </div>
          )}
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 ${
                selectedId === product.id
                  ? "border-[#D62839] bg-[#D62839]/10"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200 overflow-hidden relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized={product.image.startsWith("data:")}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${selectedId === product.id ? "text-[#D62839]" : "text-gray-900"}`}>
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{product.category}</p>
                <p className="text-xs font-mono text-gray-600">{formatPrice(product.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Form */}
      <div
        className={`${
          showMobileEditor ? "block" : "hidden lg:block"
        } flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm`}
      >
        {editingProduct ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            <button
              onClick={() => setShowMobileEditor(false)}
              className="lg:hidden flex items-center gap-2 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a la lista
            </button>

            {/* Layout tipo tarjeta de producto: imagen izquierda, detalles derecha */}
            <div
              className="rounded-2xl border-2 bg-white shadow-sm overflow-hidden"
              style={{ borderColor: `${BRANDS[editingProduct.brand].primaryColor}30` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Columna izquierda: Imagen (como en la tarjeta de producto) */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square relative overflow-hidden bg-gray-50 cursor-pointer group"
                  style={{ borderRight: `1px solid ${BRANDS[editingProduct.brand].primaryColor}20` }}
                >
                  {editingProduct.image ? (
                    <>
                      <Image
                        src={editingProduct.image}
                        alt={editingProduct.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        unoptimized={editingProduct.image.startsWith("data:")}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-semibold">Cambiar imagen</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <svg className="h-16 w-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Clic para subir imagen</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>

                {/* Columna derecha: Detalles (orden como tarjeta de producto) */}
                <div className="flex flex-col p-6 sm:p-8">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <select
                      value={editingProduct.brand}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value as BrandSlug })}
                      className="rounded-full px-3 py-1.5 text-xs font-medium text-white border-0 cursor-pointer focus:ring-2 focus:ring-offset-1"
                      style={{ backgroundColor: BRANDS[editingProduct.brand].primaryColor }}
                    >
                      {BRAND_OPTIONS.map((b) => (
                        <option key={b} value={b}>{BRANDS[b].name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        if (confirm("¿Estás seguro de eliminar este producto?")) {
                          onDelete(editingProduct.id);
                          setSelectedId(null);
                          setEditingProduct(null);
                          setShowMobileEditor(false);
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>

                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Nombre del producto"
                    className="text-2xl font-bold text-gray-900 border-0 border-b border-transparent hover:border-gray-200 focus:border-[#D62839] focus:outline-none pb-1 mb-3 transition-colors"
                  />

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold" style={{ color: BRANDS[editingProduct.brand].primaryColor }}>$</span>
                    <input
                      type="number"
                      value={editingProduct.price || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) || 0 })}
                      placeholder="0"
                      className="text-2xl font-bold border-0 border-b border-transparent hover:border-gray-200 focus:border-[#D62839] focus:outline-none pb-1 w-28 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ color: BRANDS[editingProduct.brand].primaryColor }}
                    />
                  </div>

                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Descripción del producto..."
                    rows={4}
                    className="text-gray-600 border border-gray-200 rounded-xl px-4 py-3 focus:border-[#D62839] focus:outline-none resize-none mb-4"
                  />

                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    placeholder="Categoría"
                    className="text-sm text-gray-500 border-0 border-b border-transparent hover:border-gray-200 focus:border-gray-300 focus:outline-none pb-1 mb-6 transition-colors"
                  />

                  {/* Campos adicionales (stock, peso, URL imagen) */}
                  <details className="mb-6 group/details">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden">
                      <span className="transition-transform group-open/details:rotate-90">›</span> Más opciones (stock, peso, URL)
                    </summary>
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
                      <div className="flex gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Stock</label>
                          <input
                            type="number"
                            value={editingProduct.stock || ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) || 0 })}
                            className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Peso (g)</label>
                          <input
                            type="number"
                            value={editingProduct.weight ?? ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct, weight: Number(e.target.value) || undefined })}
                            placeholder="Envíos"
                            className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">URL de imagen</label>
                        <input
                          type="text"
                          value={editingProduct.image || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          placeholder="/ruta/imagen.jpg"
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#D62839] focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] font-mono text-gray-400">ID: {editingProduct.id}</p>
                    </div>
                  </details>

                  <button
                    onClick={handleSave}
                    className="mt-auto flex items-center justify-center gap-2 rounded-xl py-3.5 font-medium text-white transition-all hover:opacity-90 shadow-md"
                    style={{ backgroundColor: BRANDS[editingProduct.brand].primaryColor }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
            <svg className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider">Selecciona un producto para editar</p>
          </div>
        )}
      </div>
    </div>
  );
}
