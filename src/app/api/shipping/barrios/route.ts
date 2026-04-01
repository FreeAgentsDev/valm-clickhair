import { NextRequest, NextResponse } from "next/server";
import { getShippingBarrios } from "@/lib/db";

/** GET - Buscar barrios activos (público, para autocomplete del checkout) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    const barrios = await getShippingBarrios();
    const activos = barrios.filter((b) => b.activo);

    if (!q) {
      return NextResponse.json({ barrios: activos.slice(0, 10) });
    }

    const filtered = activos
      .filter((b) => b.nombre.toLowerCase().includes(q))
      .slice(0, 10);

    return NextResponse.json({ barrios: filtered });
  } catch (error) {
    console.error("Error buscando barrios:", error);
    return NextResponse.json({ barrios: [] });
  }
}
