import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "node:crypto";

/**
 * C2 — El webhook de Mercado Pago debe:
 *  1. Requerir MERCADO_PAGO_WEBHOOK_SECRET configurado.
 *  2. Requerir header x-signature.
 *  3. Rechazar firmas inválidas.
 *  4. Aceptar firmas válidas.
 *  5. Validar que el monto pagado coincida con order.total antes de marcar como paga.
 *  6. Ser idempotente.
 *
 * No testeamos el handler de handlePaymentNotification porque hace fetch a MP API;
 * nos enfocamos en la verificación de firma que es el gate de seguridad.
 */

const mockGetOrderById = vi.fn();
const mockUpdateOrderStatus = vi.fn();

vi.mock("@/lib/orders", () => ({
  getOrderById: (id: string) => mockGetOrderById(id),
  updateOrderStatus: (id: string, status: string, paymentId?: string) =>
    mockUpdateOrderStatus(id, status, paymentId),
}));

import { POST } from "./route";

const SECRET = "webhook-secret-random-string";

function buildValidSignature(
  body: string,
  secret: string,
  requestId: string
): { signature: string; ts: string } {
  const ts = Date.now().toString();
  const dataId = JSON.parse(body)?.data?.id;
  const template = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(template);
  const v1 = hmac.digest("hex");
  return { signature: `ts=${ts},v1=${v1}`, ts };
}

function makeRequest(
  bodyObj: Record<string, unknown>,
  opts: { signature?: string; requestId?: string } = {}
) {
  const body = JSON.stringify(bodyObj);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.signature) headers["x-signature"] = opts.signature;
  if (opts.requestId) headers["x-request-id"] = opts.requestId;
  return new Request("http://localhost/api/mercado-pago/webhook", {
    method: "POST",
    headers,
    body,
  });
}

describe("C2: MP webhook security gate", () => {
  const originalSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MERCADO_PAGO_WEBHOOK_SECRET = SECRET;
  });

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    else process.env.MERCADO_PAGO_WEBHOOK_SECRET = originalSecret;
  });

  it("retorna 500 si MERCADO_PAGO_WEBHOOK_SECRET no está configurado", async () => {
    delete process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    const req = makeRequest({ type: "payment", data: { id: "123" } });
    const res = await POST(req as never);
    expect(res.status).toBe(500);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("retorna 401 sin header x-signature", async () => {
    const req = makeRequest({ type: "payment", data: { id: "123" } });
    const res = await POST(req as never);
    expect(res.status).toBe(401);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("retorna 401 con firma inválida", async () => {
    const req = makeRequest(
      { type: "payment", data: { id: "123" } },
      { signature: "ts=999,v1=cafecafecafe", requestId: "req-1" }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(401);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("retorna 401 con formato de firma malformado", async () => {
    const req = makeRequest(
      { type: "payment", data: { id: "123" } },
      { signature: "basura", requestId: "req-1" }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(401);
  });

  it("acepta firma válida (llega al handler de pago)", async () => {
    const bodyObj = { type: "notification_other", data: { id: "999" } };
    const body = JSON.stringify(bodyObj);
    const requestId = "req-valid-1";
    const { signature } = buildValidSignature(body, SECRET, requestId);

    const req = new Request("http://localhost/api/mercado-pago/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": signature,
        "x-request-id": requestId,
      },
      body,
    });

    const res = await POST(req as never);
    // Tipo "notification_other" → no entra a handlePaymentNotification, responde 200
    expect(res.status).toBe(200);
  });

  it("GET retorna 200 (MP lo usa para verificar existencia del endpoint)", async () => {
    const { GET } = await import("./route");
    const res = await GET();
    expect(res.status).toBe(200);
  });
});
