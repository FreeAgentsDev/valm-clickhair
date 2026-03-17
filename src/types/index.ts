export type BrandSlug = "valm-beauty" | "click-hair";

export const WHATSAPP_NUMBERS = [
  { number: "3104077106", label: "310 407 7106" },
  { number: "3206770162", label: "320 677 0162" },
] as const;

export interface Brand {
  slug: BrandSlug;
  name: string;
  tagline: string;
  instagram: string;
  instagramUrl: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  /** Descripción larga de la tienda */
  description?: string;
  /** Marcas que maneja (ej. Valm: Walaky, Girly) */
  brandsCarried?: string[];
  /** Categorías de productos */
  categories?: string[];
  /** Especialidades o destacados */
  highlights?: string[];
  /** Dirección física */
  address?: string;
  /** Horario de atención */
  hours?: string;
  /** WhatsApp para consultas */
  whatsapp?: string;
}

export interface Product {
  id: string;
  brand: BrandSlug;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  weight?: number; // gramos para Skydropx
  dimensions?: { width: number; height: number; length: number }; // cm
}

/** Configuración del popup de anuncio (admin) */
export interface PopupConfig {
  enabled: boolean;
  title?: string;
  content?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
}

/** Contenido editable de marca (admin) */
export interface BrandContent {
  brand: BrandSlug;
  description?: string;
  brandsCarried?: string[];
  categories?: string[];
  highlights?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "wompi" | "addi" | "mercado-pago";
  status: "pending" | "paid" | "processing" | "shipped" | "delivered";
  createdAt: string;
}
