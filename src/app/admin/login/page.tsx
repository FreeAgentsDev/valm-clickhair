"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ExternalLink } from "lucide-react";
import { BRANDS } from "@/lib/brands";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center gap-3 mb-8">
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
            <Image
              src={BRANDS["valm-beauty"].logo}
              alt="Valm Beauty"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
            <Image
              src={BRANDS["click-hair"].logo}
              alt="Click Hair"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Panel Admin
          </h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Ingresa tu contraseña para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  aria-hidden
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#D62839] focus:ring-1 focus:ring-[#D62839] focus:outline-none"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#D62839] py-3 font-semibold text-white hover:bg-[#b82230] disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
        >
          <ExternalLink size={16} />
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
