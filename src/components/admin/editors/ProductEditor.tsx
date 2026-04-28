"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Search, Database, Plus, Save, Trash2, X, Upload, Loader2, Check } from "lucide-react";
import type { DbProduct, DbCategory, DbBrand } from "@/lib/db";

interface ProductEditorProps {
  products: DbProduct[];
  categories: DbCategory[];
  brands: DbBrand[];
  onAdd: (data: ProductFormData) => Promise<DbProduct>;
  onUpdate: (id: string, data: ProductFormData) => Promise<DbProduct>;
  onDelete: (id: string) => Promise<void>;
  onAddCategory: (nombre: string) => Promise<DbCategory>;
  onDeleteCategory: (id: number) => Promise<void>;
  onAddBrand: (nombre: string) => Promise<DbBrand>;
  onDeleteBrand: (id: number) => Promise<void>;
}

interface ProductFormData {
  nombre: string;
  precio: number;
  descuento: number;
  descripcion: string;
  categoria: string;
  marca: string;
  imagen: string;
  peso_gramos?: number;
  agotado: boolean;
  images?: string[];
}

function emptyForm(): ProductFormData {
  return { nombre: "", precio: 0, descuento: 0, descripcion: "", categoria: "", marca: "", imagen: "", peso_gramos: 300, agotado: false, images: [] };
}

