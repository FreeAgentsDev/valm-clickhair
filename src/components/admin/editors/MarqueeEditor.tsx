"use client";

import { useState, useEffect } from "react";
import { Plus, X, GripVertical, ArrowUp, ArrowDown, Check } from "lucide-react";

interface MarqueeEditorProps {
  messages: string[];
  onSave: (messages: string[]) => void;
  loading: boolean;
}

export default function MarqueeEditor({
  messages,
  onSave,
  loading,
}: MarqueeEditorProps) {
  const [draft, setDraft] = useState<string[]>(messages);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(messages);
  }, [messages]);

  const handleChange = (index: number, value: string) => {
    const next = [...draft];
    next[index] = value;
    setDraft(next);
  };

  const handleAdd = () => {
    setDraft([...draft, ""]);
  };

  const handleRemove = (index: number) => {
    setDraft(draft.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...draft];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setDraft(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === draft.length - 1) return;
    const next = [...draft];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setDraft(next);
  };

  const handleSave = () => {
    const filtered = draft.filter((m) => m.trim());
    onSave(filtered);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges =
    JSON.stringify(draft.filter((m) => m.trim())) !==
    JSON.stringify(messages);

  if (loading) {
    return (
      <div className="text-gray-500 animate-pulse text-sm">
        Cargando mensajes...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Mensajes del header (marquee)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Estos mensajes aparecen en la barra superior de la tienda
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-gray-200 bg-[#F6BCCB]/30 overflow-hidden">
        <p className="px-3 py-1.5 text-[10px] font-medium uppercase text-gray-500 bg-white/60 border-b border-gray-200">
          Vista previa
        </p>
        <div className="overflow-hidden py-2">
          <div className="flex animate-marquee whitespace-nowrap w-max">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center">
                {draft
                  .filter((m) => m.trim())
                  .map((msg, idx) => (
                    <span key={idx} className="flex items-center">
                      <span className="mx-6 text-xs font-semibold text-[#E93B3C] tracking-wide">
                        {msg}
                      </span>
                      <span className="mx-2 text-[#E93B3C]/40">·</span>
                    </span>
                  ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-2">
        {draft.map((msg, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <GripVertical size={16} className="text-gray-300 shrink-0" />
            <input
              type="text"
              value={msg}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#D62839] focus:outline-none"
            />
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Mover arriba"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleMoveDown(index)}
                disabled={index === draft.length - 1}
                className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Mover abajo"
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Eliminar"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Plus size={16} />
          Agregar mensaje
        </button>

        {hasChanges && (
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-[#D62839] px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {saved ? <Check size={16} /> : null}
            {saved ? "Guardado" : "Guardar cambios"}
          </button>
        )}
      </div>
    </div>
  );
}
