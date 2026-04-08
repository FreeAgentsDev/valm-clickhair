"use client";

import { useState, useEffect } from "react";
import { Check, Quote, Star, Trash2 } from "lucide-react";
import type { Testimonial } from "@/lib/admin-storage";

interface TestimonialEditorProps {
  testimonials: Testimonial[];
  onSave: (testimonials: Testimonial[]) => void;
  loading: boolean;
}

export default function TestimonialEditor({ testimonials, onSave, loading }: TestimonialEditorProps) {
  const [draft, setDraft] = useState<Testimonial[]>(testimonials);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(testimonials);
  }, [testimonials]);

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCard = (index: number, field: keyof Testimonial, value: string | number) => {
    const next = [...draft];
    next[index] = { ...next[index], [field]: value };
    setDraft(next);
  };

  const removeCard = (index: number) => {
    setDraft(draft.filter((_, i) => i !== index));
  };

  const addCard = () => {
    setDraft([...draft, { name: "", text: "", label: "Clienta verificada", stars: 5 }]);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(testimonials);

  if (loading) {
    return <div className="text-gray-500 animate-pulse text-sm">Cargando testimonios...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Testimonios</h3>
        <p className="text-xs text-gray-500 mt-0.5">Edita las tarjetas de testimonios que aparecen en la pagina principal</p>
      </div>

      {/* ── Preview ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <p className="px-3 py-1.5 text-[10px] font-medium uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
          Vista previa
        </p>
        <div className="p-6" style={{ background: "linear-gradient(180deg, #FFF5F8 0%, #FDF2F4 100%)" }}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {draft.map((t, i) => (
              <article key={i} className="bg-white rounded-xl p-4 border border-[#F6BCCB]/30 shadow-sm">
                <Quote size={16} className="text-[#F6BCCB] mb-2" />
                <p className="text-gray-600 text-[10px] leading-relaxed mb-3 line-clamp-3">{t.text || "Texto del testimonio..."}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-[10px]">{t.name || "Nombre"}</p>
                    <p className="text-[8px] text-gray-400">{t.label}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} size={8} className="fill-[#E93B3C] text-[#E93B3C]" />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cards editor ── */}
      <div className="space-y-4">
        {draft.map((t, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Testimonio {i + 1}</p>
              {draft.length > 1 && (
                <button onClick={() => removeCard(i)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) => updateCard(i, "name", e.target.value)}
                  placeholder="Ej: Carolina M."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Etiqueta</label>
                <input
                  type="text"
                  value={t.label}
                  onChange={(e) => updateCard(i, "label", e.target.value)}
                  placeholder="Ej: Clienta verificada"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Testimonio</label>
                <textarea
                  value={t.text}
                  onChange={(e) => updateCard(i, "text", e.target.value)}
                  rows={2}
                  placeholder="Escribe el testimonio de la clienta..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none resize-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Estrellas</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateCard(i, "stars", s)}
                      className="p-0.5"
                    >
                      <Star
                        size={18}
                        className={s <= t.stars ? "fill-[#E93B3C] text-[#E93B3C]" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add card button */}
      <button
        onClick={addCard}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-[#D62839] hover:text-[#D62839] transition-colors"
      >
        + Agregar testimonio
      </button>

      {/* Save */}
      {hasChanges && (
        <button onClick={handleSave} className="flex items-center gap-1.5 rounded-lg bg-[#D62839] px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity">
          {saved ? <Check size={16} /> : null}
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      )}
    </div>
  );
}
