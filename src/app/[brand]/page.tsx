import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Instagram, ArrowLeft, ShoppingCart, Filter } from "lucide-react";
import Header from "@/components/Header";
import ProductsGridClient from "@/components/ProductsGridClient";
import { BRANDS } from "@/lib/brands";
import { PRODUCTS } from "@/lib/products";
import type { BrandSlug } from "@/types";

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const validBrand = ["valm-beauty", "click-hair"].includes(brand);
  if (!validBrand) notFound();

  const brandInfo = BRANDS[brand as BrandSlug];
  const products = PRODUCTS.filter((p) => p.brand === brand);
  const categories = [...new Set(products.map((p) => p.category))];
  const otherBrand = brand === "valm-beauty" ? "click-hair" : "valm-beauty";

  return (
    <div className="min-h-screen bg-[#FDF2F4]">
      <Header brand={brand as BrandSlug} />

      <main>
        {/* Hero compacto */}
        <section className="bg-[#E93B3C] px-4 py-10 sm:py-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#F6BCCB]/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl bg-white/15 shadow-lg border-2 border-white/20">
                <Image src={brandInfo.logo} alt={brandInfo.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href="/" className="inline-flex items-center gap-1 text-white/60 text-xs font-semibold hover:text-white/80 transition-colors mb-2">
                  <ArrowLeft size={14} /> Volver al inicio
                </Link>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {brandInfo.name}
                </h1>
                <p className="mt-1 text-white/70 text-sm sm:text-base">{brandInfo.tagline}</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={brandInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 border border-white/15"
                >
                  <Instagram size={16} /> @{brandInfo.instagram}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="bg-white border-b border-[#F6BCCB]/30 px-4 py-4">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="text-sm text-gray-600">
                <span className="font-extrabold text-gray-900">{products.length}</span> productos
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-extrabold text-gray-900">{categories.length}</span> categorias
              </p>
            </div>
            <Link
              href={`/${otherBrand}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#E93B3C] bg-[#FDF2F4] px-4 py-2 rounded-full border border-[#F6BCCB]/40 hover:shadow-sm transition-all"
            >
              <div className="relative h-5 w-5 overflow-hidden rounded-full">
                <Image src={BRANDS[otherBrand].logo} alt="" fill className="object-cover" sizes="20px" />
              </div>
              Ver {BRANDS[otherBrand].name}
            </Link>
          </div>
        </div>

        {/* Grid de productos */}
        <section className="px-4 py-10 sm:py-14" aria-labelledby="products-heading">
          <div className="mx-auto max-w-7xl">
            <h2 id="products-heading" className="sr-only">Productos de {brandInfo.name}</h2>
            <ProductsGridClient brand={brand as BrandSlug} initialProducts={products} />
          </div>
        </section>

        {/* CTA WhatsApp */}
        <section className="px-4 pb-14">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-white border-2 border-[#F6BCCB]/40 p-8 sm:p-10 text-center">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                No encuentras lo que buscas?
              </h3>
              <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">
                Escribenos por WhatsApp y te asesoramos con el producto perfecto para ti.
              </p>
              <a
                href={`https://wa.me/57${brandInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-[#E93B3C] text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#E93B3C]/25 hover:scale-[1.02]"
              >
                <ShoppingCart size={18} /> Pedir por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
