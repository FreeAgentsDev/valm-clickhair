import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrderById, updateOrderStatus } from "@/lib/orders";

/**
 * Callback de ADDI - Recibe el resultado de la solicitud de crédito
 *
 * Schema (OnlineLoanApplicationCallbackRequest):
 *  - orderId: string (ID de la orden del ecommerce)
 *  - applicationId: string (ID de ADDI)
 *  - approvedAmount: string (ej: "150000.0")
 *  - currency: "COP"
 *  - status: APPROVED | PENDING | REJECTED | ABANDONED | DECLINED | INTERNAL_ERROR
 *  - statusTimestamp: string (unixtime UTC)
 *
 * Protecciones:
 *  1. Requiere secret compartido en header `x-addi-secret` o query `?secret=` (si ADDI_CALLBACK_SECRET está seteado).
 *  2. Verifica que la orden exista en nuestro sistema.
 *  3. Verifica que `approvedAmount` coincida con `order.total` (tolerancia $100 COP).
 *  4. Idempotente: si la orden ya está "paid", no re-procesa.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación por secret compartido (obligatorio si está configurado)
    const expectedSecret = process.env.ADDI_CALLBACK_SECRET;
    if (!expectedSecret) {
      console.error(
        "ADDI callback: ADDI_CALLBACK_SECRET no configurado. Rechazando."
      );
      return NextResponse.json(
        { error: "Callback no configurado en el servidor" },
        { status: 500 }
      );
    }

    const providedSecret =
      request.headers.get("x-addi-secret") ||
      new URL(request.url).searchParams.get("secret");

    if (!providedSecret || !timingSafeEqualStr(providedSecret, expectedSecret)) {
      console.error("ADDI callback: secret inválido o ausente");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    console.log("ADDI callback recibido:", JSON.stringify(body));

    const { orderId, applicationId, status, approvedAmount } = body as {
      orderId?: string;
      applicationId?: string;
      status?:
        | "APPROVED"
        | "PENDING"
        | "REJECTED"
        | "ABANDONED"
        | "DECLINED"
        | "INTERNAL_ERROR";
      approvedAmount?: string;
    };

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId y status son requeridos" },
        { status: 400 }
      );
    }

    // 2. Verificar que la orden exista
    const order = getOrderById(orderId);
    if (!order) {
      console.error(`ADDI callback: orden ${orderId} no encontrada`);
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    if (status !== "APPROVED") {
      console.log(
        `ADDI: Orden ${orderId} estado ${status} (appId: ${applicationId})`
      );
      return NextResponse.json({ received: true });
    }

    // 3. Idempotencia: si ya está pagada, no re-procesar
    if (order.status === "paid") {
      console.log(`ADDI callback: orden ${orderId} ya estaba paga, ignorando`);
      return NextResponse.json({ received: true, idempotent: true });
    }

    // 4. Validar que el monto aprobado coincida con el total de la orden
    const approvedNum = approvedAmount ? Number(approvedAmount) : NaN;
    if (!isFinite(approvedNum)) {
      console.error(`ADDI callback: approvedAmount inválido: ${approvedAmount}`);
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
    }

    const diff = Math.abs(approvedNum - order.total);
    if (diff > 100) {
      // Tolerancia de $100 COP para redondeo.
      console.error(
        `ADDI callback: monto aprobado ${approvedNum} no coincide con total ${order.total} (diff ${diff})`
      );
      return NextResponse.json(
        { error: "Monto aprobado no coincide con la orden" },
        { status: 400 }
      );
    }

    updateOrderStatus(orderId, "paid", applicationId);
    console.log(
      `ADDI: Orden ${orderId} APROBADA por ${approvedAmount} COP (appId: ${applicationId})`
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("ADDI callback error:", error);
    return NextResponse.json(
      { error: "Error procesando callback" },
      { status: 500 }
    );
  }
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
