import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getBrandDiscounts,
  getBrands,
  upsertBrandDiscount,
  updateBrandDiscount,
  deleteBrandDiscount,
} from "@/lib/db";

/** GET - List brand discounts + available brands */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const [discounts, brands] = await Promise.all([
      getBrandDiscounts(),
      getBrands(),
    ]);
    return NextResponse.json({ discounts, brands });
  } catch (error) {
    console.error("Error cargando descuentos de marca:", error);
    return NextResponse.json({ error: "Error al cargar descuentos" }, { status: 500 });
  }
}

/** POST - Create/update a brand discount */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const marca = (body.marca || "").trim();
    const descuento = Number(body.descuento);

    if (!marca) {
      return NextResponse.json({ error: "La marca es requerida" }, { status: 400 });
    }
    if (isNaN(descuento) || descuento < 0 || descuento > 100) {
      return NextResponse.json({ error: "El descuento debe estar entre 0 y 100" }, { status: 400 });
    }

    const discount = await upsertBrandDiscount(marca, descuento);
    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Error creando descuento de marca:", error);
    return NextResponse.json({ error: "Error al crear descuento" }, { status: 500 });
  }
}

/** PUT - Update a brand discount (toggle active, change percentage) */
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

    const discount = await updateBrandDiscount(id, {
      descuento: body.descuento != null ? Number(body.descuento) : undefined,
      activo: body.activo != null ? Boolean(body.activo) : undefined,
    });
    return NextResponse.json({ discount });
  } catch (error) {
    console.error("Error actualizando descuento de marca:", error);
    return NextResponse.json({ error: "Error al actualizar descuento" }, { status: 500 });
  }
}

/** DELETE - Remove a brand discount */
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

    await deleteBrandDiscount(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando descuento de marca:", error);
    return NextResponse.json({ error: "Error al eliminar descuento" }, { status: 500 });
  }
}
