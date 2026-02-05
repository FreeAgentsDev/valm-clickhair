import { NextRequest, NextResponse } from "next/server";

/**
 * API para integrar ADDI (Compra ahora, paga después)
 * Documentación: https://preapproval.addi.com
 * Los comerciantes deben registrarse en addi.com para obtener credenciales
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, customerEmail, customerName, customerPhone } =
      body;

    const addiClientId = process.env.ADDI_CLIENT_ID;
    const addiClientSecret = process.env.ADDI_CLIENT_SECRET;

    if (!addiClientId || !addiClientSecret) {
      return NextResponse.json(
        {
          error:
            "ADDI no configurado. Agrega ADDI_CLIENT_ID y ADDI_CLIENT_SECRET. Regístrate en co.addi.com",
        },
        { status: 500 }
      );
    }

    // Obtener token de ADDI (flujo OAuth simplificado)
    const tokenResponse = await fetch("https://api.addi.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: addiClientId,
        client_secret: addiClientSecret,
        grant_type: "client_credentials",
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "No se pudo conectar con ADDI" },
        { status: 502 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Crear checkout de ADDI
    const addiResponse = await fetch("https://api.addi.com/v1/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: amount,
        currency: "COP",
        customer: {
          email: customerEmail,
          full_name: customerName,
          phone: customerPhone,
        },
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?payment=addi`,
      }),
    });

    const data = await addiResponse.json();

    if (!addiResponse.ok) {
      return NextResponse.json(
        { error: data.message || "Error al crear checkout ADDI" },
        { status: addiResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("ADDI error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
