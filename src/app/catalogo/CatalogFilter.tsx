"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import DbProductCard from "@/components/DbProductCard";
import type { DbProduct } from "@/lib/db";

interface CatalogFilterProps {
  products: DbProduct[];
  categories: string[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function CatalogFilter({ products, categories, initialCategory, initialSearch }: CatalogFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory ?? "todos");
  const [search, setSearch] = useState(initialSearch ?? "");

  // Sincroniza estado local con la URL cuando el usuario navega entre items del navbar
  // estando ya en /catalogo (Next.js re-renderiza con nuevos props pero useState no se reinicia).
  useEffect(() => {
    setSearch(initialSearch ?? "");
  }, [initialSearch]);

  useEffect(() => {
    setActiveCategory(initialCategory ?? "todos");
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== "todos") {
      result = result.filter((p) => p.categoria === activeCategory);
    }
    if (search.trim()) {
      // Soporte multi-keyword: separa por coma y hace OR-match
      const terms = search
        .toLowerCase()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (terms.length) {
        result = result.filter((p) => {
          const haystack = `${p.nombre} ${p.descripcion ?? ""} ${p.categoria} ${p.marca ?? ""}`.toLowerCase();
          return terms.some((t) => haystack.includes(t));
        });
      }
    }
    return result;
  }, [products, activeCategory, search]);

  return (
    <section className="px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ── Search bar ── */}
        <div className="relative mb-6">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[#F6BCCB]/60 bg-[#FDF2F4] py-3.5 pl-11 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#E93B3C]/40 focus:bg-white focus:ring-2 focus:ring-[#E93B3C]/10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar busqueda"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Category pills ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("todos")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              activeCategory === "todos"
                ? "bg-[#E93B3C] text-white shadow-sm shadow-[#E93B3C]/25"
                : "bg-[#FDF2F4] text-gray-500 border border-[#F6BCCB]/50 hover:border-[#E93B3C]/30 hover:text-[#E93B3C]"
            }`}
          >
            Todos · {products.length}
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoria === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 capitalize ${
                  isActive
                    ? "bg-[#E93B3C] text-white shadow-sm shadow-[#E93B3C]/25"
                    : "bg-[#FDF2F4] text-gray-500 border border-[#F6BCCB]/50 hover:border-[#E93B3C]/30 hover:text-[#E93B3C]"
                }`}
              >
                {cat} · {count}
              </button>
            );
          })}
        </div>

        {/* ── Results label ── */}
        <p className="text-xs text-gray-400 font-medium mb-5 uppercase tracking-wide">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "todos" && (
            <> · <span className="text-[#E93B3C]">{activeCategory}</span></>
          )}
          {search && <> · &quot;{search}&quot;</>}
        </p>

        {/* ── Product grid ── */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product, idx) => (
              <DbProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FDF2F4] flex items-center justify-center mb-4">
              <Search size={24} className="text-[#F6BCCB]" />
            </div>
            <p className="text-gray-700 font-semibold">Sin resultados</p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">
              Intenta con otra busqueda o categoria
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("todos"); }}
              className="mt-5 rounded-full bg-[#FDF2F4] border border-[#F6BCCB]/50 px-5 py-2 text-xs font-bold text-[#E93B3C] hover:bg-[#F6BCCB]/20 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
