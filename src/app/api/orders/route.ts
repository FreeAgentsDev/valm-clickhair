import { NextRequest, NextResponse } from "next/server";
import { saveOrder, getOrders } from "@/lib/orders";
import { isAuthenticated } from "@/lib/auth";
import type { Order } from "@/types";

/** POST - Guardar una nueva orden (desde checkout) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shipping, subtotal, shippingCost, total, paymentMethod, orderId } = body;

    if (!items?.length || !shipping?.email || !orderId) {
      return NextResponse.json(
        { error: "Datos de orden incompletos" },
        { status: 400 }
      );
    }

    const order: Order = {
      id: orderId,
      items,
      shipping,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Error guardando orden:", error);
    return NextResponse.json(
      { error: "Error al guardar la orden" },
      { status: 500 }
    );
  }
}

/** GET - Listar órdenes (solo admin autenticado) */
export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const orders = getOrders();
  return NextResponse.json({ orders });
}
