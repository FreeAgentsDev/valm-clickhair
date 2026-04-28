import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Truck,
  Shield,
  MessageCircle,
  ArrowRight,
  Star,
  Heart,
  Gift,
  Droplets,
  Flower2,
  Quote,
  Instagram,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { BRANDS } from "@/lib/brands";
import Header from "@/components/Header";
import DbProductCard from "@/components/DbProductCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getFeaturedProducts, applyCategDiscounts } from "@/lib/db";
import { getAdminHero, getAdminTestimonials } from "@/lib/admin-storage";

export const revalidate = 60;

const DEFAULT_HERO = {
  title: "Tu destino de belleza",
  titleHighlight: "en Colombia",
  subtitle: "Skincare, cuidado capilar y corporal. Productos originales con envios a todo Colombia.",
  badge: "Belleza & Cuidado Profesional",
  ctaText: "Ver catalogo",
  ctaWhatsappText: "Escribenos",
  aboutTitle: "Belleza que se siente, se huele y se vive",
  aboutText: "Desde Manizales para toda Colombia. Productos 100% originales de Walaky, Girly, Ole y Fresa Morada con envios seguros y asesoria personalizada.",
  catalogTitle: "Explora el catalogo",
  catalogSubtitle: "Mas de 170 productos originales para tu belleza y cuidado personal.",
  categoriesTitle: "Encuentra lo que buscas",
  contactTitle: "Escríbenos por WhatsApp",
  contactAddress: "Calle 68 # 27-24 Casa Ágape · Barrio Palermo · Manizales",
  contactStoreHours: "Lunes a Sábado · 10:00am - 7:00pm",
  contactWhatsappNumber: "310 407 7106",
  contactWhatsappHours: "Todos los días · 8:00am - 8:00pm",
  contactCtaText: "Escríbenos ahora",
  contactWhatsappUrl: "https://wa.me/573104077106",
};

