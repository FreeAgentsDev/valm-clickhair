import type { Product, BrandContent, PopupConfig } from "@/types";

const KEYS = {
  PRODUCTS: "admin_products",
  BRAND_CONTENT: "admin_brand_content",
  POPUP: "admin_popup",
};

const getItems = <T>(key: string, initialData: T[] = []): T[] => {
  if (typeof window === "undefined") return initialData;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialData;
  } catch (error) {
    console.error(`Error leyendo ${key} de localStorage:`, error);
    return initialData;
  }
};

const saveItems = <T>(key: string, items: T[]): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(items));
      window.dispatchEvent(new Event("storage-update"));
    } catch (error) {
      console.error(`Error guardando ${key} en localStorage:`, error);
    }
  }
};

const getObject = <T>(key: string, initial: T): T => {
  if (typeof window === "undefined") return initial;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  } catch (error) {
    console.error(`Error leyendo ${key} de localStorage:`, error);
    return initial;
  }
};

const saveObject = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event("storage-update"));
    } catch (error) {
      console.error(`Error guardando ${key} en localStorage:`, error);
    }
  }
};

export const storageService = {
  getProducts: (initial: Product[]) => getItems<Product>(KEYS.PRODUCTS, initial),
  saveProducts: (items: Product[]) => saveItems(KEYS.PRODUCTS, items),
  getBrandContent: (initial: BrandContent[] = []) =>
    getItems<BrandContent>(KEYS.BRAND_CONTENT, initial),
  saveBrandContent: (items: BrandContent[]) => saveItems(KEYS.BRAND_CONTENT, items),
  getPopup: (initial: PopupConfig) => getObject<PopupConfig>(KEYS.POPUP, initial),
  savePopup: (config: PopupConfig) => saveObject(KEYS.POPUP, config),
};
