"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { PopupConfig } from "@/types";

interface PopupEditorProps {
  config: PopupConfig;
  onSave: (config: PopupConfig) => void;
}

export default function PopupEditor({ config, onSave }: PopupEditorProps) {
  const [draft, setDraft] = useState<PopupConfig>(config);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const handleSave = () => {
    onSave(draft);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft({ ...draft, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Anuncio popup al iniciar la página
      </h2>

      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        {/* Habilitar */}
        <div className="mb-6 flex items-center gap-3">
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
            {draft.enabled ? "Popup habilitado" : "Popup deshabilitado"}
          </span>
        </div>

        {/* Vista previa */}
        {draft.enabled && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-medium uppercase text-gray-500">
              Vista previa
            </p>
            <div className="max-w-sm overflow-hidden rounded-lg bg-white shadow">
              {draft.image && (
                <div className="relative h-24 w-full bg-gray-100">
                  <Image
                    src={draft.image}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={draft.image.startsWith("data:")}
                  />
                </div>
              )}
              <div className="p-3">
                {draft.title && (
                  <p className="font-bold text-gray-900">{draft.title}</p>
                )}
                {draft.content && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {draft.content}
                  </p>
                )}
                {draft.ctaText && (
                  <span className="mt-2 inline-block rounded bg-[#D62839] px-3 py-1 text-xs font-medium text-white">
                    {draft.ctaText}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campos */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={draft.title ?? ""}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="¡Bienvenido!"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              value={draft.content ?? ""}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              rows={3}
              placeholder="Descubre nuestras ofertas..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Imagen
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              {draft.image ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={draft.image}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={draft.image.startsWith("data:")}
                  />
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, image: undefined })}
                    className="absolute right-1 top-1 rounded bg-black/50 p-1 text-white"
                  >
                    ×
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                {draft.image ? "Cambiar imagen" : "Subir imagen"}
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Texto del botón
              </label>
              <input
                type="text"
                value={draft.ctaText ?? ""}
                onChange={(e) => setDraft({ ...draft, ctaText: e.target.value })}
                placeholder="Ver productos"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                URL del botón
              </label>
              <input
                type="text"
                value={draft.ctaUrl ?? ""}
                onChange={(e) => setDraft({ ...draft, ctaUrl: e.target.value })}
                placeholder="/"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 rounded-lg bg-[#D62839] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}
