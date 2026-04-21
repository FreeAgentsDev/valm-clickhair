import { NextRequest, NextResponse } from "next/server";
import { saveOrder, getOrders } from "@/lib/orders";
import { isAuthenticated } from "@/lib/auth";
import { recalculateOrder } from "@/lib/pricing";
import type { Order, CartItem } from "@/types";

/** POST - Guardar una nueva orden (desde checkout).
 *
 * IMPORTANTE: el servidor re-calcula subtotal, shippingCost y total
 * desde la BD. Lo que envíe el cliente es ignorado (anti price-manipulation).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shipping,
      paymentMethod,
      orderId,
      consent,
      barrio,
    } = body as {
      items?: Array<{ product?: { id?: string }; quantity?: number }>;
      shipping?: {
        name?: string;
        idNumber?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        department?: string;
        postalCode?: string;
      };
      paymentMethod?: Order["paymentMethod"];
      orderId?: string;
      consent?: { acceptedAt?: string };
      barrio?: string;
    };

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

    if (!shipping.city || !shipping.department) {
      return NextResponse.json(
        { error: "Ciudad y departamento son requeridos" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Método de pago requerido" },
        { status: 400 }
      );
    }

    // Normalizar items a {productId, quantity}
    const normalizedItems = items.map((i) => ({
      productId: i?.product?.id ?? "",
      quantity: Number(i?.quantity ?? 0),
    }));

    // ── Re-cálculo autoritativo server-side ──
    let recalc;
    try {
      recalc = await recalculateOrder(normalizedItems, {
        city: shipping.city,
        department: shipping.department,
        barrio,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error calculando orden";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Warning si el cliente envió totales diferentes (posible intento de fraude)
    const clientSubtotal = Number(body.subtotal);
    const clientTotal = Number(body.total);
    if (
      Number.isFinite(clientSubtotal) &&
      Math.abs(clientSubtotal - recalc.subtotal) > 100
    ) {
      console.warn(
        `[SECURITY] Order ${orderId}: client subtotal ${clientSubtotal} ≠ recalculated ${recalc.subtotal}`
      );
    }
    if (
      Number.isFinite(clientTotal) &&
      Math.abs(clientTotal - recalc.total) > 100
    ) {
      console.warn(
        `[SECURITY] Order ${orderId}: client total ${clientTotal} ≠ recalculated ${recalc.total}`
      );
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    // Construir items para persistencia (con el precio autoritativo)
    const persistedItems: CartItem[] = recalc.items.map((r) => {
      const original = items.find((i) => i?.product?.id === r.productId);
      const originalProduct = (original?.product || {}) as Partial<CartItem["product"]>;
      return {
        product: {
          id: r.product.id,
          name: r.product.nombre,
          description: r.product.descripcion,
          price: r.unitPrice,
          image: r.product.imagen,
          images: r.product.images,
          category: r.product.categoria,
          stock: originalProduct.stock ?? 0,
          brand: originalProduct.brand ?? "valm-beauty",
          weight: r.weightGrams,
        },
        quantity: r.quantity,
      };
    });

    const order: Order = {
      id: orderId,
      items: persistedItems,
      shipping: shipping as Order["shipping"],
      subtotal: recalc.subtotal,
      shippingCost: recalc.shippingCost,
      total: recalc.total,
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

    return NextResponse.json({
      success: true,
      orderId: order.id,
      subtotal: recalc.subtotal,
      shippingCost: recalc.shippingCost,
      total: recalc.total,
    });
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