export default function ProductEditor({
  products,
  categories,
  brands,
  onAdd,
  onUpdate,
  onDelete,
  onAddCategory,
  onDeleteCategory,
  onAddBrand,
  onDeleteBrand,
}: ProductEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [savingBrand, setSavingBrand] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const imagesRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList, folder = "products"): Promise<string[]> => {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error subiendo imagen");
    return data.urls;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

  const categoryNames = categories.map((c) => c.nombre);
  const brandNames = brands.map((b) => b.nombre);

  const sinMarcaCount = products.filter((p) => !p.marca).length;
  const productsByBrand = new Map<string, number>();
  for (const p of products) {
    if (p.marca) productsByBrand.set(p.marca, (productsByBrand.get(p.marca) ?? 0) + 1);
  }
  const productsByCategory = new Map<string, number>();
  for (const p of products) {
    if (p.categoria) productsByCategory.set(p.categoria, (productsByCategory.get(p.categoria) ?? 0) + 1);
  }

  const filtered = products.filter((p) => {
    const matchesSearch = !searchTerm || `${p.nombre} ${p.descripcion} ${p.categoria} ${p.marca ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.categoria === categoryFilter;
    const matchesBrand =
      brandFilter === "all" ||
      (brandFilter === "__none__" ? !p.marca : (p.marca ?? "") === brandFilter);
    return matchesSearch && matchesCat && matchesBrand;
  });

  const handleSelect = (p: DbProduct) => {
    setSelectedId(p.id);
    const allImages = p.images?.length ? [...p.images] : p.imagen ? [p.imagen] : [];
    setForm({
      nombre: p.nombre,
      precio: p.precio,
      descuento: p.descuento,
      descripcion: p.descripcion,
      categoria: p.categoria,
      marca: p.marca ?? "",
      imagen: allImages[0] || "",
      peso_gramos: p.peso_gramos ?? 300,
      agotado: p.agotado ?? false,
      images: allImages,
    });
    setIsNew(false);
    setShowMobileEditor(true);
  };

  const handleNew = () => {
    setSelectedId(null);
    setForm(emptyForm());
    setIsNew(true);
    setShowMobileEditor(true);
  };

  const handleSave = async () => {
    if (!form || !form.nombre.trim()) return;
    setSaving(true);
    try {
      const dataToSave = { ...form, imagen: form.images?.[0] || form.imagen || "" };
      if (isNew) {
        const created = await onAdd(dataToSave);
        setSelectedId(created.id);
        setIsNew(false);
      } else if (selectedId) {
        await onUpdate(selectedId, dataToSave);
      }
    } catch {
      // error is handled by parent hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || isNew) return;
    if (!confirm(`¿Eliminar "${form?.nombre}" de la base de datos? Esta acción no se puede deshacer.`)) return;
    setSaving(true);
    try {
      await onDelete(selectedId);
      setSelectedId(null);
      setForm(null);
      setShowMobileEditor(false);
    } catch {
      // handled by hook
    } finally {
      setSaving(false);
    }
  };

  const handleQuickDelete = async (e: React.MouseEvent, p: DbProduct) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(p.id);
    try {
      await onDelete(p.id);
      if (selectedId === p.id) {
        setSelectedId(null);
        setForm(null);
        setShowMobileEditor(false);
      }
    } catch {
      // handled by hook
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name || !form) return;
    setSavingCategory(true);
    try {
      const created = await onAddCategory(name);
      setForm({ ...form, categoria: created.nombre });
      setNewCategoryName("");
      setCreatingCategory(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creando categoría");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCreateBrand = async () => {
    const name = newBrandName.trim();
    if (!name || !form) return;
    setSavingBrand(true);
    try {
      const created = await onAddBrand(name);
      setForm({ ...form, marca: created.nombre });
      setNewBrandName("");
      setCreatingBrand(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creando marca");
    } finally {
      setSavingBrand(false);
    }
  };

  const addImage = () => {
    if (!newImageUrl.trim() || !form) return;
    setForm({ ...form, images: [...(form.images || []), newImageUrl.trim()] });
    setNewImageUrl("");
  };

  const removeImage = (idx: number) => {
    if (!form) return;
    setForm({ ...form, images: (form.images || []).filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">
      {/* ── Sidebar ── */}
      <div className={`${showMobileEditor ? "hidden lg:flex" : "flex"} w-full lg:w-1/3 lg:min-w-[320px] lg:max-w-[400px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
            <Database size={16} /> Productos BD ({products.length})
          </h3>
          <button onClick={handleNew} className="rounded-full bg-[#D62839] p-2 text-white hover:bg-[#b82230] transition-colors" title="Nuevo producto">
            <Plus size={18} />
          </button>
        </div>

        <div className="mb-3 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
        </div>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none">
          <option value="all">Todas las categorías ({products.length})</option>
          {categoryNames.map((c) => <option key={c} value={c}>{c} ({productsByCategory.get(c) ?? 0})</option>)}
        </select>

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none">
          <option value="all">Todas las marcas ({products.length})</option>
          {sinMarcaCount > 0 && <option value="__none__">Sin marca ({sinMarcaCount})</option>}
          {brandNames.map((b) => <option key={b} value={b}>{b} ({productsByBrand.get(b) ?? 0})</option>)}
        </select>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 && <div className="py-8 text-center text-sm text-gray-500">Sin resultados</div>}
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`group relative w-full p-3 rounded-xl border transition-all flex gap-3 ${selectedId === p.id ? "border-[#D62839] bg-[#D62839]/10" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
            >
              <button onClick={() => handleSelect(p)} className="absolute inset-0 rounded-xl" aria-label={`Editar ${p.nombre}`} />
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200 overflow-hidden relative pointer-events-none">
                {(p.imagen || p.images?.[0]) ? (
                  <Image src={p.imagen || p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400"><Database size={18} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 pointer-events-none text-left">
                <p className={`font-medium text-sm truncate ${selectedId === p.id ? "text-[#D62839]" : "text-gray-900"}`}>{p.nombre}</p>
                <p className="text-xs text-gray-500 truncate">
                  {p.categoria}{p.marca ? ` · ${p.marca}` : ""}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono text-gray-600">{formatPrice(p.precio)}</p>
                  {p.descuento > 0 && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 rounded">-{p.descuento}%</span>}
                </div>
              </div>
              <button
                onClick={(e) => handleQuickDelete(e, p)}
                disabled={deletingId === p.id}
                className="relative z-10 self-start opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                title="Eliminar producto"
              >
                {deletingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Editor ── */}
      <div className={`${showMobileEditor ? "block" : "hidden lg:block"} flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm`}>
        {form ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <button onClick={() => { setShowMobileEditor(false); setForm(null); setSelectedId(null); }} className="lg:hidden flex items-center gap-2 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wider">
                ← Volver
              </button>
              <div className="flex items-center gap-2 ml-auto">
                {!isNew && (
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 hover:border-red-300 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 size={16} /> Eliminar producto
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {isNew ? "Nuevo producto" : "Editar producto"}
            </h2>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes ({(form.images || []).length})
                {(form.images || []).length > 0 && <span className="text-xs text-gray-400 font-normal ml-1">— la primera es la portada</span>}
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(form.images || []).map((img, i) => (
                    <div key={i} className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 group ${i === 0 ? "border-[#D62839]" : "border-gray-200"}`}>
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                      <button onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} className="text-white" />
                      </button>
                      {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#D62839] text-white text-[8px] text-center font-bold py-0.5">Portada</span>}
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => imagesRef.current?.click()}
                    className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#D62839] hover:text-[#D62839] transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <><Upload size={18} /><span className="text-[9px] mt-0.5">Subir</span></>}
                  </button>
                </div>
                <input
                  ref={imagesRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files?.length || !form) return;
                    setUploading(true);
                    try {
                      const urls = await uploadFiles(e.target.files);
                      setForm({ ...form, images: [...(form.images || []), ...urls] });
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Error subiendo imágenes");
                    } finally {
                      setUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                <div className="flex gap-2">
                  <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="o pega una URL..." className="flex-1 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs focus:border-[#D62839] focus:outline-none" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())} />
                  <button onClick={addImage} className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">URL</button>
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del producto" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none text-lg font-semibold" />
            </div>

            {/* Precio + Descuento + Peso */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio (COP)</label>
                <input type="number" value={form.precio || ""} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) || 0 })} placeholder="0" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none [appearance:textfield]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descuento (%)</label>
                <input type="number" value={form.descuento || ""} onChange={(e) => setForm({ ...form, descuento: Number(e.target.value) || 0 })} placeholder="0" min="0" max="100" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none [appearance:textfield]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso (g)</label>
                <input type="number" value={form.peso_gramos || ""} onChange={(e) => setForm({ ...form, peso_gramos: Number(e.target.value) || 300 })} placeholder="300" min="1" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none [appearance:textfield]" />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={4} placeholder="Descripción del producto..." className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none resize-none" />
            </div>

            {/* Categoría */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Categoría <span className="text-gray-400 font-normal">({categories.length} disponibles)</span>
                </label>
                {!creatingCategory && (
                  <button
                    type="button"
                    onClick={() => { setCreatingCategory(true); setNewCategoryName(""); }}
                    className="flex items-center gap-1 text-xs font-medium text-[#D62839] hover:text-[#b82230]"
                  >
                    <Plus size={14} /> Nueva categoría
                  </button>
                )}
              </div>

              {creatingCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nombre de la nueva categoría"
                    className="flex-1 rounded-lg border border-[#D62839] px-4 py-2.5 text-sm focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleCreateCategory(); }
                      if (e.key === "Escape") { setCreatingCategory(false); setNewCategoryName(""); }
                    }}
                  />
                  <button
                    type="button"
                    disabled={!newCategoryName.trim() || savingCategory}
                    onClick={handleCreateCategory}
                    className="flex items-center gap-1.5 rounded-lg bg-[#D62839] px-3 py-2 text-sm font-medium text-white hover:bg-[#b82230] disabled:opacity-50"
                  >
                    {savingCategory ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCreatingCategory(false); setNewCategoryName(""); }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none bg-white"
                >
                  <option value="">— Selecciona categoría —</option>
                  {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
                  {form.categoria && !categoryNames.includes(form.categoria) && (
                    <option value={form.categoria}>{form.categoria} (sin guardar)</option>
                  )}
                </select>
              )}

              {categories.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                    Administrar categorías
                  </summary>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-gray-100 pl-3 pr-1 py-1 text-xs text-gray-700">
                        {c.nombre}
                        <button
                          type="button"
                          onClick={async () => {
                            const used = products.some((p) => p.categoria === c.nombre);
                            const msg = used
                              ? `"${c.nombre}" está en uso por algunos productos. ¿Eliminar la categoría de todas formas?`
                              : `¿Eliminar la categoría "${c.nombre}"?`;
                            if (!confirm(msg)) return;
                            try {
                              await onDeleteCategory(c.id);
                            } catch (err) {
                              alert(err instanceof Error ? err.message : "Error");
                            }
                          }}
                          className="rounded-full p-0.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
                          title={`Eliminar ${c.nombre}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </details>
              )}
            </div>

            {/* Marca */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Marca <span className="text-gray-400 font-normal">({brands.length} disponibles)</span>
                </label>
                {!creatingBrand && (
                  <button
                    type="button"
                    onClick={() => { setCreatingBrand(true); setNewBrandName(""); }}
                    className="flex items-center gap-1 text-xs font-medium text-[#D62839] hover:text-[#b82230]"
                  >
                    <Plus size={14} /> Nueva marca
                  </button>
                )}
              </div>

              {creatingBrand ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Nombre de la nueva marca"
                    className="flex-1 rounded-lg border border-[#D62839] px-4 py-2.5 text-sm focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleCreateBrand(); }
                      if (e.key === "Escape") { setCreatingBrand(false); setNewBrandName(""); }
                    }}
                  />
                  <button
                    type="button"
                    disabled={!newBrandName.trim() || savingBrand}
                    onClick={handleCreateBrand}
                    className="flex items-center gap-1.5 rounded-lg bg-[#D62839] px-3 py-2 text-sm font-medium text-white hover:bg-[#b82230] disabled:opacity-50"
                  >
                    {savingBrand ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCreatingBrand(false); setNewBrandName(""); }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <select
                  value={form.marca}
                  onChange={(e) => setForm({ ...form, marca: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none bg-white"
                >
                  <option value="">— Sin marca —</option>
                  {brandNames.map((b) => <option key={b} value={b}>{b}</option>)}
                  {form.marca && !brandNames.includes(form.marca) && (
                    <option value={form.marca}>{form.marca} (sin guardar)</option>
                  )}
                </select>
              )}

              {brands.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                    Administrar marcas
                  </summary>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {brands.map((b) => (
                      <span key={b.id} className="inline-flex items-center gap-1 rounded-full bg-gray-100 pl-3 pr-1 py-1 text-xs text-gray-700">
                        {b.nombre}
                        <button
                          type="button"
                          onClick={async () => {
                            const used = products.some((p) => p.marca === b.nombre);
                            const msg = used
                              ? `"${b.nombre}" está en uso por algunos productos. ¿Eliminar la marca de todas formas?`
                              : `¿Eliminar la marca "${b.nombre}"?`;
                            if (!confirm(msg)) return;
                            try {
                              await onDeleteBrand(b.id);
                            } catch (err) {
                              alert(err instanceof Error ? err.message : "Error");
                            }
                          }}
                          className="rounded-full p-0.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
                          title={`Eliminar ${b.nombre}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </details>
              )}
            </div>

            {/* Agotado */}
            <label
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all ${
                form.agotado
                  ? "border-[#D62839] bg-[#D62839]/5"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-sm font-semibold ${form.agotado ? "text-[#D62839]" : "text-gray-700"}`}>
                  Marcar como agotado
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  Se mostrará una banda &quot;Agotado&quot; en la card y se deshabilitará la compra.
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.agotado}
                onChange={(e) => setForm({ ...form, agotado: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  form.agotado ? "bg-[#D62839]" : "bg-gray-300"
                }`}
                aria-hidden
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                    form.agotado ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>

            {/* ID (solo edición) */}
            {!isNew && selectedId && (
              <p className="text-[10px] font-mono text-gray-400">ID: {selectedId}</p>
            )}

            {/* Guardar */}
            <button onClick={handleSave} disabled={saving || !form.nombre.trim()} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D62839] py-3.5 font-medium text-white transition-all hover:opacity-90 shadow-md disabled:opacity-50">
              <Save size={18} />
              {saving ? "Guardando..." : isNew ? "Crear producto" : "Guardar cambios"}
            </button>
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
            <Database size={40} className="mb-4 opacity-30" />
            <p className="text-xs font-bold uppercase tracking-wider">Selecciona un producto o crea uno nuevo</p>
            <p className="text-xs text-gray-400 mt-1">{products.length} productos en la base de datos</p>
          </div>
        )}
      </div>
    </div>
  );
}
