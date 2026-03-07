import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import Header from "@/components/Header";
import ProductsGridClient from "@/components/ProductsGridClient";
import BrandInfoSectionClient from "@/components/BrandInfoSectionClient";
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

        {/* Info de la tienda (lee contenido editable desde localStorage) */}
        <div className="mb-12">
          <BrandInfoSectionClient
            brand={brand as BrandSlug}
            otherBrand={isValm ? "click-hair" : "valm-beauty"}
          />
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
          <ProductsGridClient brand={brand as BrandSlug} initialProducts={products} />
        </section>
      </main>
    </div>
  );
}
