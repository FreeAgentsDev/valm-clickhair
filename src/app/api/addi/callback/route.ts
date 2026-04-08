import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";

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
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("ADDI callback:", JSON.stringify(body));

    const { orderId, applicationId, status, approvedAmount } = body as {
      orderId?: string;
      applicationId?: string;
      status?: "APPROVED" | "PENDING" | "REJECTED" | "ABANDONED" | "DECLINED" | "INTERNAL_ERROR";
      approvedAmount?: string;
    };

    if (orderId && status) {
      if (status === "APPROVED") {
        updateOrderStatus(orderId, "paid", applicationId);
        console.log(`ADDI: Orden ${orderId} APROBADA por ${approvedAmount} COP (appId: ${applicationId})`);
      } else {
        console.log(`ADDI: Orden ${orderId} estado ${status} (appId: ${applicationId})`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("ADDI callback error:", error);
    return NextResponse.json({ error: "Error procesando callback" }, { status: 500 });
  }
}
