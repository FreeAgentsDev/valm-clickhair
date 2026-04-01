import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminPopup, saveAdminPopup } from "@/lib/admin-storage";

export async function GET() {
  const config = getAdminPopup();
  return NextResponse.json({ config });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { config } = await request.json();
    saveAdminPopup(config);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error guardando popup" }, { status: 500 });
  }
}
