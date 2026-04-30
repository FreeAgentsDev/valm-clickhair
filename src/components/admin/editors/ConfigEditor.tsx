"use client";

import { useState, useEffect } from "react";
import { Settings, Truck, Save, Loader2, Check } from "lucide-react";
import type { SiteConfig } from "@/lib/admin-storage";

interface ConfigEditorProps {
  config: SiteConfig;
  loading: boolean;
  onSave: (next: SiteConfig) => Promise<SiteConfig>;
}

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

export default function ConfigEditor({ config, loading, onSave }: ConfigEditorProps) {
  const [draft, setDraft] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const dirty =
    draft.freeShippingEnabled !== config.freeShippingEnabled ||
    draft.freeShippingThreshold !== config.freeShippingThreshold;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(draft);
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2200);
    } catch {
      // error manejado en hook
    } finally {
      setSaving(false);
    }
  };

  let helperMessage: { text: string; tone: "info" | "warn" | "success" };
  if (!draft.freeShippingEnabled) {
    helperMessage = {
      text: "El envío gratis está desactivado. Todas las órdenes pagarán envío según tarifa.",
      tone: "warn",
    };
  } else if (draft.freeShippingThreshold === 0) {
    helperMessage = {
      text: "Threshold = $0: TODAS las órdenes tendrán envío gratis sin importar el valor.",
      tone: "success",
    };
  } else {
    helperMessage = {
      text: `Las órdenes con subtotal mayor o igual a ${formatCOP(draft.freeShippingThreshold)} tendrán envío gratis.`,
      tone: "info",
    };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D62839]/10">
          <Settings size={20} className="text-[#D62839]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Configuración general</h3>
          <p className="text-sm text-gray-500">
            Ajustes que afectan el comportamiento de toda la tienda
          </p>
        </div>
      </div>

      {/* Card: Envío gratis */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDF2F4]">
            <Truck size={18} className="text-[#D62839]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900">Envío gratis</h4>
            <p className="text-sm text-gray-500">
              Define cuándo se aplica envío gratuito automáticamente
            </p>
          </div>
        </div>

        {/* Toggle */}
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all mb-4 ${
            draft.freeShippingEnabled
              ? "border-[#D62839] bg-[#D62839]/5"
              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold ${
                draft.freeShippingEnabled ? "text-[#D62839]" : "text-gray-700"
              }`}
            >
              Habilitar envío gratis
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              Si está apagado, ningún pedido tendrá envío gratuito
            </span>
          </div>
          <input
            type="checkbox"
            checked={draft.freeShippingEnabled}
            onChange={(e) => setDraft({ ...draft, freeShippingEnabled: e.target.checked })}
            className="sr-only"
          />
          <div
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
              draft.freeShippingEnabled ? "bg-[#D62839]" : "bg-gray-300"
            }`}
            aria-hidden
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                draft.freeShippingEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
        </label>

        {/* Threshold */}
        <div className={draft.freeShippingEnabled ? "" : "opacity-50 pointer-events-none"}>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Monto mínimo para envío gratis (COP)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
              $
            </span>
            <input
              type="number"
              min={0}
              step={1000}
              value={draft.freeShippingThreshold}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  freeShippingThreshold: Math.max(0, Number(e.target.value) || 0),
                })
              }
              disabled={!draft.freeShippingEnabled}
              className="w-full rounded-lg border border-gray-200 bg-white pl-7 pr-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none [appearance:textfield] disabled:bg-gray-100"
              placeholder="200000"
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            Usa <strong>0</strong> si quieres que todos los envíos sean gratis
          </p>
        </div>

        {/* Helper message */}
        <div
          className={`mt-4 rounded-lg p-3 text-xs ${
            helperMessage.tone === "warn"
              ? "border border-amber-200 bg-amber-50 text-amber-800"
              : helperMessage.tone === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {helperMessage.text}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={loading || saving || !dirty}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-[#D62839] py-3 font-medium text-white transition-all hover:opacity-90 shadow-md disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : savedAt ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Guardando..." : savedAt ? "Guardado" : dirty ? "Guardar cambios" : "Sin cambios"}
        </button>
      </div>
    </div>
  );
}
