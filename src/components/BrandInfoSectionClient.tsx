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
  const isValm = brand === "valm-beauty";

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

  return (
    <div className="space-y-10">
      {/* Sobre la tienda */}
      {brandInfo.description && (
        <section
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: isValm ? "#FFF5F7" : "#F8F5FF",
            borderColor: isValm ? "#F5A6B8" : "#B8D4E8",
            borderWidth: 1,
          }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Sparkles
              size={22}
              style={{ color: brandInfo.primaryColor }}
              aria-hidden
            />
            Sobre {brandInfo.name}
          </h2>
          <p className="text-gray-700 leading-relaxed">{brandInfo.description}</p>
        </section>
      )}

      {/* Marcas que manejamos */}
      {brandInfo.brandsCarried && brandInfo.brandsCarried.length > 0 && (
        <section
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: isValm ? "#FFF5F7" : "#F8F5FF",
            borderColor: isValm ? "#F5A6B8" : "#B8D4E8",
            borderWidth: 1,
          }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Package size={22} style={{ color: brandInfo.primaryColor }} aria-hidden />
            Marcas que manejamos
          </h2>
          <div className="flex flex-wrap gap-2">
            {brandInfo.brandsCarried.map((b) => (
              <span
                key={b}
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: brandInfo.primaryColor + "20",
                  color: brandInfo.primaryColor,
                  borderWidth: 1,
                  borderColor: brandInfo.primaryColor + "40",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Categorías */}
      {brandInfo.categories && brandInfo.categories.length > 0 && (
        <section
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: isValm ? "#FFF5F7" : "#F8F5FF",
            borderColor: isValm ? "#F5A6B8" : "#B8D4E8",
            borderWidth: 1,
          }}
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Qué encontrás en {brandInfo.name}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {brandInfo.categories.map((cat) => (
              <li
                key={cat}
                className="flex items-center gap-2 text-gray-700"
              >
                <CheckCircle2
                  size={18}
                  style={{ color: brandInfo.primaryColor }}
                  aria-hidden
                />
                {cat}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Destacados */}
      {brandInfo.highlights && brandInfo.highlights.length > 0 && (
        <section
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: isValm ? "#FFF5F7" : "#F8F5FF",
            borderColor: isValm ? "#F5A6B8" : "#B8D4E8",
            borderWidth: 1,
          }}
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Por qué elegirnos
          </h2>
          <ul className="space-y-3">
            {brandInfo.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-gray-700">
                <Sparkles
                  size={18}
                  className="mt-0.5 shrink-0"
                  style={{ color: brandInfo.primaryColor }}
                  aria-hidden
                />
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Ubicación y contacto */}
      <section
        className="rounded-2xl p-6 sm:p-8"
        style={{
          backgroundColor: isValm ? "#FFF5F7" : "#F8F5FF",
          borderColor: isValm ? "#F5A6B8" : "#B8D4E8",
          borderWidth: 1,
        }}
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Ubicación y contacto
        </h2>
        <div className="space-y-4">
          {brandInfo.address && (
            <a
              href="https://maps.google.com/?q=Cra+23A+60-11+Manizales"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:underline"
            >
              <MapPin
                size={20}
                style={{ color: brandInfo.primaryColor }}
                aria-hidden
              />
              {brandInfo.address}
            </a>
          )}
          {brandInfo.hours && (
            <div className="flex items-center gap-3 text-gray-700">
              <Clock
                size={20}
                style={{ color: brandInfo.primaryColor }}
                aria-hidden
              />
              {brandInfo.hours}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <a
              href={brandInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: brandInfo.primaryColor }}
            >
              <Instagram size={18} aria-hidden />
              @{brandInfo.instagram}
            </a>
            <a
              href={otherBrandInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: otherBrandInfo.primaryColor }}
            >
              <Instagram size={18} aria-hidden />
              @{otherBrandInfo.instagram}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <MessageCircle size={18} aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
