import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
});

export default pool;

// ─── Types ───
export interface DbProduct {
  id: string;
  nombre: string;
  precio: number;
  descuento: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  created_at: string;
  images: string[]; // URLs from product_images (ordered by position)
}

export interface DbCategory {
  id: number;
  nombre: string;
}

// ─── Queries ───

export async function getProducts(): Promise<DbProduct[]> {
  const { rows } = await pool.query<DbProduct & { imgs: string | null }>(`
    SELECT
      p.*,
      (
        SELECT string_agg(pi.url, '|||' ORDER BY pi.position)
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS imgs
    FROM products p
    ORDER BY p.created_at DESC
  `);

  return rows.map((r) => ({
    ...r,
    precio: Number(r.precio),
    images: r.imgs ? r.imgs.split("|||") : r.imagen ? [r.imagen] : [],
  }));
}

export async function getProductById(id: string): Promise<DbProduct | null> {
  const { rows } = await pool.query<DbProduct & { imgs: string | null }>(
    `
    SELECT
      p.*,
      (
        SELECT string_agg(pi.url, '|||' ORDER BY pi.position)
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS imgs
    FROM products p
    WHERE p.id = $1
    LIMIT 1
  `,
    [id]
  );

  if (rows.length === 0) return null;

  const r = rows[0];
  return {
    ...r,
    precio: Number(r.precio),
    images: r.imgs ? r.imgs.split("|||") : r.imagen ? [r.imagen] : [],
  };
}

export async function getProductsByCategory(category: string): Promise<DbProduct[]> {
  const { rows } = await pool.query<DbProduct & { imgs: string | null }>(
    `
    SELECT
      p.*,
      (
        SELECT string_agg(pi.url, '|||' ORDER BY pi.position)
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS imgs
    FROM products p
    WHERE p.categoria = $1
    ORDER BY p.created_at DESC
  `,
    [category]
  );

  return rows.map((r) => ({
    ...r,
    precio: Number(r.precio),
    images: r.imgs ? r.imgs.split("|||") : r.imagen ? [r.imagen] : [],
  }));
}

export async function getCategories(): Promise<DbCategory[]> {
  const { rows } = await pool.query<DbCategory>(
    `SELECT * FROM categorias ORDER BY id`
  );
  return rows;
}

export async function getFeaturedProducts(limit = 4): Promise<DbProduct[]> {
  const { rows } = await pool.query<DbProduct & { imgs: string | null }>(
    `
    SELECT
      p.*,
      (
        SELECT string_agg(pi.url, '|||' ORDER BY pi.position)
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS imgs
    FROM products p
    WHERE EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id)
    ORDER BY RANDOM()
    LIMIT $1
  `,
    [limit]
  );

  return rows.map((r) => ({
    ...r,
    precio: Number(r.precio),
    images: r.imgs ? r.imgs.split("|||") : r.imagen ? [r.imagen] : [],
  }));
}
