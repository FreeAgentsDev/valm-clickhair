import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminConfig, saveAdminConfig, type SiteConfig } from "@/lib/admin-storage";

export async function GET() {
  const config = await getAdminConfig();
  return NextResponse.json({ config });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { config?: Partial<SiteConfig> };
    if (!body.config || typeof body.config !== "object") {
      return NextResponse.json({ error: "config requerido" }, { status: 400 });
    }

    const current = await getAdminConfig();
    const incoming = body.config;

    const threshold = Number(incoming.freeShippingThreshold ?? current.freeShippingThreshold);
    if (!Number.isFinite(threshold) || threshold < 0) {
      return NextResponse.json(
        { error: "freeShippingThreshold debe ser un número >= 0" },
        { status: 400 }
      );
    }

    const next: SiteConfig = {
      freeShippingEnabled: Boolean(incoming.freeShippingEnabled ?? current.freeShippingEnabled),
      freeShippingThreshold: Math.round(threshold),
    };

    await saveAdminConfig(next);
    return NextResponse.json({ config: next });
  } catch (err) {
    console.error("Error guardando config:", err);
    return NextResponse.json({ error: "Error guardando config" }, { status: 500 });
  }
}
