import { NextRequest, NextResponse } from "next/server";
import { saveOrder, getOrders } from "@/lib/orders";
import { isAuthenticated } from "@/lib/auth";
import type { Order } from "@/types";

/** POST - Guardar una nueva orden (desde checkout) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shipping, subtotal, shippingCost, total, paymentMethod, orderId, consent } = body;

    if (!items?.length || !shipping?.email || !orderId) {
      return NextResponse.json(
        { error: "Datos de orden incompletos" },
        { status: 400 }
      );
    }

    if (!consent?.acceptedAt) {
      return NextResponse.json(
        { error: "Se requiere aceptar la Política de Tratamiento de Datos Personales" },
        { status: 400 }
      );
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

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
      consent: {
        acceptedAt: consent.acceptedAt,
        policyVersion: process.env.POLICY_EFFECTIVE_DATE ?? "2026-04-14",
        ipAddress,
      },
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
