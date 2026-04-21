import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * C6 — /api/admin/products/weights GET debe requerir autenticación.
 * Es el único endpoint GET bajo /api/admin/* que no tiene consumidor público.
 */

const mockIsAuthenticated = vi.fn();
const mockGetProducts = vi.fn();
const mockBulkUpdateWeights = vi.fn();

vi.mock("@/lib/auth", () => ({
  isAuthenticated: () => mockIsAuthenticated(),
}));

vi.mock("@/lib/db", () => ({
  getProducts: () => mockGetProducts(),
  bulkUpdateWeights: (updates: unknown) => mockBulkUpdateWeights(updates),
}));

import { GET, POST } from "./route";

describe("C6: /api/admin/products/weights requiere auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET retorna 401 sin autenticación", async () => {
    mockIsAuthenticated.mockResolvedValue(false);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(mockGetProducts).not.toHaveBeenCalled();
  });

  it("GET retorna 200 con autenticación válida", async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockGetProducts.mockResolvedValue([
      {
        id: "p1",
        nombre: "Shampoo",
        descripcion: "",
        categoria: "cuidado",
        peso_gramos: 400,
      },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.products).toHaveLength(1);
    expect(json.products[0].peso_gramos).toBe(400);
  });

  it("POST retorna 401 sin autenticación", async () => {
    mockIsAuthenticated.mockResolvedValue(false);
    const req = new Request("http://localhost/api/admin/products/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: [{ id: "p1", peso_gramos: 500 }] }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(401);
    expect(mockBulkUpdateWeights).not.toHaveBeenCalled();
  });

  it("POST con auth actualiza pesos", async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockBulkUpdateWeights.mockResolvedValue(1);
    const req = new Request("http://localhost/api/admin/products/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: [{ id: "p1", peso_gramos: 500 }] }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(mockBulkUpdateWeights).toHaveBeenCalledWith([
      { id: "p1", peso_gramos: 500 },
    ]);
  });

  it("POST rechaza updates vacíos", async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    const req = new Request("http://localhost/api/admin/products/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: [] }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });
});
