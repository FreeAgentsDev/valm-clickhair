import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  MapPin,
  Clock,
  MessageCircle,
  Sparkles,
  Package,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { BRANDS } from "@/lib/brands";
import { PRODUCTS } from "@/lib/products";
import { WHATSAPP_NUMBERS } from "@/types";
import type { BrandSlug } from "@/types";

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

function BrandInfoSection({
  brandInfo,
  isValm,
}: {
  brandInfo: (typeof BRANDS)[BrandSlug];
  isValm: boolean;
}) {
  const whatsappNumber = brandInfo.whatsapp ?? WHATSAPP_NUMBERS[0].number;
  const waUrl = `https://wa.me/57${whatsappNumber.replace(/\D/g, "")}`;

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

      {/* Marcas que manejamos (solo Valm) */}
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

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const validBrand = ["valm-beauty", "click-hair"].includes(brand);

  if (!validBrand) notFound();

  const brandInfo = BRANDS[brand as BrandSlug];
  const products = PRODUCTS.filter((p) => p.brand === brand);

  const isValm = brand === "valm-beauty";

  return (
    <div
      className="min-h-screen"
      style={{
        background: isValm
          ? "linear-gradient(180deg, #FDF2F4 0%, #ffffff 30%)"
          : "linear-gradient(180deg, #F5F0FA 0%, #ffffff 30%)",
      }}
    >
      <Header brand={brand as BrandSlug} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div
          className="mb-12 rounded-2xl p-8 text-white shadow-lg"
          style={{
            background: isValm
              ? `linear-gradient(135deg, ${brandInfo.primaryColor}, ${brandInfo.secondaryColor})`
              : "linear-gradient(135deg, #9B8FD9, #B8D4E8, #F5C6D6)",
          }}
        >
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-white/20 shadow-lg ring-2 ring-white/30">
              <Image
                src={brandInfo.logo}
                alt={brandInfo.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold drop-shadow-sm sm:text-4xl">
                {brandInfo.name}
              </h1>
              <p className="mt-2 text-white/95">{brandInfo.tagline}</p>
              <a
                href={brandInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/25 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/35"
              >
                <Instagram size={18} aria-hidden />
                @{brandInfo.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* Info de la tienda */}
        <div className="mb-12">
          <BrandInfoSection brandInfo={brandInfo} isValm={isValm} />
        </div>

        {/* Productos */}
        <section aria-labelledby="products-heading">
          <div className="mb-6 flex items-center justify-between">
            <h2 id="products-heading" className="text-2xl font-bold text-gray-900">
              Productos
            </h2>
            <Link
              href="/"
              className="text-sm font-medium hover:underline"
              style={{ color: brandInfo.primaryColor }}
            >
              ← Ver todas las marcas
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
