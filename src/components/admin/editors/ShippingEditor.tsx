"use client";

import { useState } from "react";
import { Search, Plus, Save, Trash2, MapPin, Truck, ChevronDown, ChevronUp } from "lucide-react";
import type { DbBarrio, DbShippingNacional } from "@/lib/db";

interface ShippingEditorProps {
  barrios: DbBarrio[];
  nacional: DbShippingNacional[];
  onAddBarrio: (nombre: string, precio: number) => Promise<DbBarrio>;
  onUpdateBarrio: (id: number, updates: { nombre?: string; precio?: number; activo?: boolean }) => Promise<DbBarrio>;
  onRemoveBarrio: (id: number) => Promise<void>;
  onUpdateNacional: (id: number, updates: Partial<DbShippingNacional>) => Promise<DbShippingNacional>;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

// ─── Sub-componente: Editor de Barrios ───
function BarriosEditor({
  barrios,
  onAdd,
  onUpdate,
  onRemove,
}: {
  barrios: DbBarrio[];
  onAdd: (nombre: string, precio: number) => Promise<DbBarrio>;
  onUpdate: (id: number, updates: { nombre?: string; precio?: number }) => Promise<DbBarrio>;
  onRemove: (id: number) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [newNombre, setNewNombre] = useState("");
  const [newPrecio, setNewPrecio] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = barrios.filter(
    (b) => !search || b.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newNombre.trim() || !newPrecio) return;
    setSaving(true);
    try {
      await onAdd(newNombre.trim(), Number(newPrecio));
      setNewNombre("");
      setNewPrecio("");
    } catch {
      // handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (id: number) => {
    setSaving(true);
    try {
      await onUpdate(id, {
        nombre: editNombre.trim() || undefined,
        precio: editPrecio ? Number(editPrecio) : undefined,
      });
      setEditingId(null);
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (b: DbBarrio) => {
    setEditingId(b.id);
    setEditNombre(b.nombre);
    setEditPrecio(String(b.precio));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
          <MapPin size={16} /> Barrios Manizales ({barrios.length})
        </h3>
      </div>

      {/* Buscar */}
      <div className="mb-3 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar barrio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
        />
      </div>

      {/* Agregar nuevo */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nombre del barrio"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
          className="flex-1 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <input
          type="number"
          placeholder="Precio"
          value={newPrecio}
          onChange={(e) => setNewPrecio(e.target.value)}
          className="w-28 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm focus:border-[#D62839] focus:outline-none [appearance:textfield]"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          disabled={saving || !newNombre.trim() || !newPrecio}
          className="rounded-lg bg-[#D62839] px-3 py-2 text-white text-sm font-medium hover:bg-[#b82230] disabled:opacity-50 flex items-center gap-1"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Lista */}
      <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            {editingId === b.id ? (
              <>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#D62839] focus:outline-none"
                />
                <input
                  type="number"
                  value={editPrecio}
                  onChange={(e) => setEditPrecio(e.target.value)}
                  className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#D62839] focus:outline-none [appearance:textfield]"
                />
                <button
                  onClick={() => handleSaveEdit(b.id)}
                  disabled={saving}
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  <Save size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-gray-600 text-xs">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-800 truncate">{b.nombre}</span>
                <span className="text-sm font-mono font-medium text-[#D62839] whitespace-nowrap">
                  {formatPrice(b.precio)}
                </span>
                <button onClick={() => startEdit(b)} className="p-1 text-gray-400 hover:text-gray-700" title="Editar">
                  <Save size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar "${b.nombre}"?`)) onRemove(b.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">Sin resultados</p>
        )}
      </div>
    </div>
  );
}

// ─── Sub-componente: Editor Tabla Nacional ───
function NacionalEditor({
  nacional,
  onUpdate,
}: {
  nacional: DbShippingNacional[];
  onUpdate: (id: number, updates: Partial<DbShippingNacional>) => Promise<DbShippingNacional>;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<DbShippingNacional>>({});
  const [saving, setSaving] = useState(false);

  const zonas = [
    { key: "precio_local" as const, label: "Local" },
    { key: "precio_regional" as const, label: "Regional" },
    { key: "precio_nacional" as const, label: "Nacional" },
    { key: "precio_reexpedido" as const, label: "Reexpedido" },
    { key: "precio_reexpedido_especial" as const, label: "Reexp. Esp." },
  ];

  const startEdit = (fila: DbShippingNacional) => {
    setEditingId(fila.id);
    setEditData({ ...fila });
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    try {
      await onUpdate(id, editData);
      setEditingId(null);
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
        <Truck size={16} /> Tabla Nacional por Kilos ({nacional.length} filas)
      </h3>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Kg</th>
              {zonas.map((z) => (
                <th key={z.key} className="px-3 py-2.5 text-right font-semibold text-gray-600">{z.label}</th>
              ))}
              <th className="px-3 py-2.5 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {nacional.map((fila) => (
              <tr key={fila.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 font-medium text-gray-900">{fila.kilos}</td>
                {zonas.map((z) => (
                  <td key={z.key} className="px-3 py-2 text-right">
                    {editingId === fila.id ? (
                      <input
                        type="number"
                        value={editData[z.key] ?? ""}
                        onChange={(e) => setEditData({ ...editData, [z.key]: Number(e.target.value) || 0 })}
                        className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-xs focus:border-[#D62839] focus:outline-none [appearance:textfield]"
                      />
                    ) : (
                      <span className="font-mono text-xs text-gray-700">{formatPrice(fila[z.key])}</span>
                    )}
                  </td>
                ))}
                <td className="px-3 py-2 text-right">
                  {editingId === fila.id ? (
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => handleSave(fila.id)} disabled={saving} className="p-1 text-green-600 hover:text-green-700">
                        <Save size={14} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-[10px] text-gray-400 hover:text-gray-600">
                        X
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(fila)} className="p-1 text-gray-400 hover:text-[#D62839]" title="Editar fila">
                      <Save size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Componente Principal ───
export default function ShippingEditor({
  barrios,
  nacional,
  onAddBarrio,
  onUpdateBarrio,
  onRemoveBarrio,
  onUpdateNacional,
}: ShippingEditorProps) {
  const [section, setSection] = useState<"barrios" | "nacional">("barrios");

  return (
    <div className="space-y-6">
      {/* Toggle entre secciones */}
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setSection("barrios")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            section === "barrios"
              ? "bg-white text-[#D62839] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MapPin size={16} />
          Master Envíos (Manizales)
        </button>
        <button
          onClick={() => setSection("nacional")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            section === "nacional"
              ? "bg-white text-[#D62839] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Truck size={16} />
          Envía (Nacional)
        </button>
      </div>

      {/* Contenido */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {section === "barrios" ? (
          <BarriosEditor
            barrios={barrios}
            onAdd={onAddBarrio}
            onUpdate={onUpdateBarrio}
            onRemove={onRemoveBarrio}
          />
        ) : (
          <NacionalEditor nacional={nacional} onUpdate={onUpdateNacional} />
        )}
      </div>
    </div>
  );
}
