import {
  getProductById,
  getShippingBarrios,
  getShippingNacional,
  applyCategDiscounts,
  type DbProduct,
} from "@/lib/db";
import { getShippingZone } from "@/lib/shipping-zones";

export const FREE_SHIPPING_THRESHOLD = 200_000;
const DEFAULT_PRODUCT_WEIGHT_GRAMS = 300;

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface ShippingInput {
  city: string;
  department: string;
  barrio?: string;
}

export interface RecalculatedOrder {
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    weightGrams: number;
    product: DbProduct;
  }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingZone: string;
  totalWeightGrams: number;
}

/**
 * Calcula precio unitario aplicando descuento (product-level) en enteros COP.
 */
function unitPriceWithDiscount(p: DbProduct): number {
  const base = Number(p.precio);
  const disc = Number(p.descuento) || 0;
  if (disc <= 0) return Math.round(base);
  return Math.round(base * (1 - disc / 100));
}

/**
 * Resuelve el costo de envío desde la BD (nunca confiar en lo que manda el cliente).
 */
async function resolveShippingCost(
  shipping: ShippingInput,
  totalWeightGrams: number
): Promise<{ costo: number; zona: string }> {
  const zone = getShippingZone(shipping.city, shipping.department);

  if (zone === "local") {
    if (!shipping.barrio) {
      throw new Error("Se requiere 'barrio' para envíos locales en Manizales");
    }
    const barrios = await getShippingBarrios();
    const found = barrios.find(
      (b) => b.activo && b.nombre.toLowerCase() === shipping.barrio!.toLowerCase()
    );
    if (!found) {
      throw new Error(`Barrio no encontrado: ${shipping.barrio}`);
    }
    return { costo: Number(found.precio), zona: "local" };
  }

  const kilos = Math.max(1, Math.ceil(totalWeightGrams / 1000));
  const tabla = await getShippingNacional();
  const fila = tabla.find((f) => f.kilos >= kilos) ?? tabla[tabla.length - 1];
  if (!fila) {
    throw new Error("No se encontró tarifa nacional");
  }

  const priceByZone: Record<string, number> = {
    regional: Number(fila.precio_regional),
    nacional: Number(fila.precio_nacional),
    reexpedido: Number(fila.precio_reexpedido),
    reexpedido_especial: Number(fila.precio_reexpedido_especial),
  };
  const costo = priceByZone[zone] ?? Number(fila.precio_nacional);
  return { costo, zona: zone };
}

/**
 * Re-calcula la orden COMPLETA desde la BD, ignorando cualquier precio/total
 * que venga del cliente. Esta es la única función de verdad para montos.
 */
export async function recalculateOrder(
  items: OrderItemInput[],
  shipping: ShippingInput
): Promise<RecalculatedOrder> {
  if (!items || items.length === 0) {
    throw new Error("La orden no tiene items");
  }

  // 1. Traer productos desde BD (ignorar precios del cliente)
  const rawProducts: DbProduct[] = [];
  for (const it of items) {
    if (!it.productId) throw new Error("productId requerido en cada item");
    const q = Number(it.quantity);
    if (!Number.isFinite(q) || q <= 0 || q > 100) {
      throw new Error(`Cantidad inválida para producto ${it.productId}: ${it.quantity}`);
    }
    const p = await getProductById(it.productId);
    if (!p) {
      throw new Error(`Producto no encontrado: ${it.productId}`);
    }
    rawProducts.push(p);
  }

  // 2. Aplicar descuentos por categoría
  const productsWithDiscounts = await applyCategDiscounts(rawProducts);
  const productMap = new Map(productsWithDiscounts.map((p) => [p.id, p]));

  // 3. Recalcular subtotal y peso
  const lineItems = items.map((it) => {
    const product = productMap.get(it.productId)!;
    const quantity = Number(it.quantity);
    const unitPrice = unitPriceWithDiscount(product);
    const lineTotal = unitPrice * quantity;
    const weightGrams =
      Number(product.peso_gramos) > 0
        ? Number(product.peso_gramos)
        : DEFAULT_PRODUCT_WEIGHT_GRAMS;
    return { productId: it.productId, quantity, unitPrice, lineTotal, weightGrams, product };
  });

  const subtotal = lineItems.reduce((s, l) => s + l.lineTotal, 0);
  const totalWeightGrams = lineItems.reduce((s, l) => s + l.weightGrams * l.quantity, 0);

  // 4. Resolver envío (con free shipping threshold)
  let shippingCost: number;
  let shippingZone: string;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shippingCost = 0;
    shippingZone = getShippingZone(shipping.city, shipping.department);
  } else {
    const r = await resolveShippingCost(shipping, totalWeightGrams);
    shippingCost = r.costo;
    shippingZone = r.zona;
  }

  const total = subtotal + shippingCost;

  return {
    items: lineItems,
    subtotal,
    shippingCost,
    total,
    shippingZone,
    totalWeightGrams,
  };
}
