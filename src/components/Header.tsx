"use client";

import Link from "next/link";
import { ShoppingCart, Instagram, Menu, X, Home } from "lucide-react";
import { RoundLogo } from "@/components/ui/RoundLogo";
import { Sidebar } from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import type { BrandSlug } from "@/types";

interface HeaderProps {
  brand?: BrandSlug;
}

const NAV_LINKS = [
  { href: "/valm-beauty", label: "Valm Beauty", color: BRANDS["valm-beauty"].primaryColor },
  { href: "/click-hair", label: "Click Hair", color: BRANDS["click-hair"].primaryColor },
] as const;

export default function Header({ brand }: HeaderProps) {
  const { itemCount } = useCart();
  const currentBrand = brand ? BRANDS[brand] : null;
  const sidebar = useSidebar();

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b shadow-sm font-sans"
        style={{
          borderColor: currentBrand ? `${currentBrand.primaryColor}15` : "#e5e7eb",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(12px)",
        }}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Navegación principal"
        >
          {/* Logo + Brand name */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {currentBrand ? (
              <Link
                href={`/${currentBrand.slug}`}
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <RoundLogo src={currentBrand.logo} alt={currentBrand.name} size={44} />
                <span
                  className="hidden truncate text-base font-bold min-[480px]:block sm:text-lg"
                  style={{ color: currentBrand.primaryColor }}
                >
                  {currentBrand.name}
                </span>
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <div className="flex items-center gap-1.5">
                  <RoundLogo
                    src={BRANDS["valm-beauty"].logo}
                    alt="Valm Beauty"
                    size={38}
                    ring={false}
                    className="border-2 border-[#F5A6B8]/50"
                  />
                  <RoundLogo
                    src={BRANDS["click-hair"].logo}
                    alt="Click Hair"
                    size={38}
                    ring={false}
                    className="border-2 border-[#B8D4E8]/50"
                  />
                </div>
                <span className="hidden truncate text-base font-bold text-gray-900 sm:block">
                  Tienda Virtual
                </span>
              </Link>
            )}
          </div>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className={`rounded-lg p-2.5 text-sm font-medium transition-all ${
                !brand
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              style={!brand ? { backgroundColor: "#374151" } : undefined}
              aria-label="Ir al inicio"
            >
              <Home size={20} aria-hidden />
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  brand === link.href.slice(1)
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                style={
                  brand === link.href.slice(1)
                    ? { backgroundColor: link.color }
                    : undefined
                }
              >
                {link.label}
              </Link>
            ))}
            {currentBrand && (
              <a
                href={currentBrand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-pink-50 hover:text-pink-600"
                aria-label="Ver Instagram"
              >
                <Instagram size={20} aria-hidden />
              </a>
            )}
          </div>

          {/* Cart + Mobile menu button */}
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/cart"
              className="relative flex items-center justify-center rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100"
              style={{ color: currentBrand?.primaryColor ?? "#374151" }}
              aria-label={`Carrito (${itemCount} productos)`}
            >
              <ShoppingCart size={22} strokeWidth={2} aria-hidden />
              {itemCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full text-[11px] font-bold text-white shadow-md ring-2 ring-white"
                  style={{
                    backgroundColor: currentBrand?.primaryColor ?? "#D62839",
                  }}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={sidebar.toggle}
              className="rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
              aria-label={sidebar.isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={sidebar.isOpen}
            >
              {sidebar.isOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </nav>
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
