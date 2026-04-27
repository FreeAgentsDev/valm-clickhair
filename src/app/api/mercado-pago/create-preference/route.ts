import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getOrderById } from "@/lib/orders";

/**
 * API para crear preferencia de pago en Mercado Pago (Sandbox/Producción)
 * Documentación: https://www.mercadopago.com.co/developers/es/docs/checkout-pro
 * Requiere: MERCADO_PAGO_ACCESS_TOKEN en .env
 *
 * IMPORTANTE: usamos los montos AUTORITATIVOS de la orden guardada en BD,
 * NO confiamos en lo que mande el cliente. Esto previene manipulación de precios.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payer, reference, redirectUrl } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "reference (orderId) requerido" },
        { status: 400 }
      );
    }

    const order = await getOrderById(reference);
    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada. Guarda la orden antes de crear la preferencia." },
        { status: 404 }
      );
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago no configurado." },
        { status: 500 }
      );
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const successUrl = redirectUrl || `${baseUrl}/checkout/success`;
    const isLocalhost = !baseUrl || baseUrl.includes("localhost");

    // Items desde la orden (precios verificados server-side)
    const mpItems = order.items.map((item) => ({
      id: item.product.id,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: "COP",
      ...(item.product.image && { picture_url: item.product.image }),
    }));

    // Agregar envío como item separado si > 0 (para que el total concuerde)
    if (order.shippingCost > 0) {
      mpItems.push({
        id: "shipping",
        title: "Envío",
        quantity: 1,
        unit_price: order.shippingCost,
        currency_id: "COP",
      });
    }

    const preferenceBody: Record<string, unknown> = {
      items: mpItems,
      payer: payer?.email
        ? {
            name: payer.name || order.shipping.name || "Cliente",
            email: payer.email || order.shipping.email,
            ...(payer.phone && { phone: { number: payer.phone } }),
          }
        : {
            name: order.shipping.name || "Cliente",
            email: order.shipping.email,
          },
      external_reference: reference,
      statement_descriptor: "VALM BEAUTY",
    };

    if (!isLocalhost) {
      preferenceBody.back_urls = {
        success: successUrl,
        failure: `${baseUrl}/checkout?status=failure`,
        pending: `${baseUrl}/checkout?status=pending`,
      };
      preferenceBody.auto_return = "approved";
      preferenceBody.notification_url = `${baseUrl}/api/mercado-pago/webhook`;
    }

    const result = await preference.create({ body: preferenceBody as never });

    return NextResponse.json({
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      id: result.id,
    });
  } catch (error) {
    console.error("Mercado Pago error:", error);
    return NextResponse.json(
      { error: "Error al crear preferencia de pago" },
      { status: 500 }
    );
  }
}
