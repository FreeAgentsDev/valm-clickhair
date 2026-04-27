import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminMarquee, saveAdminMarquee } from "@/lib/admin-storage";

export async function GET() {
  const messages = await getAdminMarquee();
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { messages } = await request.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }
    await saveAdminMarquee(messages.filter((m: string) => typeof m === "string" && m.trim()));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error guardando mensajes" }, { status: 500 });
  }
}
