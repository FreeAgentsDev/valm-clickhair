import pool from "./db";
import type { Product, BrandContent, PopupConfig } from "@/types";

let tableEnsured = false;
async function ensureSiteContentTable() {
  if (tableEnsured) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  tableEnsured = true;
}

async function readKey<T>(key: string): Promise<T | null> {
  await ensureSiteContentTable();
  const { rows } = await pool.query<{ value: T }>(
    `SELECT value FROM site_content WHERE key = $1 LIMIT 1`,
    [key]
  );
  return rows.length ? rows[0].value : null;
}

async function writeKey<T>(key: string, value: T): Promise<void> {
  await ensureSiteContentTable();
  await pool.query(
    `INSERT INTO site_content (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );
}

// ─── Products ───
export function getAdminProducts(): Promise<Product[] | null> {
  return readKey<Product[]>("products");
}

export function saveAdminProducts(products: Product[]): Promise<void> {
  return writeKey("products", products);
}

// ─── Brand Content ───
export function getAdminBrandContent(): Promise<BrandContent[] | null> {
  return readKey<BrandContent[]>("brand-content");
}

export function saveAdminBrandContent(content: BrandContent[]): Promise<void> {
  return writeKey("brand-content", content);
}

// ─── Popup ───
export function getAdminPopup(): Promise<PopupConfig | null> {
  return readKey<PopupConfig>("popup");
}

export function saveAdminPopup(config: PopupConfig): Promise<void> {
  return writeKey("popup", config);
}

// ─── Hero Content ───
export interface HeroContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaWhatsappText: string;
  aboutTitle: string;
  aboutText: string;
  catalogTitle: string;
  catalogSubtitle: string;
  categoriesTitle: string;
}

export function getAdminHero(): Promise<HeroContent | null> {
  return readKey<HeroContent>("hero");
}

export function saveAdminHero(content: HeroContent): Promise<void> {
  return writeKey("hero", content);
}

// ─── Testimonials ───
export interface Testimonial {
  name: string;
  text: string;
  label: string;
  stars: number;
}

export function getAdminTestimonials(): Promise<Testimonial[] | null> {
  return readKey<Testimonial[]>("testimonials");
}

export function saveAdminTestimonials(testimonials: Testimonial[]): Promise<void> {
  return writeKey("testimonials", testimonials);
}

// ─── Marquee ───
export function getAdminMarquee(): Promise<string[] | null> {
  return readKey<string[]>("marquee");
}

export function saveAdminMarquee(messages: string[]): Promise<void> {
  return writeKey("marquee", messages);
}
