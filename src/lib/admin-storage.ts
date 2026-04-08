import fs from "fs";
import path from "path";
import type { Product, BrandContent, PopupConfig } from "@/types";

const DATA_DIR = path.join(process.cwd(), ".data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filename: string, fallback: T): T {
  ensureDir();
  const file = path.join(DATA_DIR, filename);
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson<T>(filename: string, data: T) {
  ensureDir();
  fs.writeFileSync(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// ─── Products ───
export function getAdminProducts(): Product[] | null {
  return readJson<Product[] | null>("admin-products.json", null);
}

export function saveAdminProducts(products: Product[]) {
  writeJson("admin-products.json", products);
}

// ─── Brand Content ───
export function getAdminBrandContent(): BrandContent[] | null {
  return readJson<BrandContent[] | null>("admin-brand-content.json", null);
}

export function saveAdminBrandContent(content: BrandContent[]) {
  writeJson("admin-brand-content.json", content);
}

// ─── Popup ───
export function getAdminPopup(): PopupConfig | null {
  return readJson<PopupConfig | null>("admin-popup.json", null);
}

export function saveAdminPopup(config: PopupConfig) {
  writeJson("admin-popup.json", config);
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

export function getAdminHero(): HeroContent | null {
  return readJson<HeroContent | null>("admin-hero.json", null);
}

export function saveAdminHero(content: HeroContent) {
  writeJson("admin-hero.json", content);
}

// ─── Testimonials ───
export interface Testimonial {
  name: string;
  text: string;
  label: string;
  stars: number;
}

export function getAdminTestimonials(): Testimonial[] | null {
  return readJson<Testimonial[] | null>("admin-testimonials.json", null);
}

export function saveAdminTestimonials(testimonials: Testimonial[]) {
  writeJson("admin-testimonials.json", testimonials);
}

// ─── Marquee ───
export function getAdminMarquee(): string[] | null {
  return readJson<string[] | null>("admin-marquee.json", null);
}

export function saveAdminMarquee(messages: string[]) {
  writeJson("admin-marquee.json", messages);
}
