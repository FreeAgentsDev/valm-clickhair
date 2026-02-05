import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import AddToCartButton from "./AddToCartButton";
import { BRANDS } from "@/lib/brands";
import { PRODUCTS } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ brand: string; id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { brand, id } = await params;
  const product = PRODUCTS.find((p) => p.id === id && p.brand === brand);

  if (!product) notFound();

  const brandInfo = BRANDS[product.brand];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  const isValm = product.brand === "valm-beauty";

  return (
    <div
      className="min-h-screen"
      style={{
        background: isValm
          ? "linear-gradient(180deg, #FDF2F4 0%, #ffffff 20%)"
          : "linear-gradient(180deg, #F5F0FA 0%, #ffffff 20%)",
      }}
    >
      <Header brand={product.brand} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Inicio</Link>
          {" / "}
          <Link href={`/${brand}`} className="hover:text-gray-700">{brandInfo.name}</Link>
          {" / "}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div
            className="aspect-square relative overflow-hidden rounded-2xl bg-white border-2 shadow-md"
            style={{ borderColor: `${brandInfo.primaryColor}40` }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white mb-4"
              style={{ backgroundColor: brandInfo.primaryColor }}
            >
              {brandInfo.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p
              className="mt-4 text-3xl font-bold"
              style={{ color: brandInfo.primaryColor }}
            >
              {formatPrice(product.price)}
            </p>
            <p className="mt-6 text-gray-600">{product.description}</p>
            <p className="mt-4 text-sm text-gray-500">Categoría: {product.category}</p>
            <AddToCartButton product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
