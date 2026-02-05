import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { BRANDS } from "@/lib/brands";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium text-gray-500 mb-4">
            📍 Cra 23A # 60-11 Tienda Virtual · Manizales
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Belleza y cuidado en Manizales
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explora las colecciones de Valm Beauty y Click Hair.
            Envíos a todo Colombia 🇨🇴
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-10">
            Nuestras marcas
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            {/* Valm Beauty */}
            <Link
              href="/valm-beauty"
              className="group relative overflow-hidden rounded-3xl border-2 border-[#F5A6B8]/50 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#D62839]/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 h-32 w-32 relative rounded-full overflow-hidden bg-white shadow-md">
                  <Image
                    src={BRANDS["valm-beauty"].logo}
                    alt="Valm Beauty"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: BRANDS["valm-beauty"].primaryColor }}
                >
                  {BRANDS["valm-beauty"].name}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  {BRANDS["valm-beauty"].tagline}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Instagram size={18} />
                  <span>@{BRANDS["valm-beauty"].instagram}</span>
                </div>
                <p className="mt-6 font-medium text-gray-900 group-hover:underline">
                  Ver productos →
                </p>
              </div>
            </Link>

            {/* Click Hair */}
            <Link
              href="/click-hair"
              className="group relative overflow-hidden rounded-3xl border-2 border-[#B8D4E8]/50 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#9B8FD9]/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 h-32 w-32 relative rounded-full overflow-hidden bg-white shadow-md">
                  <Image
                    src={BRANDS["click-hair"].logo}
                    alt="Click Hair"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: BRANDS["click-hair"].primaryColor }}
                >
                  {BRANDS["click-hair"].name}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  {BRANDS["click-hair"].tagline}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Instagram size={18} />
                  <span>@{BRANDS["click-hair"].instagram}</span>
                </div>
                <p className="mt-6 font-medium text-gray-900 group-hover:underline">
                  Ver productos →
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D62839]/10 text-[#D62839]">
                <span className="text-xl">💳</span>
              </div>
              <h3 className="font-semibold text-gray-900">Pago seguro</h3>
              <p className="mt-1 text-sm text-gray-600">
                Wompi, ADDI. Tarjeta, PSE o cuotas.
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <span className="text-xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900">WhatsApp</h3>
              <p className="mt-1 text-sm text-gray-600">
                Envía tu carrito directo por WhatsApp.
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9B8FD9]/20 text-[#9B8FD9]">
                <span className="text-xl">📦</span>
              </div>
              <h3 className="font-semibold text-gray-900">Envíos</h3>
              <p className="mt-1 text-sm text-gray-600">
                Skydropx · A todo Colombia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p className="font-medium text-gray-700">Cra 23A # 60-11 Tienda Virtual</p>
        <p className="mt-1">Manizales · Lunes a Viernes 9:30am - 6:30pm</p>
        <p className="mt-4">
          <a
            href={BRANDS["valm-beauty"].instagramUrl}
            className="hover:underline"
            style={{ color: BRANDS["valm-beauty"].primaryColor }}
          >
            @valm_beauty_mzl
          </a>
          {" · "}
          <a
            href={BRANDS["click-hair"].instagramUrl}
            className="hover:underline"
            style={{ color: BRANDS["click-hair"].primaryColor }}
          >
            @click_hair_manizales
          </a>
        </p>
        <p className="mt-2">📲 310 407 7106 · 320 677 0162</p>
      </footer>
    </div>
  );
}
