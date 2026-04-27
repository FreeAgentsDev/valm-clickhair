import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminTestimonials, saveAdminTestimonials } from "@/lib/admin-storage";

export async function GET() {
  const testimonials = await getAdminTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { testimonials } = await request.json();
    await saveAdminTestimonials(testimonials);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error guardando testimonios" }, { status: 500 });
  }
}
