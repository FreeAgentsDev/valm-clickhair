import Image from "next/image";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import { getProducts, getCategories } from "@/lib/db";
import CatalogFilter from "./CatalogFilter";

export const revalidate = 60;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const [products, categories, params] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);
  const initialCategory = params.categoria ?? "todos";
  const categoryNames = categories.map((c) => c.nombre).filter((n) => n !== "todos");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden px-4 py-12 sm:py-16"
          style={{ background: "linear-gradient(160deg, #FFF5F8 0%, #F6BCCB 50%, #FDF2F4 80%, #ffffff 100%)" }}
        >
          {/* Decoración brandbook */}
          <img
            src="/logos/decoracion-logo.svg"
            alt=""
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
          />
          {/* Blobs */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-[#E93B3C]/8 blur-3xl animate-blob" />
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-[#F6BCCB]/50 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              {/* Left: title */}
              <div className="flex items-center gap-4">
                <div>
                  <Image src="/logos/logo-navbar.svg" alt="Valm Beauty" width={150} height={50} className="h-11 w-auto object-contain mix-blend-multiply mb-2" />
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Catalogo completo
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    <span className="font-bold text-gray-800">{products.length}</span> productos disponibles
                  </p>
                </div>
              </div>

              {/* Right: CTA */}
              <a
                href="https://wa.me/573104077106"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#E93B3C] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#E93B3C]/20 transition-all hover:scale-[1.03] hover:shadow-lg self-start sm:self-auto"
              >
                <MessageCircle size={16} /> Pedir por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── Catalog + filters ── */}
        <CatalogFilter
          products={products}
          categories={categoryNames}
          initialCategory={initialCategory}
        />

        {/* ── CTA bottom ── */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-[#FDF2F4] border border-[#F6BCCB]/50 px-8 py-10 text-center">
              <p className="text-lg font-bold text-gray-900">¿No encuentras lo que buscas?</p>
              <p className="mt-1 text-gray-500 text-sm">Escribenos y te asesoramos con el producto perfecto.</p>
              <a
                href="https://wa.me/573104077106"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-[#E93B3C] text-white px-7 py-3 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#E93B3C]/25 hover:scale-[1.02]"
              >
                <MessageCircle size={16} /> Escribenos por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
