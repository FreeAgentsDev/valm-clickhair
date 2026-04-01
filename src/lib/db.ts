import { Pool } from "pg";
import crypto from "crypto";

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
  peso_gramos: number;
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

// ─── Write operations ───

export async function createProduct(data: {
  nombre: string;
  precio: number;
  descuento?: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  peso_gramos?: number;
  images?: string[];
}): Promise<DbProduct> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const id = crypto.randomUUID();
    const { rows } = await client.query<DbProduct>(
      `INSERT INTO products (id, nombre, precio, descuento, descripcion, categoria, imagen, peso_gramos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, data.nombre, data.precio, data.descuento ?? 0, data.descripcion, data.categoria, data.imagen, data.peso_gramos ?? 300]
    );

    if (data.images?.length) {
      for (let i = 0; i < data.images.length; i++) {
        await client.query(
          `INSERT INTO product_images (product_id, url, position) VALUES ($1, $2, $3)`,
          [id, data.images[i], i]
        );
      }
    }

    await client.query("COMMIT");
    return { ...rows[0], precio: Number(rows[0].precio), images: data.images ?? [] };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateProduct(
  id: string,
  data: {
    nombre: string;
    precio: number;
    descuento?: number;
    descripcion: string;
    categoria: string;
    imagen: string;
    peso_gramos?: number;
    images?: string[];
  }
): Promise<DbProduct> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<DbProduct>(
      `UPDATE products SET nombre=$2, precio=$3, descuento=$4, descripcion=$5, categoria=$6, imagen=$7, peso_gramos=COALESCE($8, peso_gramos)
       WHERE id=$1 RETURNING *`,
      [id, data.nombre, data.precio, data.descuento ?? 0, data.descripcion, data.categoria, data.imagen, data.peso_gramos ?? null]
    );

    if (rows.length === 0) throw new Error("Producto no encontrado");

    await client.query(`DELETE FROM product_images WHERE product_id = $1`, [id]);
    const images = data.images ?? [];
    for (let i = 0; i < images.length; i++) {
      await client.query(
        `INSERT INTO product_images (product_id, url, position) VALUES ($1, $2, $3)`,
        [id, images[i], i]
      );
    }

    await client.query("COMMIT");
    return { ...rows[0], precio: Number(rows[0].precio), images };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM product_images WHERE product_id = $1`, [id]);
    await client.query(`DELETE FROM products WHERE id = $1`, [id]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function bulkUpdateWeights(
  updates: { id: string; peso_gramos: number }[]
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let count = 0;
    for (const { id, peso_gramos } of updates) {
      const res = await client.query(
        `UPDATE products SET peso_gramos = $2 WHERE id = $1`,
        [id, peso_gramos]
      );
      count += res.rowCount ?? 0;
    }
    await client.query("COMMIT");
    return count;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ─── Shipping: Barrios ───

export interface DbBarrio {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
}

export async function getShippingBarrios(): Promise<DbBarrio[]> {
  const { rows } = await pool.query<DbBarrio>(
    `SELECT * FROM shipping_barrios ORDER BY nombre`
  );
  return rows.map((r) => ({ ...r, precio: Number(r.precio) }));
}

export async function upsertBarrio(nombre: string, precio: number): Promise<DbBarrio> {
  const { rows } = await pool.query<DbBarrio>(
    `INSERT INTO shipping_barrios (nombre, precio) VALUES ($1, $2)
     ON CONFLICT (nombre) DO UPDATE SET precio = $2
     RETURNING *`,
    [nombre, precio]
  );
  return { ...rows[0], precio: Number(rows[0].precio) };
}

export async function updateBarrio(id: number, data: { nombre?: string; precio?: number; activo?: boolean }): Promise<DbBarrio> {
  const { rows } = await pool.query<DbBarrio>(
    `UPDATE shipping_barrios SET
       nombre = COALESCE($2, nombre),
       precio = COALESCE($3, precio),
       activo = COALESCE($4, activo)
     WHERE id = $1 RETURNING *`,
    [id, data.nombre ?? null, data.precio ?? null, data.activo ?? null]
  );
  if (rows.length === 0) throw new Error("Barrio no encontrado");
  return { ...rows[0], precio: Number(rows[0].precio) };
}

export async function deleteBarrio(id: number): Promise<void> {
  await pool.query(`DELETE FROM shipping_barrios WHERE id = $1`, [id]);
}

// ─── Shipping: Nacional ───

export interface DbShippingNacional {
  id: number;
  kilos: number;
  precio_local: number;
  precio_regional: number;
  precio_nacional: number;
  precio_reexpedido: number;
  precio_reexpedido_especial: number;
}

export async function getShippingNacional(): Promise<DbShippingNacional[]> {
  const { rows } = await pool.query<DbShippingNacional>(
    `SELECT * FROM shipping_nacional ORDER BY kilos`
  );
  return rows.map((r) => ({
    ...r,
    precio_local: Number(r.precio_local),
    precio_regional: Number(r.precio_regional),
    precio_nacional: Number(r.precio_nacional),
    precio_reexpedido: Number(r.precio_reexpedido),
    precio_reexpedido_especial: Number(r.precio_reexpedido_especial),
  }));
}

export async function updateShippingNacional(
  id: number,
  data: Partial<Omit<DbShippingNacional, "id">>
): Promise<DbShippingNacional> {
  const { rows } = await pool.query<DbShippingNacional>(
    `UPDATE shipping_nacional SET
       kilos = COALESCE($2, kilos),
       precio_local = COALESCE($3, precio_local),
       precio_regional = COALESCE($4, precio_regional),
       precio_nacional = COALESCE($5, precio_nacional),
       precio_reexpedido = COALESCE($6, precio_reexpedido),
       precio_reexpedido_especial = COALESCE($7, precio_reexpedido_especial)
     WHERE id = $1 RETURNING *`,
    [
      id,
      data.kilos ?? null,
      data.precio_local ?? null,
      data.precio_regional ?? null,
      data.precio_nacional ?? null,
      data.precio_reexpedido ?? null,
      data.precio_reexpedido_especial ?? null,
    ]
  );
  if (rows.length === 0) throw new Error("Fila no encontrada");
  return {
    ...rows[0],
    precio_local: Number(rows[0].precio_local),
    precio_regional: Number(rows[0].precio_regional),
    precio_nacional: Number(rows[0].precio_nacional),
    precio_reexpedido: Number(rows[0].precio_reexpedido),
    precio_reexpedido_especial: Number(rows[0].precio_reexpedido_especial),
  };
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
