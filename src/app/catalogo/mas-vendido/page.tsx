import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Flame, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import DbProductCard from "@/components/DbProductCard";
import { applyCategDiscounts } from "@/lib/db";
import { getBestsellers } from "@/lib/bestsellers";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lo más vendido",
  description:
    "Descubre los productos más vendidos en Valm Beauty. Los favoritos de nuestras clientas, listos para llevar.",
  alternates: { canonical: "/catalogo/mas-vendido" },
  openGraph: {
    title: "Lo más vendido | Valm Beauty",
    description: "Los productos favoritos de nuestras clientas.",
    url: "/catalogo/mas-vendido",
    images: ["/og-image.png"],
  },
};

export default async function BestsellersPage() {
  const top = await getBestsellers(12);
  const products = await applyCategDiscounts(top);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden px-4 py-14 sm:py-20"
          style={{ background: "linear-gradient(160deg, #FFF5F8 0%, #F6BCCB 50%, #FDF2F4 80%, #ffffff 100%)" }}
        >
          {/* Decoración de marca (igual que catálogo/home) */}
          <img
            src="/logos/decoracion-logo.svg"
            alt=""
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
          />

          {/* Flamitas brand scattered en el fondo */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
            <Flame className="absolute top-6 left-[6%] h-10 w-10 sm:h-14 sm:w-14 text-[#E93B3C]/15 -rotate-12" strokeWidth={2} />
            <Flame className="absolute top-[18%] right-[8%] h-12 w-12 sm:h-16 sm:w-16 text-[#E93B3C]/20 rotate-6" strokeWidth={2} fill="currentColor" />
            <Flame className="absolute top-[60%] left-[10%] h-14 w-14 sm:h-20 sm:w-20 text-[#E93B3C]/12 rotate-12" strokeWidth={2} />
            <Flame className="absolute bottom-6 right-[12%] h-10 w-10 sm:h-14 sm:w-14 text-[#E93B3C]/18 -rotate-6" strokeWidth={2} fill="currentColor" />
            <Flame className="absolute top-[42%] left-[48%] h-8 w-8 sm:h-10 sm:w-10 text-[#E93B3C]/10 rotate-3" strokeWidth={2} />
            <Flame className="absolute bottom-[28%] right-[42%] h-9 w-9 sm:h-12 sm:w-12 text-[#E93B3C]/14 -rotate-12" strokeWidth={2} fill="currentColor" />
          </div>

          {/* Blobs sutiles */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-[#E93B3C]/8 blur-3xl animate-blob" />
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-[#F6BCCB]/50 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

          <div className="relative mx-auto max-w-7xl">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E93B3C] hover:gap-2.5 transition-all mb-8"
            >
              <ArrowLeft size={14} /> Ver catálogo completo
            </Link>

            <div className="flex flex-col items-center text-center">
              {/* Logo wordmark grande */}
              <Image
                src="/logos/logo.svg"
                alt="Valm Beauty"
                width={400}
                height={134}
                className="h-24 sm:h-32 w-auto object-contain mix-blend-multiply mb-5"
                priority
              />

              {/* Pill TOP VENTAS con dos flamitas */}
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#E93B3C]/20 bg-white/90 px-4 py-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.3em] text-[#E93B3C] shadow-sm backdrop-blur-sm mb-4">
                <Flame size={12} strokeWidth={2.5} /> Top ventas <Flame size={12} strokeWidth={2.5} />
              </span>

              {/* Título grande */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
                Lo más <span className="text-[#E93B3C]">vendido</span>
              </h1>

              <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-md">
                {products.length > 0
                  ? `Los ${products.length} favoritos absolutos de nuestras clientas`
                  : "Pronto verás aquí los productos más vendidos"}
              </p>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="px-4 py-8 sm:py-10">
          <div className="mx-auto max-w-7xl">
            {products.length > 0 ? (
              <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product, idx) => (
                  <DbProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FDF2F4] flex items-center justify-center mb-4">
                  <Flame size={24} className="text-[#F6BCCB]" />
                </div>
                <p className="text-gray-700 font-semibold">Sin productos aún</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                  Explora el catálogo completo mientras tanto
                </p>
                <Link
                  href="/catalogo"
                  className="mt-5 inline-flex items-center gap-2 bg-[#E93B3C] text-white px-5 py-2.5 rounded-full font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Ir al catálogo
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