export default async function Home() {
  const featuredProducts = await applyCategDiscounts(await getFeaturedProducts(8));
  const heroContent = (await getAdminHero()) ?? DEFAULT_HERO;
  const hero = { ...DEFAULT_HERO, ...heroContent };

  const DEFAULT_TESTIMONIALS = [
    { name: "Carolina M.", text: "Los perfumes capilares son increibles, mi cabello huele espectacular todo el dia. Amo la variedad que tienen.", label: "Clienta verificada", stars: 5 },
    { name: "Valentina R.", text: "Los exfoliantes Walaky son buenisimos. La atencion por WhatsApp fue super rapida y me asesoraron perfecto.", label: "Clienta verificada", stars: 5 },
    { name: "Laura G.", text: "La mantequilla con glitter es un descubrimiento! Piel suave, brillante y el aroma dura horas.", label: "Clienta verificada", stars: 5 },
  ];
  const testimonials = (await getAdminTestimonials()) ?? DEFAULT_TESTIMONIALS;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main>
        {/* ════════════ HERO ════════════ */}
        <section
          className="relative overflow-hidden px-4 py-20 sm:py-28 lg:py-36"
          style={{ background: "linear-gradient(180deg, #F6BCCB 0%, #F9CDD7 60%, #FDF2F4 100%)" }}
          aria-labelledby="hero-title"
        >
          {/* Decoración brandbook */}
          <img
            src="/logos/decoracion-logo.svg"
            alt=""
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              {/* Logo wordmark */}
              <div className="mb-3 animate-slide-up" style={{ animationDelay: "0.05s" }} aria-hidden="true">
                <Image
                  src="/logos/logo.svg"
                  alt="Valm Beauty"
                  width={400}
                  height={134}
                  className="h-32 sm:h-40 w-auto object-contain mix-blend-multiply"
                  priority
                />
              </div>

              <p className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-5 py-2 text-[#E93B3C] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-6 border border-[#F6BCCB]/50 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Sparkles size={14} /> {hero.badge}
              </p>

              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl animate-slide-up"
                style={{ lineHeight: "1.05", animationDelay: "0.35s" }}
              >
                {hero.title}
                <span className="block text-gradient-shimmer mt-2">{hero.titleHighlight}</span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg text-gray-600 leading-relaxed animate-slide-up" style={{ animationDelay: "0.5s" }}>
                {hero.subtitle}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.65s" }}>
                <a
                  href="#catalogo"
                  className="group inline-flex items-center justify-center gap-2 bg-[#E93B3C] text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all hover:shadow-xl hover:shadow-[#E93B3C]/30 hover:scale-[1.03]"
                >
                  {hero.ctaText}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="https://wa.me/573104077106"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-[#E93B3C] px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all hover:shadow-lg border-2 border-[#E93B3C]/20 hover:border-[#E93B3C]/50"
                >
                  <MessageCircle size={18} /> {hero.ctaWhatsappText}
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-gray-500 text-xs font-semibold tracking-wide uppercase animate-slide-up" style={{ animationDelay: "0.8s" }}>
                <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#E93B3C]" /> Pago Seguro</span>
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-[#E93B3C]" /> Envio Nacional</span>
                <span className="flex items-center gap-1.5"><Star size={14} className="text-[#E93B3C]" /> 100% Original</span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ CATEGORIAS ════════════ */}
        <section className="bg-white px-4 py-20 sm:py-24" aria-labelledby="categories-heading">
          <div className="mx-auto max-w-7xl">
            <AnimateOnScroll className="text-center mb-14">
              <p className="text-[#E93B3C] text-sm font-bold tracking-[0.15em] uppercase mb-3">Categorias</p>
              <h2 id="categories-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {hero.categoriesTitle}
              </h2>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Droplets, label: "Skincare", desc: "Cuidado facial" },
                { icon: Flower2, label: "Capilares", desc: "Perfumes y mas" },
                { icon: Sparkles, label: "Exfoliantes", desc: "Cuerpo y rostro" },
                { icon: Heart, label: "Corporales", desc: "Hidratacion" },
                { icon: Star, label: "Maquillaje", desc: "Looks perfectos" },
                { icon: Gift, label: "Kits", desc: "Rutinas completas" },
              ].map((cat, i) => (
                <AnimateOnScroll key={cat.label} delay={i * 0.08} direction="up">
                  <a
                    href="#catalogo"
                    className="group flex flex-col items-center text-center rounded-2xl bg-[#FDF2F4] border-2 border-[#F6BCCB]/30 p-6 sm:p-7 transition-all duration-300 hover:border-[#E93B3C]/40 hover:shadow-lg hover:shadow-[#F6BCCB]/20 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6BCCB]/40 text-[#E93B3C] mb-4 transition-all duration-300 group-hover:bg-[#E93B3C] group-hover:text-white group-hover:scale-110 group-hover:rounded-xl">
                      <cat.icon size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{cat.label}</h3>
                    <p className="text-xs text-gray-400 mt-1">{cat.desc}</p>
                  </a>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ PRODUCTOS DESTACADOS ════════════ */}
        <section id="catalogo" className="scroll-mt-20 px-4 py-20 sm:py-24 bg-[#FDF2F4]" aria-labelledby="catalog-heading">
          <div className="mx-auto max-w-7xl">
            <AnimateOnScroll className="text-center mb-12">
              <p className="text-[#E93B3C] text-sm font-bold tracking-[0.15em] uppercase mb-3">Nuestros Productos</p>
              <h2 id="catalog-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {hero.catalogTitle}
              </h2>
              <p className="mt-4 text-gray-500 max-w-md mx-auto">
                {hero.catalogSubtitle}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
              <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <DbProductCard key={product.id} product={product} />
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2} className="text-center mt-12">
              <Link
                href="/catalogo"
                className="group inline-flex items-center gap-2.5 bg-[#E93B3C] text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all hover:shadow-xl hover:shadow-[#E93B3C]/30 hover:scale-[1.03]"
              >
                Ver catalogo completo
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ════════════ SOBRE NOSOTROS ════════════ */}
        <section className="px-4 py-20 sm:py-24 bg-white overflow-hidden" aria-labelledby="about-heading">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Collage */}
              <AnimateOnScroll direction="left">
                <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-[#F6BCCB]/30 shadow-md group">
                      <Image src="/products/valm/valm_beauty_mzl_DUCSgsDDavs_1.jpg" alt="Skincare Valm Beauty" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#F6BCCB]/30 shadow-md group">
                      <Image src="/products/valm/valm_beauty_mzl_DUCSgsDDavs_2.jpg" alt="Productos de belleza" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4 pt-8">
                    <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#F6BCCB]/30 shadow-md group">
                      <Image src="/products/valm/valm_beauty_mzl_DUCSgsDDavs_5.jpg" alt="Cepillos y accesorios" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-[#F6BCCB]/30 shadow-md group">
                      <Image src="/products/valm/valm_beauty_mzl_DUCSgsDDavs_3.jpg" alt="Cuidado capilar" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
                    <div className="bg-[#E93B3C] text-white rounded-full h-20 w-20 sm:h-24 sm:w-24 flex flex-col items-center justify-center shadow-xl ring-4 ring-white animate-pulse-glow">
                      <span className="text-2xl sm:text-3xl font-extrabold leading-none">100+</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mt-0.5">productos</span>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Copy */}
              <AnimateOnScroll direction="right" delay={0.15}>
                <div>
                  <p className="text-[#E93B3C] text-sm font-bold tracking-[0.15em] uppercase mb-3">Sobre Nosotros</p>
                  <h2 id="about-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {hero.aboutTitle}
                  </h2>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {hero.aboutText}
                  </p>

                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {[
                      { num: "100+", label: "Productos" },
                      { num: "8+", label: "Marcas" },
                      { num: "100%", label: "Originales" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-4 rounded-2xl bg-[#FDF2F4] border border-[#F6BCCB]/30">
                        <p className="text-2xl sm:text-3xl font-extrabold text-[#E93B3C]">{stat.num}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#catalogo"
                    className="mt-7 group inline-flex items-center gap-2 bg-[#E93B3C] text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-[#E93B3C]/25 hover:scale-[1.02]"
                  >
                    Ver productos <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ════════════ TESTIMONIOS ════════════ */}
        <section className="px-4 py-20 sm:py-24" style={{ background: "linear-gradient(180deg, #FFF5F8 0%, #FDF2F4 100%)" }} aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-7xl">
            <AnimateOnScroll className="text-center mb-14">
              <p className="text-[#E93B3C] text-sm font-bold tracking-[0.15em] uppercase mb-3">Testimonios</p>
              <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Lo que dicen nuestras clientas
              </h2>
            </AnimateOnScroll>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((review, i) => (
                <AnimateOnScroll key={i} delay={i * 0.12} direction="up">
                  <article className="bg-white rounded-2xl p-7 border-2 border-[#F6BCCB]/30 shadow-sm hover:shadow-lg hover:shadow-[#F6BCCB]/15 transition-all duration-300 hover:-translate-y-1 h-full">
                    <Quote size={24} className="text-[#F6BCCB] mb-4" />
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{review.text}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                        <p className="text-xs text-gray-400">{review.label}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(review.stars)].map((_, j) => (
                          <Star key={j} size={14} className="fill-[#E93B3C] text-[#E93B3C]" />
                        ))}
                      </div>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ BENEFICIOS ════════════ */}
        <section className="bg-white px-4 py-20 sm:py-24" aria-labelledby="benefits-heading">
          <div className="mx-auto max-w-7xl">
            <AnimateOnScroll className="text-center mb-14">
              <p className="text-[#E93B3C] text-sm font-bold tracking-[0.15em] uppercase mb-3">Por que elegirnos</p>
              <h2 id="benefits-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Compra con confianza
              </h2>
            </AnimateOnScroll>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Shield, title: "Pago seguro", desc: "Mercado Pago y ADDI. Tarjeta, PSE, Nequi o cuotas." },
                { icon: MessageCircle, title: "WhatsApp directo", desc: "Asesoria personalizada y respuesta rapida." },
                { icon: Truck, title: "Envios nacionales", desc: "A todo Colombia con seguimiento en tiempo real." },
                { icon: Star, title: "100% Originales", desc: "Marcas premium. Calidad certificada y garantizada." },
              ].map((b, i) => (
                <AnimateOnScroll key={b.title} delay={i * 0.1} direction="up">
                  <article className="group bg-[#FDF2F4] rounded-2xl p-7 border-2 border-[#F6BCCB]/30 transition-all duration-300 hover:border-[#E93B3C]/30 hover:shadow-lg hover:shadow-[#F6BCCB]/15 hover:-translate-y-1 h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6BCCB]/40 text-[#E93B3C] mb-5 transition-all duration-300 group-hover:bg-[#E93B3C] group-hover:text-white group-hover:scale-110">
                      <b.icon size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{b.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ CTA FINAL ════════════ */}
        <AnimateOnScroll direction="scale">
          <section className="relative overflow-hidden bg-[#E93B3C] px-4 py-16 sm:py-20">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#F6BCCB]/20 blur-3xl" />
            <div className="relative mx-auto max-w-4xl text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {hero.contactTitle}
              </h2>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto text-left">
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide uppercase mb-3">
                    <MapPin size={16} /> Punto físico
                  </div>
                  <p className="text-white text-sm sm:text-base leading-relaxed">{hero.contactAddress}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-white/85 text-sm">
                    <Clock size={14} /> {hero.contactStoreHours}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide uppercase mb-3">
                    <MessageCircle size={16} /> WhatsApp
                  </div>
                  <p className="flex items-center gap-1.5 text-white text-sm sm:text-base font-semibold">
                    <Phone size={14} /> {hero.contactWhatsappNumber}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-white/85 text-sm">
                    <Clock size={14} /> {hero.contactWhatsappHours}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <a href={hero.contactWhatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-[#E93B3C] px-10 py-4 rounded-full font-bold text-base transition-all hover:scale-[1.03] hover:shadow-xl">
                  <MessageCircle size={20} /> {hero.contactCtaText}
                </a>
              </div>
            </div>
          </section>
        </AnimateOnScroll>
      </main>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-[#FDF2F4] border-t border-[#F6BCCB]/30 px-4 py-14 sm:py-16" role="contentinfo">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4">
                <Image src="/logos/logo.svg" alt="Valm Beauty" width={130} height={44} className="h-9 w-auto object-contain" />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Belleza y cuidado profesional en Manizales. Productos originales con envios a todo Colombia.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-sm mb-4 tracking-wide uppercase">Tienda</h4>
              <ul className="space-y-2.5">
                <li><Link href="/valm-beauty" className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors">Valm Beauty</Link></li>
                <li><Link href="/catalogo" className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors">Catalogo</Link></li>
                <li><Link href="/cart" className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors">Mi carrito</Link></li>
                <li><Link href="/politica-datos" className="text-gray-500 text-sm hover:text-[#E93B3C] transition-colors">Política de datos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-sm mb-4 tracking-wide uppercase">Contacto</h4>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>310 407 7106</li>
                <li>Cra 23A # 60-11</li>
                <li>Manizales, Caldas</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-sm mb-4 tracking-wide uppercase">Siguenos</h4>
              <div className="flex flex-col gap-2.5">
                <a href={BRANDS["valm-beauty"].instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-[#E93B3C] transition-colors">
                  <Instagram size={16} /> @valm_beauty_mzl
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#F6BCCB]/30 text-center">
            <p className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} Valm Beauty. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
