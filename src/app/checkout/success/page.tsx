"use client";

import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido recibido correctamente.
            {ref && (
              <span className="block mt-2 font-mono text-sm">
                Referencia: {ref}
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Te contactaremos pronto para confirmar el envío. Síguenos en Instagram
            para más novedades.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-pink-500 px-8 py-3 font-medium text-white hover:bg-pink-600 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
