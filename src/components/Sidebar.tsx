"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { X, Home, Instagram, ShoppingCart } from "lucide-react";
import { RoundLogo } from "@/components/ui/RoundLogo";
import { useCart } from "@/lib/cart-context";
import { BRANDS } from "@/lib/brands";
import type { BrandSlug } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  onLinkClick: () => void;
  brand?: BrandSlug;
}

const BRAND_NAV_LINKS = [
  { href: "/valm-beauty", label: "Valm Beauty", brand: "valm-beauty" as BrandSlug },
  { href: "/click-hair", label: "Click Hair", brand: "click-hair" as BrandSlug },
] as const;

export function Sidebar({ isOpen, isClosing, onClose, onLinkClick, brand }: SidebarProps) {
  const { itemCount } = useCart();
  const currentBrand = brand ? BRANDS[brand] : null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const isVisible = isOpen || isClosing;

  // Focus trap cuando el sidebar está abierto
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previousActiveElement?.focus();
    };
  }, [isOpen]);

  // Mantener foco dentro del sidebar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    sidebarRef.current?.addEventListener("keydown", handleKeyDown);
    return () => sidebarRef.current?.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] isolate md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={sidebarRef}
        className={`absolute inset-y-0 right-0 flex w-full min-w-[280px] max-w-sm flex-col overflow-hidden bg-white shadow-2xl ${
          isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
        }`}
      >
        {/* Header: branding + close */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-4 py-4">
          <Link
            href="/"
            onClick={onLinkClick}
            className="flex min-w-0 flex-1 items-center gap-3 truncate"
          >
            <div className="flex shrink-0 -space-x-2">
              <RoundLogo
                src={BRANDS["valm-beauty"].logo}
                alt=""
                size={36}
                ring={false}
                className="border-2 border-white shadow"
              />
              <RoundLogo
                src={BRANDS["click-hair"].logo}
                alt=""
                size={36}
                ring={false}
                className="border-2 border-white shadow"
              />
            </div>
            <span className="truncate text-base font-bold text-gray-900">
              Tienda Virtual
            </span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex shrink-0 items-center justify-center rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Cerrar menú"
          >
            <X size={22} strokeWidth={2.5} aria-hidden />
          </button>
        </header>

        {/* Nav links */}
        <nav
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
          aria-label="Navegación principal"
        >
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link
                href="/"
                onClick={onLinkClick}
                className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3.5 font-medium text-gray-800 transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <Home size={20} strokeWidth={2.5} aria-hidden />
                </span>
                Inicio
              </Link>
            </li>
            {BRAND_NAV_LINKS.map((link) => {
              const isActive = brand === link.brand;
              const brandData = BRANDS[link.brand];
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={`flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3.5 font-semibold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                    style={
                      isActive && brandData
                        ? { backgroundColor: brandData.primaryColor }
                        : undefined
                    }
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.25)"
                          : brandData?.primaryColor === "#D62839"
                            ? "#FDF2F4"
                            : "#F5F0FA",
                      }}
                    >
                      <Image
                        src={brandData.logo}
                        alt=""
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {currentBrand && (
              <li>
                <a
                  href={currentBrand.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onLinkClick}
                  className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <Instagram size={20} strokeWidth={2} aria-hidden />
                  </span>
                  @{currentBrand.instagram}
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer: CTA + address */}
        <footer className="shrink-0 border-t border-gray-100 bg-white px-4 py-4">
          <Link
            href="/cart"
            onClick={onLinkClick}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white transition-opacity hover:opacity-95 active:opacity-90"
            style={{
              backgroundColor: currentBrand?.primaryColor ?? "#D62839",
            }}
          >
            <ShoppingCart size={22} strokeWidth={2.5} aria-hidden />
            Ver carrito ({itemCount})
          </Link>
          <p className="mt-3 text-center text-xs text-gray-500">
            Cra 23A # 60-11 · Manizales
          </p>
        </footer>
      </aside>
    </div>
  );
}
