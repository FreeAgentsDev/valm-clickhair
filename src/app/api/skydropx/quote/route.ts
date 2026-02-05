import { NextRequest, NextResponse } from "next/server";

/**
 * API para cotizar envíos con Skydropx
 * Documentación: https://pro.skydropx.com/es-MX/api-docs
 * Obtén credenciales en Conexiones > API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      weight,
      length,
      width,
      height,
      fromPostalCode = "170001", // Manizales
      toPostalCode,
      toCity,
      toDepartment,
    } = body;

    const skydropxToken = process.env.SKYDROPX_TOKEN;

    if (!skydropxToken) {
      return NextResponse.json(
        {
          error:
            "Skydropx no configurado. Agrega SKYDROPX_TOKEN en .env desde pro.skydropx.com",
        },
        { status: 500 }
      );
    }

    // Crear cotización en Skydropx
    const response = await fetch("https://api.skydropx.com/v1/quotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token token=${skydropxToken}`,
      },
      body: JSON.stringify({
        address_from: {
          province: "Caldas",
          city: "Manizales",
          postal_code: fromPostalCode,
        },
        address_to: {
          province: toDepartment || "Caldas",
          city: toCity || "Manizales",
          postal_code: toPostalCode || "170001",
        },
        parcels: [
          {
            weight: weight || 500,
            length: length || 20,
            width: width || 15,
            height: height || 10,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Error al cotizar envío" },
        { status: response.status }
      );
    }

    // Skydropx devuelve opciones de envío con diferentes carrieres
    return NextResponse.json({
      quotations: data.included || data.quotations || [],
      message:
        "Cotización obtenida. Configura SKYDROPX_TOKEN para producción.",
    });
  } catch (error) {
    console.error("Skydropx error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
