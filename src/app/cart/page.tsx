import Header from "@/components/Header";
import CartSummary from "@/components/CartSummary";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrito</h1>
        <p className="text-sm text-gray-500 mb-8">
          Envía tu carrito por WhatsApp o continúa al checkout
        </p>
        <CartSummary />
      </main>
    </div>
  );
}
