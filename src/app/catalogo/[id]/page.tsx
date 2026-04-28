import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, Truck } from "lucide-react";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import AddiWidget from "@/components/AddiWidget";
import { getProductById, applyCategDiscounts } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import type { Product } from "@/types";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id).catch(() => null);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const description =
    product.descripcion?.slice(0, 160) ||
    `Compra ${product.nombre} en Valm Beauty. Envíos a todo Colombia.`;
  const image = product.images?.[0] || product.imagen || "/og-image.png";

  return {
    title: product.nombre,
    description,
    alternates: { canonical: `/catalogo/${id}` },
    openGraph: {
      type: "website",
      title: product.nombre,
      description,
      url: `/catalogo/${id}`,
      siteName: "Valm Beauty",
      images: [{ url: image, alt: product.nombre }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.nombre,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const rawProduct = await getProductById(id);

  if (!rawProduct) notFound();

  const [product] = await applyCategDiscounts([rawProduct]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

  const hasDiscount = product.descuento > 0;
  const discountedPrice = hasDiscount
    ? product.precio * (1 - product.descuento / 100)
    : product.precio;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    description: product.descripcion || product.nombre,
    image: product.images?.length ? product.images : [product.imagen].filter(Boolean),
    sku: product.id,
    category: product.categoria,
    brand: { "@type": "Brand", name: "Valm Beauty" },
    offers: {
      "@type": "Offer",
      url: `/catalogo/${product.id}`,
      priceCurrency: "COP",
      price: discountedPrice.toFixed(0),
      availability: product.agotado ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const isOutOfStock = product.agotado;

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E93B3C] hover:gap-2.5 transition-all mb-8"
        >
          <ArrowLeft size={16} /> Volver al catalogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Images */}
          <ProductDetailClient images={product.images} name={product.nombre} />

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-block bg-[#FDF2F4] text-[#E93B3C] text-xs font-bold rounded-full px-3 py-1 border border-[#F6BCCB]/40">
                {product.categoria}
              </span>
              {isOutOfStock && (
                <span className="inline-flex items-center rounded-full bg-[#E93B3C] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm">
                  Agotado
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.nombre}
            </h1>

            {product.descripcion && (
              <p className="mt-4 text-gray-500 leading-relaxed">{product.descripcion}</p>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <p className={`text-3xl font-extrabold ${isOutOfStock ? "text-gray-400 line-through" : "text-[#E93B3C]"}`}>
                {formatPrice(discountedPrice)}
              </p>
              {hasDiscount && !isOutOfStock && (
                <>
                  <p className="text-lg text-gray-400 line-through">{formatPrice(product.precio)}</p>
                  <span className="bg-[#E93B3C] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    -{product.descuento}%
                  </span>
                </>
              )}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {isOutOfStock ? (
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#F6BCCB] bg-[#FDF2F4] px-6 py-4 text-sm font-bold uppercase tracking-wide text-[#E93B3C]">
                  Producto agotado
                </div>
              ) : (
                <AddToCartButton
                  product={{
                    id: String(product.id),
                    brand: "valm-beauty",
                    name: product.nombre,
                    description: product.descripcion || "",
                    price: discountedPrice,
                    image: product.images[0] || "/logos/logo.png",
                    images: product.images,
                    category: product.categoria,
                    stock: 99,
                  } satisfies Product}
                />
              )}
            </div>

            {/* ADDI Widget - cuotas */}
            {!isOutOfStock && <AddiWidget price={discountedPrice} />}

            {/* Trust */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-[#FDF2F4] border border-[#F6BCCB]/30 p-3.5">
                <Shield size={18} className="text-[#E93B3C] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Pago seguro</p>
                  <p className="text-[10px] text-gray-400">Mercado Pago y ADDI</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-[#FDF2F4] border border-[#F6BCCB]/30 p-3.5">
                <Truck size={18} className="text-[#E93B3C] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Envio nacional</p>
                  <p className="text-[10px] text-gray-400">A toda Colombia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
