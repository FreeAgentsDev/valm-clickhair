import fs from "fs";
import path from "path";
import type { Order } from "@/types";

const ORDERS_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(ORDERS_DIR, "orders.json");

function ensureDir() {
  if (!fs.existsSync(ORDERS_DIR)) {
    fs.mkdirSync(ORDERS_DIR, { recursive: true });
  }
}

function readOrders(): Order[] {
  ensureDir();
  if (!fs.existsSync(ORDERS_FILE)) return [];
  try {
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  ensureDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function saveOrder(order: Order): Order {
  const orders = readOrders();
  const existing = orders.findIndex((o) => o.id === order.id);
  if (existing >= 0) {
    orders[existing] = { ...orders[existing], ...order };
  } else {
    orders.unshift(order);
  }
  writeOrders(orders);
  return order;
}

export function getOrders(): Order[] {
  return readOrders();
}

export function getOrderById(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id);
}

export function updateOrderStatus(
  id: string,
  status: Order["status"],
  paymentId?: string
): Order | null {
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;

  order.status = status;
  if (paymentId) {
    (order as Order & { paymentId?: string }).paymentId = paymentId;
  }
  writeOrders(orders);
  return order;
}
