import { NextRequest, NextResponse } from "next/server";

/**
 * API ADDI - Compra ahora, paga después
 *
 * Spec: https://api-docs.addi-staging.com/integration/
 * Endpoint: POST /v1/online-applications
 * Auth: Auth0 client_credentials → JWT
 *
 * Staging: https://api.addi-staging.com
 * Producción: https://api.addi.com
 */

const isStaging = process.env.ADDI_ENV !== "production";

const ADDI_AUTH_URL = isStaging
  ? "https://auth.addi-staging.com/oauth/token"
  : "https://auth.addi.com/oauth/token";

const ADDI_API_URL = isStaging
  ? "https://api.addi-staging.com"
  : "https://api.addi.com";

const ADDI_AUDIENCE = isStaging
  ? "https://api.staging.addi.com"
  : "https://api.addi.com";

/** Obtener token JWT via Auth0 */
async function getAddiToken(): Promise<string> {
  const res = await fetch(ADDI_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.ADDI_CLIENT_ID,
      client_secret: process.env.ADDI_CLIENT_SECRET,
      audience: ADDI_AUDIENCE,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("ADDI Auth error:", res.status, err);
    throw new Error("Error autenticando con ADDI");
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      totalAmount,
      shippingAmount,
      items,
      client,
      shippingAddress,
    } = body as {
      orderId: string;
      totalAmount: number;
      shippingAmount: number;
      items: { sku?: string; name: string; quantity: number; unitPrice: number; pictureUrl?: string; category?: string }[];
      client: { firstName: string; lastName: string; email: string; cellphone: string; idType?: string; idNumber?: string };
      shippingAddress?: { lineOne: string; city: string; state: string; country?: string };
    };

    if (!process.env.ADDI_CLIENT_ID || !process.env.ADDI_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "ADDI no configurado. Faltan credenciales." },
        { status: 500 }
      );
    }

    if (!orderId || !totalAmount || !client?.email) {
      return NextResponse.json(
        { error: "Datos incompletos: orderId, totalAmount y client.email son requeridos" },
        { status: 400 }
      );
    }

    // 1. Obtener token
    const token = await getAddiToken();

    // 2. Crear aplicación de crédito (POST /v1/online-applications)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    // Según spec: totalAmount y shippingAmount son strings con decimales
    const applicationBody = {
      orderId,
      totalAmount: String(totalAmount.toFixed(1)),
      shippingAmount: String((shippingAmount || 0).toFixed(1)),
      currency: "COP",
      items: items.map((item, i) => ({
        sku: item.sku || `SKU-${orderId}-${i}`,
        name: item.name,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
        ...(item.pictureUrl && { pictureUrl: item.pictureUrl }),
        ...(item.category && { category: item.category }),
      })),
      client: {
        idType: client.idType || "CC",
        ...(client.idNumber && { idNumber: client.idNumber }),
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        cellphone: client.cellphone.replace(/\D/g, ""),
      },
      ...(shippingAddress && {
        shippingAddress: {
          lineOne: shippingAddress.lineOne,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country || "CO",
        },
      }),
      allyUrlRedirection: {
        logoUrl: `${baseUrl}/logos/logo.png`,
        callbackUrl: `${baseUrl}/api/addi/callback`,
        redirectionUrl: `${baseUrl}/checkout/success?ref=${orderId}&payment=addi`,
      },
    };

    console.log("ADDI request:", JSON.stringify(applicationBody, null, 2));

    const appRes = await fetch(`${ADDI_API_URL}/v1/online-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationBody),
      redirect: "manual", // Capturar el 301 sin seguirlo
    });

    // ADDI devuelve 301 con Location header
    if (appRes.status === 301 || appRes.status === 302) {
      const redirectUrl = appRes.headers.get("Location");
      if (redirectUrl) {
        return NextResponse.json({ redirectUrl });
      }
    }

    // Si devuelve 200/201
    if (appRes.ok) {
      const data = await appRes.json();
      return NextResponse.json({
        redirectUrl: data.redirectUrl || data.url,
        ...data,
      });
    }

    const errorText = await appRes.text();
    console.error("ADDI error:", appRes.status, errorText);

    let errorMsg = "Error al crear solicitud ADDI";
    try {
      const errorJson = JSON.parse(errorText);
      errorMsg = errorJson.message || errorJson.error || errorMsg;
    } catch {
      // keep default message
    }

    return NextResponse.json({ error: errorMsg }, { status: appRes.status });
  } catch (error) {
    console.error("ADDI error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno al procesar ADDI" },
      { status: 500 }
    );
  }
}
