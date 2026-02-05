import { NextRequest, NextResponse } from "next/server";

/**
 * API para crear transacción en Wompi
 * Documentación: https://docs.wompi.co/en/docs/colombia/
 * Requiere: WOMPI_API_KEY y WOMPI_USER_PRINCIPAL_ID en .env
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, reference, redirectUrl, customerEmail, customerName } =
      body;

    const apiKey = process.env.WOMPI_API_KEY;
    const principalId = process.env.WOMPI_USER_PRINCIPAL_ID;

    if (!apiKey || !principalId) {
      return NextResponse.json(
        {
          error: "Wompi no configurado. Agrega WOMPI_API_KEY y WOMPI_USER_PRINCIPAL_ID en .env",
        },
        { status: 500 }
      );
    }

    // Crear transacción en Wompi
    const wompiResponse = await fetch(
      "https://production.wompi.co/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "user-principal-id": principalId,
        },
        body: JSON.stringify({
          acceptance_token: process.env.WOMPI_ACCEPTANCE_TOKEN,
          amount_in_cents: Math.round(amount * 100), // COP en centavos
          currency: "COP",
          customer_email: customerEmail,
          customer_data: {
            full_name: customerName,
          },
          reference: reference,
          redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        }),
      }
    );

    const data = await wompiResponse.json();

    if (!wompiResponse.ok) {
      return NextResponse.json(
        { error: data.error?.reason || "Error al crear transacción" },
        { status: wompiResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Wompi error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
