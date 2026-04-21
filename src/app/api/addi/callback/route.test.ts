import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * C1 — El callback de ADDI debe:
 *  1. Requerir ADDI_CALLBACK_SECRET en header o query.
 *  2. Validar que la orden exista.
 *  3. Validar que approvedAmount coincida con order.total.
 *  4. Ser idempotente (no re-procesar órdenes ya pagas).
 */

type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered";

const mockGetOrderById = vi.fn();
const mockUpdateOrderStatus = vi.fn();

vi.mock("@/lib/orders", () => ({
  getOrderById: (id: string) => mockGetOrderById(id),
  updateOrderStatus: (id: string, status: OrderStatus, paymentId?: string) =>
    mockUpdateOrderStatus(id, status, paymentId),
}));

import { POST } from "./route";

const SECRET = "a".repeat(40);

function makeRequest(
  body: Record<string, unknown>,
  opts: { secretHeader?: string; secretQuery?: string } = {}
) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.secretHeader) headers["x-addi-secret"] = opts.secretHeader;
  const url = opts.secretQuery
    ? `http://localhost/api/addi/callback?secret=${encodeURIComponent(opts.secretQuery)}`
    : "http://localhost/api/addi/callback";
  return new Request(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("C1: ADDI callback security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADDI_CALLBACK_SECRET = SECRET;
  });

  it("retorna 500 si ADDI_CALLBACK_SECRET no está configurado", async () => {
    delete process.env.ADDI_CALLBACK_SECRET;
    const req = makeRequest({ orderId: "x", status: "APPROVED" });
    const res = await POST(req as never);
    expect(res.status).toBe(500);
  });

  it("retorna 401 si no se envía secret", async () => {
    const req = makeRequest({ orderId: "x", status: "APPROVED" });
    const res = await POST(req as never);
    expect(res.status).toBe(401);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("retorna 401 con secret incorrecto (header)", async () => {
    const req = makeRequest(
      { orderId: "x", status: "APPROVED" },
      { secretHeader: "secret-falso" }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(401);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("retorna 401 con secret incorrecto (query)", async () => {
    const req = makeRequest(
      { orderId: "x", status: "APPROVED" },
      { secretQuery: "secret-falso" }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(401);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("acepta secret válido via header", async () => {
    mockGetOrderById.mockReturnValue({
      id: "ORD-1",
      total: 100000,
      status: "pending",
    });
    const req = makeRequest(
      { orderId: "ORD-1", status: "APPROVED", approvedAmount: "100000" },
      { secretHeader: SECRET }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(mockUpdateOrderStatus).toHaveBeenCalledWith("ORD-1", "paid", undefined);
  });

  it("acepta secret válido via query", async () => {
    mockGetOrderById.mockReturnValue({
      id: "ORD-1",
      total: 100000,
      status: "pending",
    });
    const req = makeRequest(
      { orderId: "ORD-1", status: "APPROVED", approvedAmount: "100000" },
      { secretQuery: SECRET }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(mockUpdateOrderStatus).toHaveBeenCalled();
  });

  it("retorna 404 si la orden no existe", async () => {
    mockGetOrderById.mockReturnValue(undefined);
    const req = makeRequest(
      { orderId: "ORD-FAKE", status: "APPROVED", approvedAmount: "100000" },
      { secretHeader: SECRET }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(404);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("retorna 400 si approvedAmount no coincide con order.total", async () => {
    mockGetOrderById.mockReturnValue({
      id: "ORD-1",
      total: 500000,
      status: "pending",
    });
    // Atacante dice que aprobaron $1, pero la orden es de $500k
    const req = makeRequest(
      { orderId: "ORD-1", status: "APPROVED", approvedAmount: "1" },
      { secretHeader: SECRET }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("tolera diferencia de $100 COP por redondeo", async () => {
    mockGetOrderById.mockReturnValue({
      id: "ORD-1",
      total: 100000,
      status: "pending",
    });
    const req = makeRequest(
      { orderId: "ORD-1", status: "APPROVED", approvedAmount: "100050" },
      { secretHeader: SECRET }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(mockUpdateOrderStatus).toHaveBeenCalled();
  });

  it("es idempotente: orden ya paga no se re-procesa", async () => {
    mockGetOrderById.mockReturnValue({
      id: "ORD-1",
      total: 100000,
      status: "paid", // ya paga
    });
    const req = makeRequest(
      { orderId: "ORD-1", status: "APPROVED", approvedAmount: "100000" },
      { secretHeader: SECRET }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.idempotent).toBe(true);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("status REJECTED no marca como paga", async () => {
    mockGetOrderById.mockReturnValue({
      id: "ORD-1",
      total: 100000,
      status: "pending",
    });
    const req = makeRequest(
      { orderId: "ORD-1", status: "REJECTED" },
      { secretHeader: SECRET }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });
});
