import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getCategoryDiscounts,
  getCategories,
  upsertCategoryDiscount,
  updateCategoryDiscount,
  deleteCategoryDiscount,
} from "@/lib/db";

/** GET - List category discounts + available categories */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const [discounts, categories] = await Promise.all([
      getCategoryDiscounts(),
      getCategories(),
    ]);
    return NextResponse.json({ discounts, categories });
  } catch (error) {
    console.error("Error cargando descuentos:", error);
    return NextResponse.json({ error: "Error al cargar descuentos" }, { status: 500 });
  }
}

/** POST - Create/update a category discount */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const categoria = (body.categoria || "").trim();
    const descuento = Number(body.descuento);

    if (!categoria) {
      return NextResponse.json({ error: "La categoría es requerida" }, { status: 400 });
    }
    if (isNaN(descuento) || descuento < 0 || descuento > 100) {
      return NextResponse.json({ error: "El descuento debe estar entre 0 y 100" }, { status: 400 });
    }

    const discount = await upsertCategoryDiscount(categoria, descuento);
    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Error creando descuento:", error);
    return NextResponse.json({ error: "Error al crear descuento" }, { status: 500 });
  }
}

/** PUT - Update a category discount (toggle active, change percentage) */
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const discount = await updateCategoryDiscount(id, {
      descuento: body.descuento != null ? Number(body.descuento) : undefined,
      activo: body.activo != null ? Boolean(body.activo) : undefined,
    });
    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Error actualizando descuento:", error);
    return NextResponse.json({ error: "Error al actualizar descuento" }, { status: 500 });
  }
}

/** DELETE - Remove a category discount */
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await deleteCategoryDiscount(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando descuento:", error);
    return NextResponse.json({ error: "Error al eliminar descuento" }, { status: 500 });
  }
}
