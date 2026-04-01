"use client";

import { useState, useEffect } from "react";
import { Check, Sparkles, ArrowRight, MessageCircle, Star, Package } from "lucide-react";
import type { HeroContent } from "@/lib/admin-storage";

interface HeroContentEditorProps {
  content: HeroContent;
  onSave: (content: HeroContent) => void;
  loading: boolean;
}

export default function HeroContentEditor({
  content,
  onSave,
  loading,
}: HeroContentEditorProps) {
  const [draft, setDraft] = useState<HeroContent>(content);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(content);

  if (loading) {
    return <div className="text-gray-500 animate-pulse text-sm">Cargando contenido...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Contenido de la página principal</h3>
        <p className="text-xs text-gray-500 mt-0.5">Edita los textos del hero, catálogo y sección &ldquo;sobre nosotros&rdquo;</p>
      </div>

      {/* ── Mini Preview ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <p className="px-3 py-1.5 text-[10px] font-medium uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
          Vista previa del hero
        </p>
        <div className="relative p-6 sm:p-8 text-center" style={{ background: "linear-gradient(180deg, #F6BCCB 0%, #F9CDD7 60%, #FDF2F4 100%)" }}>
          <p className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 text-[#E93B3C] text-[10px] font-bold tracking-[0.15em] uppercase mb-3 border border-[#F6BCCB]/50">
            <Sparkles size={10} /> {draft.badge}
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            {draft.title}
            <span className="block bg-gradient-to-r from-[#E93B3C] to-[#F6BCCB] bg-clip-text text-transparent mt-0.5">
              {draft.titleHighlight}
            </span>
          </h2>
          <p className="mt-2 text-xs text-gray-600 max-w-xs mx-auto">{draft.subtitle}</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#E93B3C] text-white px-4 py-1.5 rounded-full text-[10px] font-bold">
              {draft.ctaText} <ArrowRight size={10} />
            </span>
            <span className="inline-flex items-center gap-1 bg-white text-[#E93B3C] px-4 py-1.5 rounded-full text-[10px] font-bold border border-[#E93B3C]/20">
              <MessageCircle size={10} /> {draft.ctaWhatsappText}
            </span>
          </div>
        </div>
      </div>

      {/* ── Form fields ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Badge (etiqueta superior)</label>
          <input type="text" value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Título principal</label>
          <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Título destacado (color)</label>
          <input type="text" value={draft.titleHighlight} onChange={(e) => setDraft({ ...draft, titleHighlight: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Subtítulo</label>
          <textarea value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none resize-none" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Botón principal</label>
          <input type="text" value={draft.ctaText} onChange={(e) => setDraft({ ...draft, ctaText: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Botón WhatsApp</label>
          <input type="text" value={draft.ctaWhatsappText} onChange={(e) => setDraft({ ...draft, ctaWhatsappText: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
        </div>
      </div>

      {/* ── Preview Catálogo ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <p className="px-3 py-1.5 text-[10px] font-medium uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
          Vista previa de catálogo
        </p>
        <div className="bg-white p-6 text-center space-y-6">
          {/* Categorías */}
          <div>
            <p className="text-[#E93B3C] text-[10px] font-bold tracking-[0.15em] uppercase mb-1">Categorias</p>
            <h3 className="text-lg font-extrabold text-gray-900">{draft.categoriesTitle}</h3>
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
              {["Skincare", "Capilares", "Exfoliantes"].map((c) => (
                <span key={c} className="rounded-xl bg-[#FDF2F4] border border-[#F6BCCB]/30 px-3 py-1.5 text-[10px] font-medium text-gray-600">{c}</span>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100" />
          {/* Productos */}
          <div className="bg-[#FDF2F4] rounded-xl p-4">
            <p className="text-[#E93B3C] text-[10px] font-bold tracking-[0.15em] uppercase mb-1">Nuestros Productos</p>
            <h3 className="text-lg font-extrabold text-gray-900">{draft.catalogTitle}</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">{draft.catalogSubtitle}</p>
            <div className="mt-3 flex justify-center gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-12 rounded-lg bg-[#F6BCCB]/30 flex items-center justify-center">
                  <Package size={14} className="text-[#E93B3C]/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección catálogo */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sección catálogo</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Título categorías</label>
            <input type="text" value={draft.categoriesTitle} onChange={(e) => setDraft({ ...draft, categoriesTitle: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Título catálogo</label>
            <input type="text" value={draft.catalogTitle} onChange={(e) => setDraft({ ...draft, catalogTitle: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Subtítulo catálogo</label>
            <input type="text" value={draft.catalogSubtitle} onChange={(e) => setDraft({ ...draft, catalogSubtitle: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
          </div>
        </div>
      </div>

      {/* ── Preview Sobre Nosotros ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <p className="px-3 py-1.5 text-[10px] font-medium uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
          Vista previa de sobre nosotros
        </p>
        <div className="bg-white p-6">
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Mini collage placeholder */}
            <div className="grid grid-cols-2 gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-[#FDF2F4] border border-[#F6BCCB]/30 flex items-center justify-center">
                  <Star size={12} className="text-[#F6BCCB]" />
                </div>
              ))}
            </div>
            {/* Texto */}
            <div>
              <p className="text-[#E93B3C] text-[10px] font-bold tracking-[0.15em] uppercase mb-1">Sobre Nosotros</p>
              <h3 className="text-sm font-extrabold text-gray-900 leading-tight">{draft.aboutTitle}</h3>
              <p className="mt-1.5 text-[10px] text-gray-600 leading-relaxed line-clamp-3">{draft.aboutText}</p>
              <div className="mt-2 flex gap-1.5">
                {[{ n: "100+", l: "Productos" }, { n: "8+", l: "Marcas" }, { n: "100%", l: "Originales" }].map((s) => (
                  <div key={s.l} className="text-center p-1.5 rounded-lg bg-[#FDF2F4] border border-[#F6BCCB]/30 flex-1">
                    <p className="text-xs font-extrabold text-[#E93B3C]">{s.n}</p>
                    <p className="text-[8px] text-gray-500">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección sobre nosotros */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sobre nosotros</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
            <input type="text" value={draft.aboutTitle} onChange={(e) => setDraft({ ...draft, aboutTitle: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Texto</label>
            <textarea value={draft.aboutText} onChange={(e) => setDraft({ ...draft, aboutText: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none resize-none" />
          </div>
        </div>
      </div>

      {/* Guardar */}
      {hasChanges && (
        <button onClick={handleSave} className="flex items-center gap-1.5 rounded-lg bg-[#D62839] px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity">
          {saved ? <Check size={16} /> : null}
          {saved ? "Guardado" : "Guardar cambios"}
        </button>
      )}
    </div>
  );
}
