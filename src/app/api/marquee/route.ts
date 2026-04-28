import { NextResponse } from "next/server";
import { getAdminMarquee } from "@/lib/admin-storage";

const DEFAULT_MESSAGES = [
  "Envíos a todo Colombia",
  "Pago seguro con Mercado Pago y ADDI",
  "Productos 100% originales",
  "Compra fácil y rápido",
  "Marcas certificadas",
];

export async function GET() {
  const messages = (await getAdminMarquee()) ?? DEFAULT_MESSAGES;
  return NextResponse.json({ messages });
}
