import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * C3 — Integración: POST /api/orders debe ignorar los precios del cliente
 * y guardar la orden con montos recalculados desde BD.
 */

type DbProduct = {
  id: string;
  nombre: string;
  precio: number;
  descuento: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  peso_gramos: number;
  created_at: string;
  images: string[];
};

const mockGetProductById = vi.fn();
const mockGetShippingBarrios = vi.fn();
const mockGetShippingNacional = vi.fn();
const mockApplyCategDiscounts = vi.fn();
const mockSaveOrder = vi.fn();

vi.mock("@/lib/db", () => ({
  getProductById: (id: string) => mockGetProductById(id),
  getShippingBarrios: () => mockGetShippingBarrios(),
  getShippingNacional: () => mockGetShippingNacional(),
  applyCategDiscounts: (products: DbProduct[]) => mockApplyCategDiscounts(products),
}));

vi.mock("@/lib/orders", () => ({
  saveOrder: (order: unknown) => mockSaveOrder(order),
  getOrders: () => [],
}));

// Nota: isAuthenticated no se llama en POST /api/orders (es público para checkout).
vi.mock("@/lib/auth", () => ({
  isAuthenticated: async () => false,
}));

import { POST } from "./route";

const product = (overrides: Partial<DbProduct> = {}): DbProduct => ({
  id: "p1",
  nombre: "Shampoo Premium",
  precio: 100000,
  descuento: 0,
  descripcion: "",
  categoria: "cuidado",
  imagen: "https://example.com/img.jpg",
  peso_gramos: 400,
  created_at: "2026-01-01",
  images: [],
  ...overrides,
});

function buildRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("C3: POST /api/orders (integración)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApplyCategDiscounts.mockImplementation((products) => products);
    mockGetShippingBarrios.mockResolvedValue([
      { id: 1, nombre: "Palogrande", precio: 8000, activo: true },
    ]);
  });

  it("rechaza si faltan datos esenciales", async () => {
    const req = buildRequest({ items: [], shipping: {}, orderId: "x" });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    expect(mockSaveOrder).not.toHaveBeenCalled();
  });

  it("rechaza si no hay consentimiento de datos", async () => {
    mockGetProductById.mockResolvedValue(product());
    const req = buildRequest({
      items: [{ product: { id: "p1" }, quantity: 1 }],
      shipping: {
        email: "a@b.com",
        city: "Manizales",
        department: "Caldas",
      },
      orderId: "ORD-NOCONSENT",
      paymentMethod: "mercado-pago",
      barrio: "Palogrande",
      // consent ausente
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/consent|Política|Pol/i);
  });

  it("IGNORA el total manipulado que envía el cliente", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 100000 }));
    // Cliente manda subtotal: 1 y total: 1 intentando pagar solo $1
    const req = buildRequest({
      orderId: "ORD-HACK",
      items: [{ product: { id: "p1" }, quantity: 1 }],
      shipping: {
        email: "attacker@example.com",
        city: "Manizales",
        department: "Caldas",
      },
      barrio: "Palogrande",
      subtotal: 1, // mentira
      shippingCost: 0, // mentira
      total: 1, // mentira
      paymentMethod: "mercado-pago",
      consent: { acceptedAt: new Date().toISOString() },
    });

    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = await res.json();

    // El servidor respondió con los montos recalculados (no con los del cliente)
    expect(json.subtotal).toBe(100000);
    expect(json.shippingCost).toBe(8000);
    expect(json.total).toBe(108000);

    // Y guardó la orden con los montos autoritativos
    expect(mockSaveOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotal: 100000,
        shippingCost: 8000,
        total: 108000,
      })
    );
  });

  it("aplica envío gratis si subtotal >= $200,000 (ignora shippingCost del cliente)", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 250000 }));
    const req = buildRequest({
      orderId: "ORD-FREESHIP",
      items: [{ product: { id: "p1" }, quantity: 1 }],
      shipping: {
        email: "a@b.com",
        city: "Bogotá",
        department: "Cundinamarca",
      },
      subtotal: 250000,
      shippingCost: 50000, // cliente intenta cobrarse envío aunque deba ser gratis
      total: 300000,
      paymentMethod: "mercado-pago",
      consent: { acceptedAt: new Date().toISOString() },
    });

    const res = await POST(req as never);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.shippingCost).toBe(0);
    expect(json.total).toBe(250000);
  });

  it("rechaza si un producto no existe en BD", async () => {
    mockGetProductById.mockResolvedValue(null);
    const req = buildRequest({
      orderId: "ORD-FAKEPROD",
      items: [{ product: { id: "producto-inventado" }, quantity: 1 }],
      shipping: {
        email: "a@b.com",
        city: "Manizales",
        department: "Caldas",
      },
      barrio: "Palogrande",
      paymentMethod: "mercado-pago",
      consent: { acceptedAt: new Date().toISOString() },
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    expect(mockSaveOrder).not.toHaveBeenCalled();
  });

  it("rechaza si falta ciudad o departamento", async () => {
    mockGetProductById.mockResolvedValue(product());
    const req = buildRequest({
      orderId: "ORD-NOADDR",
      items: [{ product: { id: "p1" }, quantity: 1 }],
      shipping: { email: "a@b.com" },
      paymentMethod: "mercado-pago",
      consent: { acceptedAt: new Date().toISOString() },
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("rechaza cantidad inválida (ej. 9999 unidades)", async () => {
    mockGetProductById.mockResolvedValue(product());
    const req = buildRequest({
      orderId: "ORD-HUGEQTY",
      items: [{ product: { id: "p1" }, quantity: 9999 }],
      shipping: {
        email: "a@b.com",
        city: "Manizales",
        department: "Caldas",
      },
      barrio: "Palogrande",
      paymentMethod: "mercado-pago",
      consent: { acceptedAt: new Date().toISOString() },
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("guarda la IP del cliente en consent", async () => {
    mockGetProductById.mockResolvedValue(product());
    const req = new Request("http://localhost/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "203.0.113.42, 10.0.0.1",
      },
      body: JSON.stringify({
        orderId: "ORD-IP",
        items: [{ product: { id: "p1" }, quantity: 1 }],
        shipping: {
          email: "a@b.com",
          city: "Manizales",
          department: "Caldas",
        },
        barrio: "Palogrande",
        paymentMethod: "mercado-pago",
        consent: { acceptedAt: new Date().toISOString() },
      }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(mockSaveOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        consent: expect.objectContaining({ ipAddress: "203.0.113.42" }),
      })
    );
  });
});
