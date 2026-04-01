import { NextRequest, NextResponse } from "next/server";
import { getShippingBarrios, getShippingNacional } from "@/lib/db";
import { getShippingZone, getZoneLabel } from "@/lib/shipping-zones";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, department, barrio, totalWeightGrams } = body as {
      city?: string;
      department?: string;
      barrio?: string;
      totalWeightGrams?: number;
    };

    if (!city?.trim()) {
      return NextResponse.json({ error: "Ciudad requerida" }, { status: 400 });
    }

    const zone = getShippingZone(city, department || "");

    // ── Manizales: envío local por barrio ──
    if (zone === "local") {
      if (!barrio) {
        return NextResponse.json({
          tipo: "local",
          zona: "local",
          costo: null,
          mensaje: "Selecciona tu barrio para ver el costo de envío",
        });
      }
      const barrios = await getShippingBarrios();
      const found = barrios.find(
        (b) => b.activo && b.nombre.toLowerCase() === barrio.toLowerCase()
      );
      if (!found) {
        return NextResponse.json({ error: "Barrio no encontrado" }, { status: 404 });
      }
      return NextResponse.json({
        tipo: "local",
        zona: "local",
        costo: found.precio,
        barrio: found.nombre,
        mensaje: `Envío local Master Envíos - ${found.nombre}`,
      });
    }

    // ── Fuera de Manizales: calcular por zona y peso ──
    const weight = totalWeightGrams || 300;
    const kilos = Math.max(1, Math.ceil(weight / 1000));
    const tabla = await getShippingNacional();
    const fila = tabla.find((f) => f.kilos >= kilos) ?? tabla[tabla.length - 1];

    if (!fila) {
      return NextResponse.json({ error: "No se encontró tarifa" }, { status: 500 });
    }

    // Seleccionar precio según zona
    const priceKey: Record<string, keyof typeof fila> = {
      regional: "precio_regional",
      nacional: "precio_nacional",
      reexpedido: "precio_reexpedido",
      reexpedido_especial: "precio_reexpedido_especial",
    };

    const key = priceKey[zone] || "precio_nacional";
    const costo = Number(fila[key]);
    const zoneLabel = getZoneLabel(zone);

    return NextResponse.json({
      tipo: "nacional",
      zona: zone,
      costo,
      pesoKg: kilos,
      mensaje: `Envía - ${zoneLabel} - ${kilos}kg`,
    });
  } catch (error) {
    console.error("Error cotizando envío:", error);
    return NextResponse.json({ error: "Error al cotizar envío" }, { status: 500 });
  }
}
