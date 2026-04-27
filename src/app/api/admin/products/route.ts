import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getProducts,
  getProductById,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/db";
import { deleteMultipleFromR2 } from "@/lib/r2";

/** GET - Listar productos, categorías y marcas de la BD */
export async function GET() {
  try {
    const [dbProducts, categories, brands] = await Promise.all([
      getProducts().catch(() => []),
      getCategories().catch(() => []),
      getBrands().catch(() => []),
    ]);
    return NextResponse.json({ dbProducts, categories, brands });
  } catch {
    return NextResponse.json({ dbProducts: [], categories: [], brands: [] });
  }
}

/** POST - Crear producto en BD */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }
    const product = await createProduct({
      nombre: body.nombre.trim(),
      precio: Number(body.precio) || 0,
      descuento: Number(body.descuento) || 0,
      descripcion: (body.descripcion || "").trim(),
      categoria: (body.categoria || "").trim(),
      marca: (body.marca || "").trim(),
      imagen: (body.imagen || "").trim(),
      peso_gramos: body.peso_gramos != null ? Number(body.peso_gramos) : undefined,
      images: body.images || [],
    });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error creando producto:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}

/** PUT - Actualizar producto en BD */
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }
    if (!body.nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const previous = await getProductById(body.id);

    const product = await updateProduct(body.id, {
      nombre: body.nombre.trim(),
      precio: Number(body.precio) || 0,
      descuento: Number(body.descuento) || 0,
      descripcion: (body.descripcion || "").trim(),
      categoria: (body.categoria || "").trim(),
      marca: (body.marca || "").trim(),
      imagen: (body.imagen || "").trim(),
      peso_gramos: body.peso_gramos != null ? Number(body.peso_gramos) : undefined,
      images: body.images || [],
    });

    // Limpiar de R2 las imágenes que se quitaron en esta actualización
    if (previous) {
      const oldUrls = new Set<string>([
        ...(previous.images || []),
        ...(previous.imagen ? [previous.imagen] : []),
      ]);
      const newUrls = new Set<string>([
        ...(product.images || []),
        ...(product.imagen ? [product.imagen] : []),
      ]);
      const removed = [...oldUrls].filter((u) => u && !newUrls.has(u));
      if (removed.length) {
        deleteMultipleFromR2(removed).catch(() => {});
      }
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

/** DELETE - Eliminar producto de BD */
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
    // Obtener imágenes antes de eliminar para limpiar R2
    const product = await getProductById(id);
    await deleteProduct(id);

    // Limpiar imágenes de R2 (best-effort)
    if (product) {
      const allImageUrls = [
        ...(product.images || []),
        ...(product.imagen ? [product.imagen] : []),
      ];
      if (allImageUrls.length) {
        deleteMultipleFromR2(allImageUrls).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
