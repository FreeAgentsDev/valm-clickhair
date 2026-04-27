import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrderById, updateOrderStatus } from "@/lib/orders";

/**
 * Webhook de Mercado Pago - Recibe notificaciones de pago
 * Docs: https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");
    const requestId = request.headers.get("x-request-id");

    // Verificación de firma OBLIGATORIA: sin secret o sin firma, se rechaza.
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Webhook MP: MERCADO_PAGO_WEBHOOK_SECRET no configurado");
      return NextResponse.json(
        { error: "Webhook no configurado en el servidor" },
        { status: 500 }
      );
    }
    if (!signature) {
      console.error("Webhook MP: falta header x-signature");
      return NextResponse.json({ error: "Firma requerida" }, { status: 401 });
    }
    if (!verifySignature(body, signature, requestId, webhookSecret)) {
      console.error("Webhook MP: firma inválida");
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    const data = JSON.parse(body);
    console.log("Webhook MP recibido:", data.type, data.action);

    // Mercado Pago envía diferentes tipos de notificación
    if (data.type === "payment") {
      await handlePaymentNotification(data.data?.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}

// Mercado Pago también puede enviar GET para verificar que el endpoint existe
export async function GET() {
  return NextResponse.json({ status: "ok" });
}

function verifySignature(
  body: string,
  signatureHeader: string,
  requestId: string | null,
  secret: string
): boolean {
  try {
    // Mercado Pago v2 signature format: ts=xxx,v1=xxx
    const parts: Record<string, string> = {};
    signatureHeader.split(",").forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) parts[key.trim()] = value.trim();
    });

    const ts = parts["ts"];
    const v1 = parts["v1"];
    if (!ts || !v1) return false;

    // Construir el template para verificar
    const dataId = JSON.parse(body)?.data?.id;
    let template = `id:${dataId};`;
    if (requestId) template += `request-id:${requestId};`;
    template += `ts:${ts};`;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(template);
    const expected = hmac.digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(v1, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

async function handlePaymentNotification(paymentId: string | undefined) {
  if (!paymentId) return;

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Webhook: MERCADO_PAGO_ACCESS_TOKEN no configurado");
    return;
  }

  try {
    // Consultar el pago en la API de Mercado Pago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      console.error("Webhook: error consultando pago", response.status);
      return;
    }

    const payment = await response.json();
    const externalRef = payment.external_reference;
    const status = payment.status;
    const transactionAmount = Number(payment.transaction_amount);

    console.log(`Webhook: Pago ${paymentId} - ref: ${externalRef} - estado: ${status} - monto: ${transactionAmount}`);

    // Mapear estados de Mercado Pago a estados de orden
    const statusMap: Record<string, "paid" | "pending"> = {
      approved: "paid",
      pending: "pending",
      in_process: "pending",
    };

    const orderStatus = statusMap[status];
    if (!orderStatus || !externalRef) return;

    // Verificar que la orden exista y que el monto coincida (solo si APPROVED)
    const order = await getOrderById(externalRef);
    if (!order) {
      console.error(`Webhook: orden ${externalRef} no existe en nuestra BD`);
      return;
    }

    // Idempotencia: si ya está paga, no re-procesar
    if (order.status === "paid" && orderStatus === "paid") {
      console.log(`Webhook: orden ${externalRef} ya estaba paga, ignorando`);
      return;
    }

    if (orderStatus === "paid") {
      // Tolerancia $100 COP para redondeos.
      const diff = Math.abs(transactionAmount - order.total);
      if (!Number.isFinite(transactionAmount) || diff > 100) {
        console.error(
          `[SECURITY] Webhook: monto pagado ${transactionAmount} no coincide con total ${order.total} (ref ${externalRef}). NO se marca como paga.`
        );
        return;
      }
    }

    await updateOrderStatus(externalRef, orderStatus, paymentId.toString());
    console.log(`Webhook: Orden ${externalRef} actualizada a ${orderStatus}`);
  } catch (error) {
    console.error("Webhook: error procesando pago:", error);
  }
}
