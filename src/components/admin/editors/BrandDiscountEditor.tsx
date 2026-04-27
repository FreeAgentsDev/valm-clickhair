"use client";

import { useState } from "react";
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Save, Loader2 } from "lucide-react";
import type { DbBrandDiscount, DbBrand } from "@/lib/db";

interface BrandDiscountEditorProps {
  discounts: DbBrandDiscount[];
  brands: DbBrand[];
  onUpsert: (marca: string, descuento: number) => Promise<DbBrandDiscount>;
  onToggle: (id: number, activo: boolean) => Promise<DbBrandDiscount>;
  onDelete: (id: number) => Promise<void>;
}

export default function BrandDiscountEditor({
  discounts,
  brands,
  onUpsert,
  onToggle,
  onDelete,
}: BrandDiscountEditorProps) {
  const [newMarca, setNewMarca] = useState("");
  const [newDescuento, setNewDescuento] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const allBrands = Array.from(
    new Set([
      ...brands.map((b) => b.nombre),
      ...discounts.map((d) => d.marca),
    ])
  ).filter(Boolean);

  const availableBrands = allBrands.filter(
    (b) => !discounts.some((d) => d.marca === b)
  );

  const handleAdd = async () => {
    if (!newMarca.trim() || newDescuento <= 0 || newDescuento > 100) return;
    setSaving(true);
    try {
      await onUpsert(newMarca.trim(), newDescuento);
      setNewMarca("");
      setNewDescuento(0);
    } catch {
      // handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (d: DbBrandDiscount) => {
    setTogglingId(d.id);
    try {
      await onToggle(d.id, !d.activo);
    } catch {
      // handled by parent
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (d: DbBrandDiscount) => {
    if (!confirm(`¿Eliminar el descuento de "${d.marca}"?`)) return;
    setDeletingId(d.id);
    try {
      await onDelete(d.id);
    } catch {
      // handled by parent
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D62839]/10">
          <Tag size={20} className="text-[#D62839]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Descuentos por Marca</h3>
          <p className="text-sm text-gray-500">
            Aplica un porcentaje de descuento a todos los productos de una marca
          </p>
        </div>
      </div>

      {/* Add new discount */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
          <Plus size={16} /> Nuevo descuento
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Marca</label>
            <select
              value={newMarca}
              onChange={(e) => setNewMarca(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none"
            >
              <option value="">— Selecciona una marca —</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {availableBrands.length === 0 && brands.length > 0 && (
              <p className="mt-1 text-[11px] text-gray-400">Todas las marcas ya tienen un descuento. Crea nuevas marcas en la pestaña Productos.</p>
            )}
            {brands.length === 0 && (
              <p className="mt-1 text-[11px] text-gray-400">No hay marcas creadas. Agrega marcas desde la pestaña Productos.</p>
            )}
          </div>
          <div className="w-full sm:w-32">
            <label className="block text-xs font-medium text-gray-600 mb-1">Descuento (%)</label>
            <input
              type="number"
              value={newDescuento || ""}
              onChange={(e) => setNewDescuento(Number(e.target.value) || 0)}
              placeholder="0"
              min="1"
              max="100"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#D62839] focus:outline-none [appearance:textfield]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={saving || !newMarca.trim() || newDescuento <= 0}
              className="flex items-center gap-2 rounded-xl bg-[#D62839] px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Aplicar
            </button>
          </div>
        </div>
      </div>

      {/* Existing discounts */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Descuentos activos ({discounts.length})
          </h4>
        </div>

        {discounts.length === 0 ? (
          <div className="py-12 text-center">
            <Tag size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">No hay descuentos por marca configurados</p>
            <p className="text-xs text-gray-300 mt-1">Agrega uno arriba para comenzar</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {discounts.map((d) => (
              <div
                key={d.id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                  d.activo ? "bg-white" : "bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{d.marca}</p>
                  <p className="text-xs text-gray-400">
                    {d.activo ? "Activo" : "Inactivo"} · Creado{" "}
                    {d.created_at
                      ? new Date(d.created_at).toLocaleDateString("es-CO")
                      : "—"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ${
                    d.activo
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  -{d.descuento}%
                </span>

                <button
                  onClick={() => handleToggle(d)}
                  disabled={togglingId === d.id}
                  className="shrink-0 text-gray-400 hover:text-[#D62839] transition-colors disabled:opacity-50"
                  title={d.activo ? "Desactivar" : "Activar"}
                >
                  {togglingId === d.id ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : d.activo ? (
                    <ToggleRight size={28} className="text-green-600" />
                  ) : (
                    <ToggleLeft size={28} />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(d)}
                  disabled={deletingId === d.id}
                  className="shrink-0 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  {deletingId === d.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">¿Cómo funciona?</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-amber-700">
          <li>El descuento se aplica automáticamente a todos los productos de la marca seleccionada</li>
          <li>Si un producto ya tiene un descuento individual, se mantiene el del producto</li>
          <li>Si una marca y una categoría tienen descuento simultáneo, gana el mayor</li>
          <li>Puedes activar/desactivar descuentos sin eliminarlos</li>
        </ul>
      </div>
    </div>
  );
}
