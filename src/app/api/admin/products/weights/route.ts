import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProducts, bulkUpdateWeights } from "@/lib/db";

/** GET - Listar productos con peso para asignación masiva */
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        categoria: p.categoria,
        peso_gramos: p.peso_gramos,
      })),
    });
  } catch (error) {
    console.error("Error listando pesos:", error);
    return NextResponse.json({ error: "Error al listar" }, { status: 500 });
  }
}

/** POST - Actualización masiva de pesos */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: { id: string; peso_gramos: number }[] = body.updates;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "Se requiere un array de updates [{id, peso_gramos}]" }, { status: 400 });
    }

    const count = await bulkUpdateWeights(updates);
    return NextResponse.json({ success: true, updated: count });
  } catch (error) {
    console.error("Error actualizando pesos:", error);
    return NextResponse.json({ error: "Error al actualizar pesos" }, { status: 500 });
  }
}
