import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getShippingBarrios,
  getShippingNacional,
  upsertBarrio,
  updateBarrio,
  deleteBarrio,
  updateShippingNacional,
} from "@/lib/db";

/** GET - Listar todos los precios de envío */
export async function GET() {
  try {
    const [barrios, nacional] = await Promise.all([
      getShippingBarrios(),
      getShippingNacional(),
    ]);
    return NextResponse.json({ barrios, nacional });
  } catch (error) {
    console.error("Error cargando shipping:", error);
    return NextResponse.json({ barrios: [], nacional: [] });
  }
}

/** POST - Crear/actualizar barrio */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nombre, precio } = body;
    if (!nombre?.trim() || !precio) {
      return NextResponse.json({ error: "Nombre y precio requeridos" }, { status: 400 });
    }
    const barrio = await upsertBarrio(nombre.trim(), Number(precio));
    return NextResponse.json({ barrio });
  } catch (error) {
    console.error("Error creando barrio:", error);
    return NextResponse.json({ error: "Error al crear barrio" }, { status: 500 });
  }
}

/** PUT - Actualizar barrio o fila nacional */
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type } = body;

    if (type === "barrio") {
      const { id, nombre, precio, activo } = body;
      if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
      const barrio = await updateBarrio(id, { nombre, precio: precio != null ? Number(precio) : undefined, activo });
      return NextResponse.json({ barrio });
    }

    if (type === "nacional") {
      const { id, ...data } = body;
      if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
      const numData: Record<string, number> = {};
      for (const [k, v] of Object.entries(data)) {
        if (k !== "type" && v != null) numData[k] = Number(v);
      }
      const fila = await updateShippingNacional(id, numData);
      return NextResponse.json({ fila });
    }

    return NextResponse.json({ error: "type debe ser 'barrio' o 'nacional'" }, { status: 400 });
  } catch (error) {
    console.error("Error actualizando shipping:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

/** DELETE - Eliminar barrio */
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    await deleteBarrio(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando barrio:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
