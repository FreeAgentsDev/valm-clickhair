"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Loader2,
  X,
  Eye,
  EyeOff,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
} from "lucide-react";
import type { PopupConfig } from "@/types";

interface PopupEditorProps {
  config: PopupConfig;
  onSave: (config: PopupConfig) => void;
}

const BG_PRESETS = [
  { label: "Blanco", value: "#ffffff" },
  { label: "Rosa suave", value: "#FDF2F4" },
  { label: "Rosa Valm", value: "#F6BCCB" },
  { label: "Rojo Valm", value: "#E93B3C" },
  { label: "Negro", value: "#111111" },
];

export default function PopupEditor({ config, onSave }: PopupEditorProps) {
  const [draft, setDraft] = useState<PopupConfig>(config);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewImgIdx, setPreviewImgIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const allImages = draft.images?.length
    ? draft.images
    : draft.image
      ? [draft.image]
      : [];

  const isDark =
    draft.bgColor === "#111111" || draft.bgColor === "#E93B3C";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      formData.append("folder", "popup");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const newUrls = data.urls || [];
      const current = draft.images || (draft.image ? [draft.image] : []);
      setDraft({ ...draft, images: [...current, ...newUrls], image: current[0] || newUrls[0] });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error subiendo imagen");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx: number) => {
    const next = [...(draft.images || [])];
    next.splice(idx, 1);
    setDraft({ ...draft, images: next, image: next[0] || undefined });
    if (previewImgIdx >= next.length) setPreviewImgIdx(Math.max(0, next.length - 1));
  };

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(config);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Anuncio popup</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Se muestra al entrar a la tienda (1 vez por sesión)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPreview ? "Ocultar" : "Preview"}
          </button>
        </div>
      </div>

      {/* ── Live Preview ── */}
      {showPreview && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <p className="px-3 py-1.5 text-[10px] font-medium uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
            Vista previa en vivo
          </p>
          <div className="flex items-center justify-center bg-black/5 p-6 sm:p-8">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl relative">
              {/* Close btn */}
              <div className="absolute right-2 top-2 z-10 rounded-full bg-black/30 p-1.5">
                <X size={14} className="text-white" />
              </div>

              {/* Images carousel */}
              {allImages.length > 0 && (
                <div className="relative h-44 w-full bg-gray-100">
                  <Image
                    src={allImages[previewImgIdx] || allImages[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImgIdx(
                            (previewImgIdx - 1 + allImages.length) %
                              allImages.length
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImgIdx(
                            (previewImgIdx + 1) % allImages.length
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {allImages.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              i === previewImgIdx ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                className="p-5"
                style={{ backgroundColor: draft.bgColor || "#ffffff" }}
              >
                {draft.badge && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-2 ${
                      isDark
                        ? "bg-white/20 text-white"
                        : "bg-[#E93B3C]/10 text-[#E93B3C]"
                    }`}
                  >
                    <Sparkles size={10} /> {draft.badge}
                  </span>
                )}
                {draft.title && (
                  <h3
                    className={`text-lg font-bold leading-tight ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {draft.title}
                  </h3>
                )}
                {draft.subtitle && (
                  <p
                    className={`text-sm font-medium mt-0.5 ${
                      isDark ? "text-white/80" : "text-[#E93B3C]"
                    }`}
                  >
                    {draft.subtitle}
                  </p>
                )}
                {draft.content && (
                  <p
                    className={`text-sm mt-2 ${
                      isDark ? "text-white/70" : "text-gray-600"
                    }`}
                  >
                    {draft.content}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {draft.ctaText && (
                    <span
                      className={`inline-block rounded-full px-5 py-2.5 text-sm font-bold ${
                        isDark
                          ? "bg-white text-gray-900"
                          : "bg-[#E93B3C] text-white"
                      }`}
                    >
                      {draft.ctaText}
                    </span>
                  )}
                  {draft.cta2Text && (
                    <span
                      className={`inline-block rounded-full px-5 py-2.5 text-sm font-bold border-2 ${
                        isDark
                          ? "border-white/40 text-white"
                          : "border-[#E93B3C]/30 text-[#E93B3C]"
                      }`}
                    >
                      {draft.cta2Text}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Form ── */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 space-y-5">
        {/* Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={draft.enabled}
            onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
            className={`relative h-8 w-14 rounded-full transition-colors ${
              draft.enabled ? "bg-[#D62839]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                draft.enabled ? "left-7" : "left-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {draft.enabled ? "Popup activo" : "Popup desactivado"}
          </span>
        </div>

        {/* Imágenes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Imágenes ({allImages.length})
            {allImages.length > 1 && (
              <span className="text-xs text-gray-400 font-normal ml-1">
                — se muestran como carrusel
              </span>
            )}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            {allImages.map((img, i) => (
              <div
                key={i}
                className="relative h-20 w-28 rounded-xl overflow-hidden border border-gray-200 group"
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-20 w-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#D62839] hover:text-[#D62839] transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Plus size={20} />
                  <span className="text-[9px] mt-0.5">Subir</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            JPG, PNG, WebP o GIF. Máx 5MB. Se sube a R2.
          </p>
        </div>

        {/* Badge */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Badge / etiqueta
            <span className="text-xs text-gray-400 font-normal ml-1">
              (opcional)
            </span>
          </label>
          <input
            type="text"
            value={draft.badge ?? ""}
            onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
            placeholder="Ej: Nuevo, -30%, Oferta especial"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
          />
        </div>

        {/* Título + Subtítulo */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={draft.title ?? ""}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="¡Bienvenido!"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subtítulo
              <span className="text-xs text-gray-400 font-normal ml-1">
                (opcional)
              </span>
            </label>
            <input
              type="text"
              value={draft.subtitle ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, subtitle: e.target.value })
              }
              placeholder="Ej: Solo por esta semana"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
            />
          </div>
        </div>

        {/* Contenido */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Contenido
          </label>
          <textarea
            value={draft.content ?? ""}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            rows={3}
            placeholder="Descubre nuestras ofertas..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none resize-none"
          />
        </div>

        {/* Color de fondo */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Color de fondo
          </label>
          <div className="flex flex-wrap gap-2">
            {BG_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() =>
                  setDraft({ ...draft, bgColor: preset.value })
                }
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                  (draft.bgColor || "#ffffff") === preset.value
                    ? "border-[#D62839] text-[#D62839]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: preset.value }}
                />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botones CTA */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Botones
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-[10px] font-bold uppercase text-gray-500">
                Botón principal
              </p>
              <input
                type="text"
                value={draft.ctaText ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, ctaText: e.target.value })
                }
                placeholder="Ver productos"
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-[#D62839] focus:outline-none"
              />
              <input
                type="text"
                value={draft.ctaUrl ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, ctaUrl: e.target.value })
                }
                placeholder="URL: /catalogo"
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 focus:border-[#D62839] focus:outline-none"
              />
            </div>
            <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-[10px] font-bold uppercase text-gray-500">
                Botón secundario
                <span className="font-normal ml-1">(opcional)</span>
              </p>
              <input
                type="text"
                value={draft.cta2Text ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, cta2Text: e.target.value })
                }
                placeholder="Ej: Ver ofertas"
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-[#D62839] focus:outline-none"
              />
              <input
                type="text"
                value={draft.cta2Url ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, cta2Url: e.target.value })
                }
                placeholder="URL: /catalogo?oferta=true"
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 focus:border-[#D62839] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Guardar */}
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-[#D62839] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {saved ? <Check size={16} /> : null}
            {saved ? "Guardado" : "Guardar configuración"}
          </button>
        )}
      </div>
    </div>
  );
}
