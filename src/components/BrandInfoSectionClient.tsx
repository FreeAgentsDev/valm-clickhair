"use client";

import { useState, useEffect } from "react";
import {
  Instagram,
  MapPin,
  Clock,
  MessageCircle,
  Sparkles,
  Package,
  CheckCircle2,
} from "lucide-react";
import { BRANDS } from "@/lib/brands";
import { storageService } from "@/lib/storage";
import { WHATSAPP_NUMBERS } from "@/types";
import type { BrandSlug } from "@/types";
import type { Brand } from "@/types";

function mergeBrandInfo(
  base: Brand,
  content: { description?: string; brandsCarried?: string[]; categories?: string[]; highlights?: string[] } | null
): Brand {
  if (!content) return base;
  return {
    ...base,
    description: content.description ?? base.description,
    brandsCarried: content.brandsCarried ?? base.brandsCarried,
    categories: content.categories ?? base.categories,
    highlights: content.highlights ?? base.highlights,
  };
}

interface BrandInfoSectionClientProps {
  brand: BrandSlug;
  otherBrand: BrandSlug;
}

export default function BrandInfoSectionClient({
  brand,
  otherBrand,
}: BrandInfoSectionClientProps) {
  const [brandInfo, setBrandInfo] = useState<Brand>(() => BRANDS[brand]);

  useEffect(() => {
    const stored = storageService.getBrandContent([]);
    const content = stored.find((c) => c.brand === brand) ?? null;
    setBrandInfo(mergeBrandInfo(BRANDS[brand], content));
  }, [brand]);

  useEffect(() => {
    const handler = () => {
      const stored = storageService.getBrandContent([]);
      const content = stored.find((c) => c.brand === brand) ?? null;
      setBrandInfo(mergeBrandInfo(BRANDS[brand], content));
    };
    window.addEventListener("storage-update", handler);
    return () => window.removeEventListener("storage-update", handler);
  }, [brand]);

  const whatsappNumber = brandInfo.whatsapp ?? WHATSAPP_NUMBERS[0].number;
  const waUrl = `https://wa.me/57${whatsappNumber.replace(/\D/g, "")}`;
  const otherBrandInfo = BRANDS[otherBrand];

  const sectionClass = "rounded-2xl p-6 sm:p-8 bg-[#FDF2F4] border border-[#F6BCCB]/40";

  return (
    <div className="space-y-6">
      {brandInfo.description && (
        <section className={sectionClass}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Sparkles size={20} className="text-[#E93B3C]" aria-hidden />
            Sobre {brandInfo.name}
          </h2>
          <p className="text-gray-600 leading-relaxed">{brandInfo.description}</p>
        </section>
      )}

      {brandInfo.brandsCarried && brandInfo.brandsCarried.length > 0 && (
        <section className={sectionClass}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Package size={20} className="text-[#E93B3C]" aria-hidden />
            Marcas que manejamos
          </h2>
          <div className="flex flex-wrap gap-2">
            {brandInfo.brandsCarried.map((b) => (
              <span
                key={b}
                className="rounded-full px-4 py-2 text-sm font-medium bg-[#E93B3C]/10 text-[#E93B3C] border border-[#E93B3C]/20"
              >
                {b}
              </span>
            ))}
          </div>
        </section>
      )}

      {brandInfo.categories && brandInfo.categories.length > 0 && (
        <section className={sectionClass}>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Que encontras en {brandInfo.name}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {brandInfo.categories.map((cat) => (
              <li key={cat} className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 size={18} className="text-[#E93B3C]" aria-hidden />
                {cat}
              </li>
            ))}
          </ul>
        </section>
      )}

      {brandInfo.highlights && brandInfo.highlights.length > 0 && (
        <section className={sectionClass}>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Por que elegirnos
          </h2>
          <ul className="space-y-3">
            {brandInfo.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-gray-600">
                <Sparkles size={18} className="mt-0.5 shrink-0 text-[#E93B3C]" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={sectionClass}>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Ubicacion y contacto
        </h2>
        <div className="space-y-4">
          {brandInfo.address && (
            <a
              href="https://maps.google.com/?q=Cra+23A+60-11+Manizales"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-600 hover:text-[#E93B3C] transition-colors"
            >
              <MapPin size={20} className="text-[#E93B3C]" aria-hidden />
              {brandInfo.address}
            </a>
          )}
          {brandInfo.hours && (
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={20} className="text-[#E93B3C]" aria-hidden />
              {brandInfo.hours}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <a
              href={brandInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#E93B3C] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              <Instagram size={16} aria-hidden />
              @{brandInfo.instagram}
            </a>
            <a
              href={otherBrandInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#F6BCCB] px-5 py-2.5 text-sm font-semibold text-[#E93B3C] transition-all hover:opacity-90"
            >
              <Instagram size={16} aria-hidden />
              @{otherBrandInfo.instagram}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
            >
              <MessageCircle size={16} aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
