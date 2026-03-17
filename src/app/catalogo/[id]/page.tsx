import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Shield, Truck } from "lucide-react";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductById } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import type { Product } from "@/types";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

  const hasDiscount = product.descuento > 0;
  const discountedPrice = hasDiscount
    ? product.precio * (1 - product.descuento / 100)
    : product.precio;

  return (
    <div className="min-h-screen bg-white">
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
            <span className="inline-block bg-[#FDF2F4] text-[#E93B3C] text-xs font-bold rounded-full px-3 py-1 border border-[#F6BCCB]/40 mb-4">
              {product.categoria}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.nombre}
            </h1>

            {product.descripcion && (
              <p className="mt-4 text-gray-500 leading-relaxed">{product.descripcion}</p>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-3xl font-extrabold text-[#E93B3C]">
                {formatPrice(discountedPrice)}
              </p>
              {hasDiscount && (
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
              <a
                href={`https://wa.me/573104077106?text=${encodeURIComponent(`Hola! Me interesa: ${product.nombre} - ${formatPrice(discountedPrice)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#E93B3C] text-[#E93B3C] px-6 py-4 rounded-xl font-bold text-sm transition-all hover:bg-[#E93B3C]/5"
              >
                <MessageCircle size={18} /> Pedir por WhatsApp
              </a>
            </div>

            {/* Trust */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-xl bg-[#FDF2F4] border border-[#F6BCCB]/30 p-3.5">
                <Shield size={18} className="text-[#E93B3C] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Pago seguro</p>
                  <p className="text-[10px] text-gray-400">Mercado Pago, Wompi, ADDI</p>
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
