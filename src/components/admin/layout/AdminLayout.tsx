"use client";

import Link from "next/link";
import { Package, LogOut, ExternalLink } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#D62839]/10 text-[#D62839] ring-1 ring-[#D62839]/30">
              <Package size={20} />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-wide text-gray-900">
                Panel <span className="text-[#D62839]">Val M</span>
              </h1>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                Modo Edición
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Ver tienda</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 sm:px-4 py-2 text-xs font-bold text-red-600 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
