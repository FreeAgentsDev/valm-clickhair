"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Lock, Droplets, Flower2, Sparkles, Heart, Star, Gift, LayoutGrid } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import type { BrandSlug } from "@/types";

const CATEGORIES = [
  { href: "/catalogo", label: "Catalogo", icon: LayoutGrid },
  { href: "/catalogo?categoria=skincare", label: "Skincare", icon: Droplets },
  { href: "/catalogo?categoria=capilares", label: "Capilares", icon: Flower2 },
  { href: "/catalogo?categoria=exfoliantes", label: "Exfoliantes", icon: Sparkles },
  { href: "/catalogo?categoria=corporales", label: "Corporales", icon: Heart },
  { href: "/catalogo?categoria=maquillaje", label: "Maquillaje", icon: Star },
  { href: "/catalogo?categoria=kits", label: "Kits", icon: Gift },
] as const;

interface HeaderProps {
  brand?: BrandSlug;
}

export default function Header({ brand }: HeaderProps) {
  const { itemCount } = useCart();
  const currentBrand = brand ? BRANDS[brand] : null;
  const sidebar = useSidebar();

  return (
    <>
      {/* Marquee */}
      <div className="bg-brand-pink/60 overflow-hidden animate-header-in" style={{ animationDelay: "0s" }}>
        <div className="flex animate-marquee whitespace-nowrap py-2 w-max">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center" aria-hidden={i > 0 ? true : undefined}>
              <span className="mx-6 text-xs font-semibold text-brand-red tracking-wide">Envíos a todo Colombia</span>
              <span className="mx-2 text-brand-red/40">·</span>
              <span className="mx-6 text-xs font-semibold text-brand-red tracking-wide">Pago seguro con Wompi y ADDI</span>
              <span className="mx-2 text-brand-red/40">·</span>
              <span className="mx-6 text-xs font-semibold text-brand-red tracking-wide">Productos 100% originales</span>
              <span className="mx-2 text-brand-red/40">·</span>
              <span className="mx-6 text-xs font-semibold text-brand-red tracking-wide">Compra fácil y rápido</span>
              <span className="mx-2 text-brand-red/40">·</span>
              <span className="mx-6 text-xs font-semibold text-brand-red tracking-wide">Marcas certificadas</span>
              <span className="mx-2 text-brand-red/40">·</span>
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-pink/30 shadow-sm animate-header-in" style={{ animationDelay: "0.05s" }}>

        {/* ── Main row ── */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href={currentBrand ? `/${currentBrand.slug}` : "/"}
            className="flex shrink-0 items-center transition-opacity hover:opacity-75"
          >
            <Image
              src="/logos/logo-navbar.svg"
              alt="Valm Beauty"
              width={140}
              height={47}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop categories — centered */}
          <nav
            className="hidden flex-1 items-center justify-center gap-0.5 md:flex"
            aria-label="Categorias"
          >
            {CATEGORIES.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-brand-rose hover:text-brand-red"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/cart"
              className="relative flex items-center justify-center rounded-full p-2.5 text-gray-700 transition-colors hover:bg-brand-rose hover:text-brand-red"
              aria-label={`Carrito (${itemCount} productos)`}
            >
              <ShoppingCart size={21} strokeWidth={1.8} aria-hidden />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red text-[11px] font-bold text-white ring-2 ring-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin/login"
              className="hidden rounded-full p-2 text-gray-400 transition-colors hover:bg-brand-rose hover:text-brand-red md:flex"
              aria-label="Admin"
              title="Panel Admin"
            >
              <Lock size={16} aria-hidden />
            </Link>

            <button
              type="button"
              onClick={sidebar.toggle}
              className="rounded-full p-2.5 text-gray-700 transition-colors hover:bg-brand-rose md:hidden"
              aria-label={sidebar.isOpen ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={sidebar.isOpen}
            >
              {sidebar.isOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
            </button>
          </div>
        </div>

        {/* ── Mobile categories row ── */}
        <div className="border-t border-brand-pink/20 md:hidden">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
            {CATEGORIES.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand-pink/40 bg-brand-rose/50 px-3 py-1.5 text-xs font-semibold text-gray-600 whitespace-nowrap transition-all hover:border-brand-red/30 hover:bg-brand-rose hover:text-brand-red"
              >
                <Icon size={11} aria-hidden />
                {label}
              </Link>
            ))}
          </div>
        </div>

      </header>

      <Sidebar
        isOpen={sidebar.isOpen}
        isClosing={sidebar.isClosing}
        onClose={sidebar.close}
        onLinkClick={sidebar.close}
        brand={brand}
      />
    </>
  );
}
