"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Barrio {
  id: number;
  nombre: string;
  precio: number;
}

interface BarrioAutocompleteProps {
  onSelect: (barrio: { nombre: string; precio: number }) => void;
  selected: string;
}

export default function BarrioAutocomplete({ onSelect, selected }: BarrioAutocompleteProps) {
  const [query, setQuery] = useState(selected);
  const [results, setResults] = useState<Barrio[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setQuery(selected);
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
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/shipping/barrios?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.barrios || []);
      setOpen((data.barrios || []).length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 200);
  };

  const handleSelect = (barrio: Barrio) => {
    setQuery(barrio.nombre);
    setOpen(false);
    onSelect({ nombre: barrio.nombre, precio: barrio.precio });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query && search(query)}
        placeholder="Busca tu barrio..."
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pink-400 focus:outline-none"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-pink-500" />
        </div>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
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
      )}
    </div>
  );
}
