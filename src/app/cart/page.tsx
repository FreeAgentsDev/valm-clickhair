import Header from "@/components/Header";
import CartSummary from "@/components/CartSummary";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Carrito</h1>
          <p className="mt-1 text-sm text-gray-500">
            Revisa tu pedido y continúa al checkout con Mercado Pago o ADDI
          </p>
        </div>
        <CartSummary />
      </main>
    </div>
  );
}
