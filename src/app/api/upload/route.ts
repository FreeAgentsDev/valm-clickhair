import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";

/**
 * POST /api/upload
 * Sube una o más imágenes a R2.
 * Body: FormData con campo "files" (uno o varios) y opcionalmente "folder".
 * Retorna: { urls: string[] }
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "products";

    if (!files.length) {
      return NextResponse.json({ error: "No se enviaron archivos" }, { status: 400 });
    }

    const urls: string[] = [];
    for (const file of files) {
      if (!(file instanceof File)) continue;
      const url = await uploadToR2(file, folder);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    const msg = error instanceof Error ? error.message : "Error al subir imagen";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
