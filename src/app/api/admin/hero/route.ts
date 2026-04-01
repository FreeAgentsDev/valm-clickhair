import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminHero, saveAdminHero } from "@/lib/admin-storage";

export async function GET() {
  const content = getAdminHero();
  return NextResponse.json({ content });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    saveAdminHero(content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error guardando contenido" }, { status: 500 });
  }
}
