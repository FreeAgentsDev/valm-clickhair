"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Search, Database, Plus, Save, Trash2, X, Upload, Loader2 } from "lucide-react";
import type { DbProduct, DbCategory } from "@/lib/db";

interface ProductEditorProps {
  products: DbProduct[];
  categories: DbCategory[];
  onAdd: (data: ProductFormData) => Promise<DbProduct>;
  onUpdate: (id: string, data: ProductFormData) => Promise<DbProduct>;
  onDelete: (id: string) => Promise<void>;
}

interface ProductFormData {
  nombre: string;
  precio: number;
  descuento: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  peso_gramos?: number;
  images?: string[];
}

function emptyForm(): ProductFormData {
  return { nombre: "", precio: 0, descuento: 0, descripcion: "", categoria: "", imagen: "", peso_gramos: 300, images: [] };
}

export default function ProductEditor({
  products,
  categories,
  onAdd,
  onUpdate,
  onDelete,
}: ProductEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
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

  const uniqueCategories = Array.from(
    new Set([...categories.map((c) => c.nombre), ...products.map((p) => p.categoria)])
  ).filter(Boolean);

  const filtered = products.filter((p) => {
    const matchesSearch = !searchTerm || `${p.nombre} ${p.descripcion} ${p.categoria}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.categoria === categoryFilter;
    return matchesSearch && matchesCat;
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
      imagen: allImages[0] || "",
      peso_gramos: p.peso_gramos ?? 300,
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
      // La primera imagen del array es la portada
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

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none">
          <option value="all">Todas las categorías</option>
          {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 && <div className="py-8 text-center text-sm text-gray-500">Sin resultados</div>}
          {filtered.map((p) => (
            <button key={p.id} onClick={() => handleSelect(p)} className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 ${selectedId === p.id ? "border-[#D62839] bg-[#D62839]/10" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200 overflow-hidden relative">
                {(p.imagen || p.images?.[0]) ? (
                  <Image src={p.imagen || p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400"><Database size={18} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${selectedId === p.id ? "text-[#D62839]" : "text-gray-900"}`}>{p.nombre}</p>
                <p className="text-xs text-gray-500 truncate">{p.categoria}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono text-gray-600">{formatPrice(p.precio)}</p>
                  {p.descuento > 0 && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 rounded">-{p.descuento}%</span>}
                </div>
              </div>
            </button>
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
              <div className="flex items-center gap-2">
                {!isNew && (
                  <button onClick={handleDelete} disabled={saving} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50">
                    <Trash2 size={14} /> Eliminar
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <input type="text" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} list="categories-list" placeholder="Categoría" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none" />
              <datalist id="categories-list">
                {uniqueCategories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

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
