"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";

interface Barrio {
  id: number;
  nombre: string;
  precio: number;
}

interface BarrioAutocompleteProps {
  onSelect: (barrio: { nombre: string; precio: number } | null) => void;
  selected: string;
  error?: boolean;
}

export default function BarrioAutocomplete({ onSelect, selected, error }: BarrioAutocompleteProps) {
  const [query, setQuery] = useState(selected);
  const [results, setResults] = useState<Barrio[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [confirmed, setConfirmed] = useState(selected);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setQuery(selected);
    setConfirmed(selected);
  }, [selected]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/shipping/barrios?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.barrios || []);
      setOpen(true);
    } catch {
      setResults([]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    // Si el usuario edita después de seleccionar, invalidar la selección
    if (confirmed && value !== confirmed) {
      setConfirmed("");
      onSelect(null);
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 200);
  };

  const handleSelect = (barrio: Barrio) => {
    setQuery(barrio.nombre);
    setConfirmed(barrio.nombre);
    setOpen(false);
    onSelect({ nombre: barrio.nombre, precio: barrio.precio });
  };

  const handleClear = () => {
    setQuery("");
    setConfirmed("");
    setResults([]);
    setOpen(false);
    setHasSearched(false);
    onSelect(null);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const isSelected = Boolean(confirmed) && query === confirmed;
  const showError = Boolean(error) && !isSelected;

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => search(query)}
          placeholder="Escribe y selecciona tu barrio..."
          aria-invalid={showError}
          className={`w-full rounded-xl border px-9 py-3 text-sm focus:outline-none transition-colors ${
            showError
              ? "border-red-400 focus:border-red-500 bg-red-50/40"
              : isSelected
                ? "border-green-400 focus:border-green-500 bg-green-50/30"
                : "border-gray-200 focus:border-pink-400"
          }`}
        />
        {loading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-pink-500" />
          </div>
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar barrio"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((barrio) => (
                <li key={barrio.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(barrio)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-pink-50 transition-colors text-left"
                  >
                    <span className="text-gray-900">{barrio.nombre}</span>
                    <span className="text-pink-600 font-medium">{formatPrice(barrio.precio)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : hasSearched && !loading ? (
            <div className="px-4 py-3 text-sm text-gray-600">
              No encontramos <strong>&ldquo;{query}&rdquo;</strong> en nuestra lista de barrios.
              Verifica el nombre o escríbenos por WhatsApp para confirmar la cobertura.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
