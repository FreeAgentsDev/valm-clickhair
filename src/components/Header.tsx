"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Instagram, Menu, X, Home } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import type { BrandSlug } from "@/types";

interface HeaderProps {
  brand?: BrandSlug;
}

function RoundLogo({
  src,
  alt,
  size = 48,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
}

export default function Header({ brand }: HeaderProps) {
  const { itemCount } = useCart();
  const currentBrand = brand ? BRANDS[brand] : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/valm-beauty", label: "Valm Beauty", color: BRANDS["valm-beauty"].primaryColor },
    { href: "/click-hair", label: "Click Hair", color: BRANDS["click-hair"].primaryColor },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b shadow-sm"
      style={{
        borderColor: currentBrand ? `${currentBrand.primaryColor}15` : "#e5e7eb",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(12px)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + Brand name */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {currentBrand ? (
            <Link
              href={`/${currentBrand.slug}`}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <RoundLogo
                src={currentBrand.logo}
                alt={currentBrand.name}
                size={44}
              />
              <span
                className="text-base font-bold truncate hidden min-[480px]:block sm:text-lg"
                style={{ color: currentBrand.primaryColor }}
              >
                {currentBrand.name}
              </span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="flex -space-x-2">
                <RoundLogo
                  src={BRANDS["valm-beauty"].logo}
                  alt="Valm Beauty"
                  size={40}
                  className="ring-2 ring-white"
                />
                <RoundLogo
                  src={BRANDS["click-hair"].logo}
                  alt="Click Hair"
                  size={40}
                  className="ring-2 ring-white"
                />
              </div>
              <span className="text-base font-bold hidden sm:block text-gray-900 truncate">
                Tienda Virtual
              </span>
            </Link>
          )}
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
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
                  : {}
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
              className="ml-2 rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          )}
        </div>

        {/* Cart + Mobile menu button */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/cart"
            className="relative flex items-center justify-center rounded-full p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
            style={{ color: currentBrand?.primaryColor ?? "#374151" }}
            aria-label={`Carrito (${itemCount} productos)`}
          >
            <ShoppingCart size={22} strokeWidth={2} />
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white shadow-sm"
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-[280px] bg-white shadow-2xl md:hidden animate-slide-in-right"
            role="dialog"
            aria-label="Menú de navegación"
          >
            <div className="flex h-full flex-col pt-16 pb-8 px-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-5">
                <div className="flex -space-x-2">
                  <RoundLogo src={BRANDS["valm-beauty"].logo} alt="" size={44} className="ring-2 ring-white" />
                  <RoundLogo src={BRANDS["click-hair"].logo} alt="" size={44} className="ring-2 ring-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">Tienda Virtual</span>
              </div>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl py-3.5 px-4 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                    <Home size={18} className="text-gray-600" />
                  </div>
                  Inicio
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl py-3 px-4 font-medium flex items-center gap-3 transition-colors ${
                      brand === link.href.slice(1)
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    style={
                      brand === link.href.slice(1)
                        ? { backgroundColor: link.color }
                        : {}
                    }
                  >
                    <RoundLogo
                      src={
                        link.href === "/valm-beauty"
                          ? BRANDS["valm-beauty"].logo
                          : BRANDS["click-hair"].logo
                      }
                      alt=""
                      size={36}
                    />
                    {link.label}
                  </Link>
                ))}
                {currentBrand && (
                  <a
                    href={currentBrand.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Instagram size={20} />
                    @{currentBrand.instagram}
                  </a>
                )}
              </nav>
              <div className="mt-auto pt-6 border-t border-gray-100">
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl py-4 font-medium text-white w-full"
                  style={{
                    backgroundColor: currentBrand?.primaryColor ?? "#D62839",
                  }}
                >
                  <ShoppingCart size={20} />
                  Ver carrito ({itemCount})
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
