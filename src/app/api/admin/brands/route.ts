import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getBrands, createBrand, deleteBrand } from "@/lib/db";

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json({ brands });
  } catch {
    return NextResponse.json({ brands: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }
    const brand = await createBrand(body.nombre);
    return NextResponse.json({ brand });
  } catch (error) {
    console.error("Error creando marca:", error);
    return NextResponse.json({ error: "Error al crear marca" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }
    await deleteBrand(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando marca:", error);
    return NextResponse.json({ error: "Error al eliminar marca" }, { status: 500 });
  }
}
