"use client";

import { useState } from "react";
import { Sparkles, Package, Plus, X } from "lucide-react";
import type { BrandContent } from "@/types";
import type { BrandSlug } from "@/types";
import { BRANDS } from "@/lib/brands";

interface BrandContentEditorProps {
  content: BrandContent[];
  onSave: (content: BrandContent) => void;
}

const BRAND_OPTIONS: BrandSlug[] = ["valm-beauty", "click-hair"];

export default function BrandContentEditor({
  content,
  onSave,
}: BrandContentEditorProps) {
  const [selectedBrand, setSelectedBrand] = useState<BrandSlug>("valm-beauty");
  const [editing, setEditing] = useState<BrandContent | null>(null);

  const currentContent =
    content.find((c) => c.brand === selectedBrand) ?? {
      brand: selectedBrand,
      description: BRANDS[selectedBrand].description,
      brandsCarried: BRANDS[selectedBrand].brandsCarried ?? [],
      categories: BRANDS[selectedBrand].categories,
      highlights: BRANDS[selectedBrand].highlights,
    };

  const draft = editing ?? currentContent;
  const brandInfo = BRANDS[selectedBrand];
  const primaryColor = brandInfo.primaryColor;
  const isValm = selectedBrand === "valm-beauty";

  const handleStartEdit = () => {
    setEditing({ ...currentContent });
  };

  const handleSave = () => {
    if (editing) {
      onSave(editing);
      setEditing(null);
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const addBrandTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || !editing) return;
    const list = editing.brandsCarried ?? [];
    if (list.includes(trimmed)) return;
    setEditing({ ...editing, brandsCarried: [...list, trimmed] });
  };

  const removeBrandTag = (tag: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      brandsCarried: (editing.brandsCarried ?? []).filter((b) => b !== tag),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          Contenido general de la marca
        </h2>
        <div className="flex gap-2">
          {BRAND_OPTIONS.map((slug) => (
            <button
              key={slug}
              onClick={() => {
                setSelectedBrand(slug);
                setEditing(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedBrand === slug
                  ? "text-white"
                  : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
              style={
                selectedBrand === slug
                  ? { backgroundColor: BRANDS[slug].primaryColor }
                  : undefined
              }
            >
              {BRANDS[slug].name}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl border-2 p-6 sm:p-8 bg-white"
        style={{
          borderColor: isValm ? "#F5A6B8" : "#B8D4E8",
          backgroundColor: isValm ? "#FFF5F7" : "#F8F5FF",
        }}
      >
        {!editing ? (
          <div className="space-y-8">
            {/* Sobre la marca */}
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Sparkles size={20} style={{ color: primaryColor }} />
                Sobre {brandInfo.name}
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {draft.description || "Sin descripción"}
              </p>
            </section>

            {/* Marcas que manejamos */}
            {(draft.brandsCarried?.length ?? 0) > 0 && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Package size={20} style={{ color: primaryColor }} />
                  Marcas que manejamos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(draft.brandsCarried ?? []).map((b) => (
                    <span
                      key={b}
                      className="rounded-full px-4 py-2 text-sm font-medium"
                      style={{
                        backgroundColor: primaryColor + "20",
                        color: primaryColor,
                        borderWidth: 1,
                        borderColor: primaryColor + "40",
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <button
              onClick={handleStartEdit}
              className="rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Editar contenido
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Editar descripción */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sobre {brandInfo.name}
              </label>
              <textarea
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                rows={6}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                placeholder="Descripción de la tienda..."
              />
            </div>

            {/* Editar marcas */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Marcas que manejamos
              </label>
              <div className="flex flex-wrap gap-2">
                {(editing.brandsCarried ?? []).map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
                    style={{
                      backgroundColor: primaryColor + "20",
                      color: primaryColor,
                      borderWidth: 1,
                      borderColor: primaryColor + "40",
                    }}
                  >
                    {b}
                    <button
                      type="button"
                      onClick={() => removeBrandTag(b)}
                      className="rounded-full p-0.5 hover:bg-black/10"
                      aria-label={`Quitar ${b}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <AddBrandTagInput onAdd={addBrandTag} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Guardar cambios
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddBrandTagInput({
  onAdd,
}: {
  onAdd: (tag: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-flex">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="+ Agregar marca"
        className="rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="ml-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="Agregar"
      >
        <Plus size={18} />
      </button>
    </form>
  );
}
