/**
 * Clasificación de zonas de envío desde Manizales.
 *
 * - "local"       → Manizales (se usa tabla shipping_barrios)
 * - "regional"    → Caldas y eje cafetero cercano
 * - "nacional"    → Ciudades principales y capitales
 * - "reexpedido"  → Zonas rurales o municipios pequeños
 * - "reexpedido_especial" → Zonas de difícil acceso
 */

export type ShippingZone =
  | "local"
  | "regional"
  | "nacional"
  | "reexpedido"
  | "reexpedido_especial";

// ── Ciudades por zona ──
// Normalizado: minúsculas sin tildes para comparación

const REGIONAL_CITIES = new Set([
  // Caldas
  "neira", "chinchina", "villamaria", "palestina", "anserma",
  "risaralda", "belalcazar", "viterbo", "filadelfia", "la merced",
  "supía", "supia", "riosucio", "aranzazu", "salamina", "pacora",
  "aguadas", "pensilvania", "manzanares", "marquetalia", "marulanda",
  "samana", "la dorada", "victoria", "norcasia",
  // Risaralda cercano
  "pereira", "dosquebradas", "santa rosa de cabal", "marsella",
  "la virginia", "belen de umbria",
  // Quindío
  "armenia", "calarca", "circasia", "montenegro", "la tebaida",
  "quimbaya", "filandia", "salento",
  // Norte del Valle cercano
  "cartago", "zarzal", "la union",
]);

const NACIONAL_CITIES = new Set([
  // Capitales y ciudades principales
  "bogota", "bogotá", "medellin", "medellín", "cali",
  "barranquilla", "cartagena", "bucaramanga", "cucuta", "cúcuta",
  "ibague", "ibagué", "neiva", "villavicencio", "pasto",
  "monteria", "montería", "santa marta", "sincelejo",
  "valledupar", "popayan", "popayán", "tunja", "florencia",
  "yopal", "riohacha", "quibdo", "quibdó", "mocoa",
  "arauca", "san jose del guaviare", "puerto carreño",
  "inirida", "inírida", "mitu", "mitú", "leticia",
  // Ciudades grandes intermedias
  "buenaventura", "tulua", "tuluá", "buga", "palmira",
  "envigado", "itagui", "itagüí", "bello", "rionegro",
  "sogamoso", "duitama", "girardot", "fusagasuga", "fusagasugá",
  "zipaquira", "zipaquirá", "facatativa", "facatativá",
  "soacha", "chia", "chía", "barrancabermeja",
  "apartado", "apartadó", "turbo", "magangue", "magangué",
  "aguachica", "ocaña",
]);

const REEXPEDIDO_ESPECIAL_DEPARTMENTS = new Set([
  "amazonas", "guainia", "guainía", "vaupes", "vaupés",
  "vichada", "guaviare", "san andres", "san andrés",
]);

/**
 * Normaliza texto quitando tildes y pasando a minúsculas
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Determina la zona de envío basándose en ciudad y departamento
 */
export function getShippingZone(city: string, department: string): ShippingZone {
  const normalizedCity = normalize(city);
  const normalizedDept = normalize(department);

  // Manizales → local (se maneja aparte con barrios)
  if (normalizedCity === "manizales") return "local";

  // Zonas de difícil acceso
  if (REEXPEDIDO_ESPECIAL_DEPARTMENTS.has(normalizedDept)) return "reexpedido_especial";

  // Eje cafetero y Caldas cercano
  if (REGIONAL_CITIES.has(normalizedCity)) return "regional";

  // Si es del departamento de Caldas pero no está en la lista, aún es regional
  if (normalizedDept === "caldas") return "regional";

  // Risaralda y Quindío general = regional
  if (normalizedDept === "risaralda" || normalizedDept === "quindio") return "regional";

  // Ciudades principales = nacional
  if (NACIONAL_CITIES.has(normalizedCity)) return "nacional";

  // Departamentos principales con cobertura estándar = nacional
  const deptNacional = new Set([
    "antioquia", "valle", "valle del cauca", "cundinamarca",
    "bogota", "santander", "norte de santander",
    "atlantico", "bolivar", "tolima", "huila",
    "boyaca", "meta", "nariño", "narino",
    "magdalena", "cesar", "cordoba", "sucre",
    "la guajira", "casanare", "cauca",
  ]);
  if (deptNacional.has(normalizedDept)) return "nacional";

  // Departamentos lejanos no especiales
  const deptReexpedido = new Set([
    "choco", "putumayo", "caqueta", "arauca",
  ]);
  if (deptReexpedido.has(normalizedDept)) return "reexpedido";

  // Default: nacional
  return "nacional";
}

/**
 * Nombre legible de la zona
 */
export function getZoneLabel(zone: ShippingZone): string {
  const labels: Record<ShippingZone, string> = {
    local: "Manizales (local)",
    regional: "Regional (Eje Cafetero)",
    nacional: "Nacional",
    reexpedido: "Reexpedido",
    reexpedido_especial: "Reexpedido especial",
  };
  return labels[zone];
}
