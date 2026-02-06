import Link from "next/link";
import Image from "next/image";
import { Instagram, Sparkles, Truck, Shield, MessageCircle } from "lucide-react";
import { BRANDS } from "@/lib/brands";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main>
        {/* Hero con contraste - optimizado para SEO y conversión */}
        <section
          className="relative overflow-hidden px-4 py-16 sm:py-24"
          aria-labelledby="hero-title"
        >
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background: "linear-gradient(135deg, #FDF2F4 0%, #F5F0FA 50%, #EFF6FF 100%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:gap-14 lg:text-left">
              <div className="flex items-center gap-4" aria-hidden="true">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl ring-2 ring-[#D62839]/20">
                  <Image
                    src={BRANDS["valm-beauty"].logo}
                    alt="Valm Beauty - Skincare y belleza en Manizales"
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority
                  />
                </div>
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl ring-2 ring-[#9B8FD9]/20">
                  <Image
                    src={BRANDS["click-hair"].logo}
                    alt="Click Hair - Cuidado capilar y perfumes para cabello"
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
                  Cra 23A # 60-11 Tienda Virtual · Manizales
                </p>
                <h1
                  id="hero-title"
                  className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
                >
                  Belleza y cuidado en{" "}
                  <span className="text-[#D62839]">Manizales</span>
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 lg:mx-0">
                  Explora las colecciones de Valm Beauty y Click Hair. Productos de calidad con envíos a todo Colombia 🇨🇴
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección marcas - Landing descriptiva */}
        <section
          className="border-y border-gray-100 bg-gray-50/50 px-4 py-16 sm:py-20"
          aria-labelledby="brands-heading"
        >
          <div className="mx-auto max-w-7xl">
            <h2
              id="brands-heading"
              className="text-center text-2xl font-bold text-gray-900 mb-4 sm:text-3xl"
            >
              Nuestras marcas
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-base leading-relaxed">
              Dos marcas que amamos, un solo lugar. Productos para el cuidado de tu piel, cabello y cuerpo.
            </p>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Valm Beauty - card con contraste */}
            <div
              className="group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-xl"
              style={{
                borderColor: "#F5A6B8",
                background: "linear-gradient(180deg, #FFF5F7 0%, #ffffff 100%)",
                boxShadow: "0 4px 20px rgba(214, 40, 57, 0.08)",
              }}
            >
              <Link href="/valm-beauty" className="block">
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
                  <div
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#D62839]/30"
                    style={{ backgroundColor: "#FDF2F4" }}
                  >
                    <Image
                      src={BRANDS["valm-beauty"].logo}
                      alt="Valm Beauty"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold tracking-tight"
                      style={{ color: BRANDS["valm-beauty"].primaryColor }}
                    >
                      Valm Beauty
                    </h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Tienda multimarca: Walaky, Girly, Olé, Fresa Morada. Skincare, perfumes capilares,
                      exfoliantes y productos para el cuidado facial y corporal.
                    </p>
                    <p className="mt-4 text-sm font-medium text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                      <Instagram size={16} />
                      @valm_beauty_mzl
                    </p>
                    <span className="mt-4 inline-block font-semibold text-[#D62839] group-hover:underline">
                      Ver productos →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Click Hair - card con contraste */}
            <div
              className="group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-xl"
              style={{
                borderColor: "#B8D4E8",
                background: "linear-gradient(180deg, #F8F5FF 0%, #ffffff 100%)",
                boxShadow: "0 4px 20px rgba(155, 143, 217, 0.08)",
              }}
            >
              <Link href="/click-hair" className="block">
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
                  <div
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#9B8FD9]/30"
                    style={{ backgroundColor: "#F5F0FA" }}
                  >
                    <Image
                      src={BRANDS["click-hair"].logo}
                      alt="Click Hair"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold tracking-tight"
                      style={{ color: BRANDS["click-hair"].primaryColor }}
                    >
                      Click Hair
                    </h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Cuidado capilar y corporal. Perfumes para el cabello en 7 aromas, línea de miel,
                      mantequillas con glitter y rutinas depilatorias. Productos que hacen que tu cabello se vea, sienta y huela impecable.
                    </p>
                    <p className="mt-4 text-sm font-medium text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                      <Instagram size={16} />
                      @click_hair_manizales
                    </p>
                    <span className="mt-4 inline-block font-semibold text-[#9B8FD9] group-hover:underline">
                      Ver productos →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

        {/* Tarjetas rápidas de marcas */}
        <section className="px-4 py-12 sm:py-16" aria-label="Acceso rápido a marcas">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/valm-beauty"
              className="group flex items-center gap-6 rounded-2xl border-2 border-[#F5A6B8]/60 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-[#D62839]/40"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#F5A6B8]/50 shadow-md">
                <Image
                  src={BRANDS["valm-beauty"].logo}
                  alt="Valm Beauty"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#D62839]">Valm Beauty</h3>
                <p className="text-sm text-gray-600">Skincare, perfumes y cuidado corporal</p>
                <span className="mt-2 inline-block text-sm font-medium text-[#D62839] group-hover:underline">
                  Explorar →
                </span>
              </div>
            </Link>
            <Link
              href="/click-hair"
              className="group flex items-center gap-6 rounded-2xl border-2 border-[#B8D4E8]/60 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-[#9B8FD9]/40"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#B8D4E8]/50 shadow-md">
                <Image
                  src={BRANDS["click-hair"].logo}
                  alt="Click Hair"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#9B8FD9]">Click Hair</h3>
                <p className="text-sm text-gray-600">Perfumes capilares, miel y cuerpo</p>
                <span className="mt-2 inline-block text-sm font-medium text-[#9B8FD9] group-hover:underline">
                  Explorar →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

        {/* Beneficios / Features */}
        <section
          className="border-t border-gray-200 bg-gray-50 px-4 py-16 sm:py-20"
          aria-labelledby="benefits-heading"
        >
          <div className="mx-auto max-w-7xl">
            <h2 id="benefits-heading" className="sr-only">
              Beneficios de comprar con nosotros
            </h2>
            <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Shield size={28} />
              </div>
              <h3 className="font-bold text-gray-900">Pago seguro</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Wompi y ADDI. Tarjeta, PSE, Nequi o cuotas.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <MessageCircle size={28} />
              </div>
              <h3 className="font-bold text-gray-900">WhatsApp</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Envía tu carrito directo. Respuesta rápida.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Truck size={28} />
              </div>
              <h3 className="font-bold text-gray-900">Envíos</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Skydropx · A todo Colombia.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                <Sparkles size={28} />
              </div>
              <h3 className="font-bold text-gray-900">Marcas premium</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Valm Beauty y Click Hair. Calidad garantizada.
              </p>
            </article>
          </div>
        </div>
        </section>
      </main>

      <footer
        className="border-t border-gray-200 px-4 py-10 sm:py-12 text-center text-sm text-gray-500 font-sans"
        role="contentinfo"
      >
        <address className="not-italic">
          <p className="font-semibold text-gray-800">Cra 23A # 60-11 Tienda Virtual</p>
          <p className="mt-1">Manizales, Caldas · Lunes a Viernes 9:30am - 6:30pm</p>
        </address>
        <p className="mt-4">
          <a
            href={BRANDS["valm-beauty"].instagramUrl}
            className="hover:underline font-medium"
            style={{ color: BRANDS["valm-beauty"].primaryColor }}
          >
            @valm_beauty_mzl
          </a>
          {" · "}
          <a
            href={BRANDS["click-hair"].instagramUrl}
            className="hover:underline font-medium"
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
