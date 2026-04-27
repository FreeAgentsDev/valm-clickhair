import pool from "./db";
import type { Order, BrandSlug, CartItem } from "@/types";

interface OrderRow {
  id: string;
  status: Order["status"];
  payment_method: Order["paymentMethod"];
  payment_id: string | null;
  subtotal: string | number;
  shipping_cost: string | number;
  total: string | number;
  shipping_name: string | null;
  shipping_id_number: string | null;
  shipping_email: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_department: string | null;
  shipping_postal_code: string | null;
  consent_accepted_at: Date | string | null;
  consent_policy_version: string | null;
  consent_ip_address: string | null;
  created_at: Date | string;
}

interface OrderItemRow {
  order_id: string;
  position: number;
  product_id: string | null;
  product_name: string;
  product_description: string | null;
  product_price: string | number;
  product_image: string | null;
  product_images: string[] | null;
  product_category: string | null;
  product_brand: string | null;
  product_weight: number | null;
  quantity: number;
}

function toIso(value: Date | string | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function rowToOrder(row: OrderRow, items: OrderItemRow[]): Order {
  const cartItems: CartItem[] = items.map((it) => ({
    product: {
      id: it.product_id ?? "",
      name: it.product_name,
      description: it.product_description ?? "",
      price: Number(it.product_price),
      image: it.product_image ?? "",
      images: it.product_images ?? undefined,
      category: it.product_category ?? "",
      brand: (it.product_brand as BrandSlug) ?? "valm-beauty",
      stock: 0,
      weight: it.product_weight ?? undefined,
    },
    quantity: it.quantity,
  }));

  return {
    id: row.id,
    items: cartItems,
    shipping: {
      name: row.shipping_name ?? "",
      idNumber: row.shipping_id_number ?? undefined,
      email: row.shipping_email ?? "",
      phone: row.shipping_phone ?? "",
      address: row.shipping_address ?? "",
      city: row.shipping_city ?? "",
      department: row.shipping_department ?? "",
      postalCode: row.shipping_postal_code ?? undefined,
    },
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.shipping_cost),
    total: Number(row.total),
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: toIso(row.created_at),
    consent: row.consent_accepted_at
      ? {
          acceptedAt: toIso(row.consent_accepted_at),
          policyVersion: row.consent_policy_version ?? "",
          ipAddress: row.consent_ip_address ?? undefined,
        }
      : undefined,
    ...(row.payment_id ? { paymentId: row.payment_id } : {}),
  } as Order;
}

export async function saveOrder(order: Order): Promise<Order> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO orders (
         id, status, payment_method, subtotal, shipping_cost, total,
         shipping_name, shipping_id_number, shipping_email, shipping_phone,
         shipping_address, shipping_city, shipping_department, shipping_postal_code,
         consent_accepted_at, consent_policy_version, consent_ip_address, created_at
       ) VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10,
         $11, $12, $13, $14,
         $15, $16, $17, $18
       )
       ON CONFLICT (id) DO UPDATE SET
         status = EXCLUDED.status,
         payment_method = EXCLUDED.payment_method,
         subtotal = EXCLUDED.subtotal,
         shipping_cost = EXCLUDED.shipping_cost,
         total = EXCLUDED.total,
         shipping_name = EXCLUDED.shipping_name,
         shipping_id_number = EXCLUDED.shipping_id_number,
         shipping_email = EXCLUDED.shipping_email,
         shipping_phone = EXCLUDED.shipping_phone,
         shipping_address = EXCLUDED.shipping_address,
         shipping_city = EXCLUDED.shipping_city,
         shipping_department = EXCLUDED.shipping_department,
         shipping_postal_code = EXCLUDED.shipping_postal_code,
         consent_accepted_at = EXCLUDED.consent_accepted_at,
         consent_policy_version = EXCLUDED.consent_policy_version,
         consent_ip_address = EXCLUDED.consent_ip_address`,
      [
        order.id,
        order.status,
        order.paymentMethod,
        order.subtotal,
        order.shippingCost,
        order.total,
        order.shipping.name ?? null,
        order.shipping.idNumber ?? null,
        order.shipping.email ?? null,
        order.shipping.phone ?? null,
        order.shipping.address ?? null,
        order.shipping.city ?? null,
        order.shipping.department ?? null,
        order.shipping.postalCode ?? null,
        order.consent?.acceptedAt ?? null,
        order.consent?.policyVersion ?? null,
        order.consent?.ipAddress ?? null,
        order.createdAt ? new Date(order.createdAt) : new Date(),
      ]
    );

    // Reemplazar items (estrategia simple: borrar e insertar)
    await client.query(`DELETE FROM order_items WHERE order_id = $1`, [order.id]);

    for (let i = 0; i < order.items.length; i++) {
      const it = order.items[i];
      await client.query(
        `INSERT INTO order_items (
           order_id, position, product_id, product_name, product_description,
           product_price, product_image, product_images, product_category,
           product_brand, product_weight, quantity
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          order.id,
          i,
          it.product.id || null,
          it.product.name,
          it.product.description ?? null,
          it.product.price,
          it.product.image ?? null,
          it.product.images ?? null,
          it.product.category ?? null,
          it.product.brand ?? null,
          it.product.weight ?? null,
          it.quantity,
        ]
      );
    }

    await client.query("COMMIT");
    return order;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getOrders(): Promise<Order[]> {
  const { rows: orderRows } = await pool.query<OrderRow>(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  if (orderRows.length === 0) return [];

  const ids = orderRows.map((o) => o.id);
  const { rows: itemRows } = await pool.query<OrderItemRow>(
    `SELECT * FROM order_items WHERE order_id = ANY($1::text[]) ORDER BY position`,
    [ids]
  );

  const itemsByOrder = new Map<string, OrderItemRow[]>();
  for (const it of itemRows) {
    const list = itemsByOrder.get(it.order_id) ?? [];
    list.push(it);
    itemsByOrder.set(it.order_id, list);
  }

  return orderRows.map((row) => rowToOrder(row, itemsByOrder.get(row.id) ?? []));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const { rows } = await pool.query<OrderRow>(
    `SELECT * FROM orders WHERE id = $1 LIMIT 1`,
    [id]
  );
  if (rows.length === 0) return undefined;

  const { rows: itemRows } = await pool.query<OrderItemRow>(
    `SELECT * FROM order_items WHERE order_id = $1 ORDER BY position`,
    [id]
  );

  return rowToOrder(rows[0], itemRows);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  paymentId?: string
): Promise<Order | null> {
  const { rows } = await pool.query<OrderRow>(
    `UPDATE orders
     SET status = $2,
         payment_id = COALESCE($3, payment_id)
     WHERE id = $1
     RETURNING *`,
    [id, status, paymentId ?? null]
  );
  if (rows.length === 0) return null;

  const { rows: itemRows } = await pool.query<OrderItemRow>(
    `SELECT * FROM order_items WHERE order_id = $1 ORDER BY position`,
    [id]
  );
  return rowToOrder(rows[0], itemRows);
}

export async function deleteOrder(id: string): Promise<boolean> {
  const res = await pool.query(`DELETE FROM orders WHERE id = $1`, [id]);
  return (res.rowCount ?? 0) > 0;
}
