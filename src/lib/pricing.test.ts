import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * C3 — El servidor NUNCA debe confiar en precios del cliente.
 * recalculateOrder() debe:
 *  1. Ignorar precios/totales del cliente.
 *  2. Recalcular todo desde la BD.
 *  3. Aplicar descuentos de categoría.
 *  4. Aplicar envío gratis sobre $200,000.
 *  5. Resolver envío por barrio (Manizales) o zona nacional.
 */

// ── Mocks del layer de BD ──
const mockGetProductById = vi.fn();
const mockGetShippingBarrios = vi.fn();
const mockGetShippingNacional = vi.fn();
const mockApplyCategDiscounts = vi.fn();

vi.mock("@/lib/db", () => ({
  getProductById: (id: string) => mockGetProductById(id),
  getShippingBarrios: () => mockGetShippingBarrios(),
  getShippingNacional: () => mockGetShippingNacional(),
  applyCategDiscounts: (products: unknown[]) => mockApplyCategDiscounts(products),
}));

import { recalculateOrder, FREE_SHIPPING_THRESHOLD } from "./pricing";

const product = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: "p1",
  nombre: "Shampoo",
  precio: 50000,
  descuento: 0,
  descripcion: "",
  categoria: "cuidado",
  imagen: "",
  peso_gramos: 400,
  created_at: "2026-01-01",
  images: [],
  ...overrides,
});

describe("C3: recalculateOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Por defecto applyCategDiscounts retorna los mismos productos (sin cambios)
    mockApplyCategDiscounts.mockImplementation((products) => products);
  });

  it("usa el precio de la BD, NO el precio que envía el cliente", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 100000 }));
    mockGetShippingBarrios.mockResolvedValue([
      { id: 1, nombre: "Palogrande", precio: 8000, activo: true },
    ]);

    const result = await recalculateOrder(
      [{ productId: "p1", quantity: 1 }],
      { city: "Manizales", department: "Caldas", barrio: "Palogrande" }
    );

    // Aunque el cliente mintiera diciendo precio=1, el server lee 100000 de BD
    expect(result.subtotal).toBe(100000);
    expect(result.items[0].unitPrice).toBe(100000);
  });

  it("aplica descuento de producto correctamente", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 100000, descuento: 20 }));
    mockGetShippingBarrios.mockResolvedValue([
      { id: 1, nombre: "Palogrande", precio: 8000, activo: true },
    ]);

    const result = await recalculateOrder(
      [{ productId: "p1", quantity: 1 }],
      { city: "Manizales", department: "Caldas", barrio: "Palogrande" }
    );

    expect(result.items[0].unitPrice).toBe(80000); // 100k * 0.8
    expect(result.subtotal).toBe(80000);
  });

  it("aplica envío gratis si subtotal >= $200,000", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 250000 }));

    const result = await recalculateOrder(
      [{ productId: "p1", quantity: 1 }],
      { city: "Bogotá", department: "Cundinamarca" }
    );

    expect(result.subtotal).toBe(250000);
    expect(result.shippingCost).toBe(0);
    expect(result.total).toBe(250000);
    // No debió haber consultado la tabla de envíos (subtotal >= threshold)
    expect(mockGetShippingNacional).not.toHaveBeenCalled();
  });

  it("cobra envío local por barrio desde BD (Manizales)", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 50000 }));
    mockGetShippingBarrios.mockResolvedValue([
      { id: 1, nombre: "Palogrande", precio: 8000, activo: true },
      { id: 2, nombre: "Centro", precio: 6000, activo: true },
    ]);

    const result = await recalculateOrder(
      [{ productId: "p1", quantity: 1 }],
      { city: "Manizales", department: "Caldas", barrio: "Palogrande" }
    );

    expect(result.shippingCost).toBe(8000);
    expect(result.total).toBe(58000);
  });

  it("rechaza si no se provee barrio para Manizales", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 50000 }));

    await expect(
      recalculateOrder(
        [{ productId: "p1", quantity: 1 }],
        { city: "Manizales", department: "Caldas" }
      )
    ).rejects.toThrow(/barrio/);
  });

  it("rechaza si el barrio no existe en BD", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 50000 }));
    mockGetShippingBarrios.mockResolvedValue([
      { id: 1, nombre: "Palogrande", precio: 8000, activo: true },
    ]);

    await expect(
      recalculateOrder(
        [{ productId: "p1", quantity: 1 }],
        { city: "Manizales", department: "Caldas", barrio: "BarrioFalso" }
      )
    ).rejects.toThrow(/Barrio no encontrado/);
  });

  it("rechaza si el producto no existe en BD", async () => {
    mockGetProductById.mockResolvedValue(null);

    await expect(
      recalculateOrder(
        [{ productId: "fake-id", quantity: 1 }],
        { city: "Bogotá", department: "Cundinamarca" }
      )
    ).rejects.toThrow(/Producto no encontrado/);
  });

  it("rechaza cantidad inválida (0, negativa o >100)", async () => {
    mockGetProductById.mockResolvedValue(product());

    await expect(
      recalculateOrder([{ productId: "p1", quantity: 0 }], {
        city: "Bogotá",
        department: "Cundinamarca",
      })
    ).rejects.toThrow(/Cantidad inválida/);

    await expect(
      recalculateOrder([{ productId: "p1", quantity: -1 }], {
        city: "Bogotá",
        department: "Cundinamarca",
      })
    ).rejects.toThrow(/Cantidad inválida/);

    await expect(
      recalculateOrder([{ productId: "p1", quantity: 101 }], {
        city: "Bogotá",
        department: "Cundinamarca",
      })
    ).rejects.toThrow(/Cantidad inválida/);
  });

  it("cobra envío nacional según zona y peso", async () => {
    mockGetProductById.mockResolvedValue(product({ precio: 50000, peso_gramos: 400 }));
    mockGetShippingNacional.mockResolvedValue([
      {
        id: 1,
        kilos: 1,
        precio_local: 5000,
        precio_regional: 10000,
        precio_nacional: 15000,
        precio_reexpedido: 20000,
        precio_reexpedido_especial: 30000,
      },
    ]);

    const result = await recalculateOrder(
      [{ productId: "p1", quantity: 2 }], // 400g * 2 = 800g → 1kg
      { city: "Bogotá", department: "Cundinamarca" }
    );

    expect(result.subtotal).toBe(100000);
    expect(result.shippingCost).toBe(15000); // precio_nacional
    expect(result.total).toBe(115000);
  });

  it("recalcula total correctamente para múltiples items", async () => {
    const productA = product({ id: "a", precio: 30000 });
    const productB = product({ id: "b", precio: 20000 });
    mockGetProductById.mockImplementation((id) =>
      Promise.resolve(id === "a" ? productA : productB)
    );
    mockGetShippingBarrios.mockResolvedValue([
      { id: 1, nombre: "Centro", precio: 5000, activo: true },
    ]);

    const result = await recalculateOrder(
      [
        { productId: "a", quantity: 2 }, // 60k
        { productId: "b", quantity: 3 }, // 60k
      ],
      { city: "Manizales", department: "Caldas", barrio: "Centro" }
    );

    expect(result.subtotal).toBe(120000);
    expect(result.shippingCost).toBe(5000);
    expect(result.total).toBe(125000);
  });

  it("FREE_SHIPPING_THRESHOLD es 200,000 COP", () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(200_000);
  });
});
