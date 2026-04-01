import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

/**
 * API para crear preferencia de pago en Mercado Pago (Sandbox/Producción)
 * Documentación: https://www.mercadopago.com.co/developers/es/docs/checkout-pro
 * Requiere: MERCADO_PAGO_ACCESS_TOKEN en .env
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, payer, reference, redirectUrl } = body;

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Mercado Pago no configurado. Agrega MERCADO_PAGO_ACCESS_TOKEN en .env",
        },
        { status: 500 }
      );
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const successUrl = redirectUrl || `${baseUrl}/checkout/success`;
    const isLocalhost = !baseUrl || baseUrl.includes("localhost");

    const preferenceBody: Record<string, unknown> = {
      items: items.map(
        (item: {
          title: string;
          quantity: number;
          unit_price: number;
          picture_url?: string;
        }) => ({
          id: item.title,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: "COP",
          ...(item.picture_url && { picture_url: item.picture_url }),
        })
      ),
      payer: payer?.email
        ? {
            name: payer.name || "Cliente",
            email: payer.email,
            ...(payer.phone && { phone: { number: payer.phone } }),
          }
        : undefined,
      external_reference: reference || `order-${Date.now()}`,
      statement_descriptor: "VALM BEAUTY",
    };

    // back_urls y auto_return solo con URL pública (MP no acepta localhost)
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
