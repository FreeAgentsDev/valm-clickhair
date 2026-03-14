"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { BRANDS } from "@/lib/brands";
import type { Product } from "@/types";

interface CatalogTabsProps {
  valmProducts: Product[];
  clickProducts: Product[];
}

export default function CatalogTabs({ valmProducts, clickProducts }: CatalogTabsProps) {
  const [activeTab, setActiveTab] = useState<"valm-beauty" | "click-hair">("valm-beauty");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const allProducts = activeTab === "valm-beauty" ? valmProducts : clickProducts;
  const products = allProducts.slice(0, 4);

  function switchTab(tab: "valm-beauty" | "click-hair") {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 250);
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {(["valm-beauty", "click-hair"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`group relative flex items-center gap-3 rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-bold transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#E93B3C] text-white shadow-lg shadow-[#E93B3C]/25"
                : "bg-white text-gray-500 border-2 border-[#F6BCCB]/50 hover:border-[#E93B3C]/30 hover:text-gray-700 hover:shadow-md"
            }`}
          >
            <div className={`relative h-7 w-7 shrink-0 overflow-hidden rounded-full transition-all duration-300 ${
              activeTab === tab ? "border-2 border-white/40 shadow-sm" : "border-2 border-[#F6BCCB]"
            }`}>
              <Image src={BRANDS[tab].logo} alt="" fill className="object-cover" sizes="28px" />
            </div>
            {BRANDS[tab].name}
          </button>
        ))}
      </div>

      {/* Grid con transicion */}
      <div
        ref={gridRef}
        className="transition-all duration-300"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(12px)" : "none",
        }}
      >
        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Ver catalogo completo */}
      <div className="text-center mt-12">
        <Link
          href={`/${activeTab}`}
          className="group inline-flex items-center gap-2.5 bg-[#E93B3C] text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all hover:shadow-xl hover:shadow-[#E93B3C]/30 hover:scale-[1.03]"
        >
          Ver catalogo completo de {BRANDS[activeTab].name}
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-3 text-gray-400 text-xs">
          {allProducts.length} productos disponibles
        </p>
      </div>
    </div>
  );
}
