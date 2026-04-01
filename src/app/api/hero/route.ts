import { NextResponse } from "next/server";
import { getAdminHero } from "@/lib/admin-storage";

export async function GET() {
  const content = getAdminHero();
  return NextResponse.json({ content });
}
