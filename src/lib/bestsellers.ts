import pool from "./db";
import type { DbProduct } from "./db";

const SEED_KEY = "bestsellers_seed";
const SEED_SIZE = 5;

async function ensureSiteContentTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function readSeed(): Promise<string[]> {
  await ensureSiteContentTable();
  const { rows } = await pool.query<{ value: string[] }>(
    `SELECT value FROM site_content WHERE key = $1 LIMIT 1`,
    [SEED_KEY]
  );
  const value = rows[0]?.value;
  return Array.isArray(value) ? value : [];
}

async function writeSeed(ids: string[]): Promise<void> {
  await ensureSiteContentTable();
  await pool.query(
    `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
    [SEED_KEY, JSON.stringify(ids)]
  );
}

// Regex UUID v4 estándar — descarta IDs inválidos antes del cast a uuid[]
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function fetchProductsByIds(ids: string[]): Promise<DbProduct[]> {
  const validIds = ids.filter((id) => UUID_RE.test(id));
  if (validIds.length === 0) return [];
  const { rows } = await pool.query<DbProduct & { imgs: string | null }>(
    `SELECT
       p.*,
       (
         SELECT string_agg(pi.url, '|||' ORDER BY pi.position)
         FROM product_images pi
         WHERE pi.product_id = p.id
       ) AS imgs
     FROM products p
     WHERE p.id = ANY($1::uuid[])`,
    [validIds]
  );
  return rows.map((r) => ({
    ...r,
    precio: Number(r.precio),
    images: r.imgs ? r.imgs.split("|||") : r.imagen ? [r.imagen] : [],
  }));
}

/**
 * Devuelve los productos más vendidos basado en órdenes completadas.
 * - Cuenta unidades en órdenes con status paid/processing/shipped/delivered.
 * - Si hay menos de N reales, completa con un seed aleatorio persistente.
 * - Excluye agotados de la vista (pero no los considera para el conteo real).
 */
export async function getBestsellers(limit = 12): Promise<DbProduct[]> {
  // Sobre-muestreamos por si algunos quedan agotados o eliminados
  const oversample = Math.max(limit * 3, 20);

  // 1. Top reales desde órdenes completadas
  const { rows: salesRows } = await pool.query<{ product_id: string }>(
    `SELECT oi.product_id
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.status IN ('paid','processing','shipped','delivered')
       AND oi.product_id IS NOT NULL AND oi.product_id <> ''
     GROUP BY oi.product_id
     ORDER BY SUM(oi.quantity) DESC
     LIMIT $1`,
    [oversample]
  );
  const realIds = salesRows.map((r) => r.product_id);

  // 2. Seed (lee existente o crea uno nuevo aleatorio)
  let seedIds = await readSeed();
  if (seedIds.length === 0) {
    const { rows } = await pool.query<{ id: string }>(
      `SELECT id FROM products WHERE NOT agotado ORDER BY RANDOM() LIMIT $1`,
      [SEED_SIZE]
    );
    seedIds = rows.map((r) => r.id);
    if (seedIds.length > 0) {
      await writeSeed(seedIds);
    }
  }

  // 3. Combina priorizando los reales, deduplica
  const candidateIds: string[] = [];
  const seen = new Set<string>();
  for (const id of [...realIds, ...seedIds]) {
    if (!seen.has(id)) {
      seen.add(id);
      candidateIds.push(id);
    }
  }

  // 4. Trae los productos y descarta agotados o eliminados, preserva orden
  const products = await fetchProductsByIds(candidateIds);
  const byId = new Map(products.map((p) => [p.id, p]));
  const ordered = candidateIds
    .map((id) => byId.get(id))
    .filter((p): p is DbProduct => p !== undefined && !p.agotado);

  return ordered.slice(0, limit);
}
