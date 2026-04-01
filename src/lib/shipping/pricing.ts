// ─── Tabla de envío nacional por peso (Skydropx tarifas) ───

export type ZonaTipo =
  | "local"
  | "regional"
  | "nacional"
  | "reexpedido"
  | "reexpedido_especial";

interface FilaPrecio {
  kilos: number;
  precios: Record<ZonaTipo, number>;
}

export const TABLA_ENVIO_NACIONAL: FilaPrecio[] = [
  { kilos: 1,  precios: { local: 7955,  regional: 9456,  nacional: 12029, reexpedido: 40600, reexpedido_especial: 55680 } },
  { kilos: 2,  precios: { local: 8149,  regional: 9640,  nacional: 12933, reexpedido: 44544, reexpedido_especial: 59624 } },
  { kilos: 3,  precios: { local: 8230,  regional: 9747,  nacional: 13062, reexpedido: 48488, reexpedido_especial: 63568 } },
  { kilos: 4,  precios: { local: 8622,  regional: 10555, nacional: 14463, reexpedido: 52432, reexpedido_especial: 67512 } },
  { kilos: 5,  precios: { local: 8708,  regional: 10660, nacional: 14607, reexpedido: 56376, reexpedido_especial: 71456 } },
  { kilos: 6,  precios: { local: 10666, regional: 15853, nacional: 18217, reexpedido: 60320, reexpedido_especial: 75400 } },
  { kilos: 7,  precios: { local: 10773, regional: 16011, nacional: 18399, reexpedido: 64264, reexpedido_especial: 79344 } },
  { kilos: 8,  precios: { local: 10881, regional: 16172, nacional: 18583, reexpedido: 68208, reexpedido_especial: 83288 } },
  { kilos: 9,  precios: { local: 12803, regional: 19122, nacional: 20791, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 10, precios: { local: 12803, regional: 19122, nacional: 20791, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 11, precios: { local: 12803, regional: 19122, nacional: 20791, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 12, precios: { local: 12803, regional: 19122, nacional: 20791, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 13, precios: { local: 13541, regional: 19673, nacional: 22426, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 14, precios: { local: 13541, regional: 19673, nacional: 22426, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 15, precios: { local: 13541, regional: 19673, nacional: 22426, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 16, precios: { local: 13541, regional: 19673, nacional: 22426, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 17, precios: { local: 13541, regional: 19673, nacional: 22426, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 18, precios: { local: 13541, regional: 19673, nacional: 22426, reexpedido: 97750, reexpedido_especial: 155250 } },
  { kilos: 19, precios: { local: 14479, regional: 21128, nacional: 23787, reexpedido: 96900, reexpedido_especial: 153900 } },
  { kilos: 20, precios: { local: 14479, regional: 21128, nacional: 23787, reexpedido: 96900, reexpedido_especial: 153900 } },
  { kilos: 21, precios: { local: 14479, regional: 21128, nacional: 23787, reexpedido: 96900, reexpedido_especial: 153900 } },
  { kilos: 22, precios: { local: 14479, regional: 21128, nacional: 23787, reexpedido: 96900, reexpedido_especial: 153900 } },
  { kilos: 23, precios: { local: 14479, regional: 21128, nacional: 23787, reexpedido: 96900, reexpedido_especial: 153900 } },
  { kilos: 24, precios: { local: 14479, regional: 21128, nacional: 23787, reexpedido: 96900, reexpedido_especial: 153900 } },
  { kilos: 25, precios: { local: 16142, regional: 22457, nacional: 26150, reexpedido: 96900, reexpedido_especial: 153900 } },
];

export function calcularEnvioNacional(pesoGramos: number, zona: ZonaTipo = "nacional"): number {
  const kilos = Math.max(1, Math.ceil(pesoGramos / 1000));
  const fila = TABLA_ENVIO_NACIONAL.find((f) => f.kilos >= kilos) ?? TABLA_ENVIO_NACIONAL[TABLA_ENVIO_NACIONAL.length - 1];
  return fila.precios[zona];
}

// ─── Barrios de Manizales (Super Entregas - Zona 1) ───

export interface Barrio {
  nombre: string;
  precio: number;
}

export const MANIZALES_BARRIOS: Barrio[] = [
  // A
  { nombre: "Alamos/Ondas de Otun", precio: 6000 },
  { nombre: "Alhambra", precio: 9000 },
  { nombre: "Alférez Real", precio: 8000 },
  { nombre: "Alta Suiza/Colseguros", precio: 5500 },
  { nombre: "Alto Tablazo", precio: 12000 },
  { nombre: "Altos de Capri", precio: 6000 },
  { nombre: "Aranjuez", precio: 7000 },
  { nombre: "Arboleda", precio: 5000 },
  { nombre: "Arenillo (Hotel el Búho)", precio: 12000 },
  { nombre: "Arrayanes/Palmar", precio: 6500 },
  { nombre: "Asturias/Quinta Hispania", precio: 9000 },
  { nombre: "Argentina", precio: 5000 },
  { nombre: "Asunción", precio: 5500 },
  { nombre: "Americas", precio: 7000 },
  { nombre: "Agustinos/San Antonio", precio: 7000 },
  { nombre: "Alcazares/Francia", precio: 8000 },
  { nombre: "Autónoma/Santa Helena", precio: 5500 },
  { nombre: "Amarello/Expoferias", precio: 6000 },
  { nombre: "Baja Suiza", precio: 5000 },
  // B
  { nombre: "Bajo Tablazo", precio: 15000 },
  { nombre: "Belén/Estrella", precio: 5000 },
  { nombre: "Bella Montaña/Morichal", precio: 10000 },
  { nombre: "Bengala", precio: 6500 },
  { nombre: "Bosque", precio: 8000 },
  { nombre: "Bosque Popular (Ingreso)", precio: 7000 },
  { nombre: "Bosques de Niza", precio: 5000 },
  { nombre: "Bosques del Norte", precio: 7000 },
  { nombre: "Barrio 20 de Julio", precio: 7000 },
  // C
  { nombre: "Carmen/Albania", precio: 7500 },
  { nombre: "Carola/A. de Granada", precio: 5500 },
  { nombre: "Caribe", precio: 6000 },
  { nombre: "Cambulos/Castilla", precio: 9000 },
  { nombre: "Camelia", precio: 5000 },
  { nombre: "Camilo Torres", precio: 7000 },
  { nombre: "Campín", precio: 5500 },
  { nombre: "Cedros/Saenz", precio: 5500 },
  { nombre: "Centenario/Castellana", precio: 8000 },
  { nombre: "Centro", precio: 6000 },
  { nombre: "Cervantes/Campoamor", precio: 6000 },
  { nombre: "Cerro de Oro Avión", precio: 5000 },
  { nombre: "Cerro de Oro (Hotel Gold)", precio: 5500 },
  { nombre: "Albergue/Marqueza", precio: 6000 },
  { nombre: "Vereda Buena Vista", precio: 10000 },
  { nombre: "Chipre/Campohermoso", precio: 7000 },
  { nombre: "Colinas", precio: 7000 },
  { nombre: "Colombia", precio: 5500 },
  { nombre: "Colon", precio: 7000 },
  { nombre: "Conjunto Torrear", precio: 5000 },
  { nombre: "Comuneros", precio: 6500 },
  { nombre: "Cumbre/Villa Luz", precio: 6000 },
  // E
  { nombre: "Estación Uribe", precio: 10000 },
  { nombre: "Estación Uribe (Chec/Moteles)", precio: 15000 },
  { nombre: "Estambul", precio: 10000 },
  { nombre: "Eucaliptos", precio: 7000 },
  { nombre: "Enea/Bosques Enea", precio: 7000 },
  // F
  { nombre: "Fanny Gonzales", precio: 6000 },
  { nombre: "Fatima/Betania", precio: 5500 },
  { nombre: "Fundadores/Delicias", precio: 6000 },
  { nombre: "Florida/El Retiro", precio: 10000 },
  { nombre: "Florida P. de la Salud", precio: 10000 },
  // G
  { nombre: "Galeria", precio: 7000 },
  { nombre: "Guamal/Santos", precio: 7000 },
  // I
  { nombre: "Isabella", precio: 7000 },
  // L
  { nombre: "Laureles/Rambla", precio: 5000 },
  { nombre: "Leonora/Rosales", precio: 5000 },
  { nombre: "Liborio", precio: 7000 },
  { nombre: "Linda", precio: 15000 },
  { nombre: "Lleras", precio: 5500 },
  { nombre: "Lusitania", precio: 8000 },
  // M
  { nombre: "Malhabar", precio: 7000 },
  { nombre: "Maltería (TCC - Sena)", precio: 9000 },
  { nombre: "Maltería (Recinto-CAI)", precio: 10000 },
  { nombre: "Maltería (Progel-Trululú)", precio: 12000 },
  { nombre: "Milan/Camelia", precio: 5000 },
  { nombre: "Minitas/Viveros", precio: 6000 },
  { nombre: "Morrogacho", precio: 11000 },
  { nombre: "Molinos", precio: 10000 },
  // N
  { nombre: "Nevado", precio: 7000 },
  { nombre: "Nogales", precio: 8500 },
  // P
  { nombre: "Palermo/Palogrande", precio: 5000 },
  { nombre: "Palonegro", precio: 6500 },
  { nombre: "Panorama", precio: 9000 },
  { nombre: "Parque del Agua", precio: 7000 },
  { nombre: "Paraiso/Fuente", precio: 8000 },
  { nombre: "Persia Alto/Persia Bajo", precio: 6000 },
  { nombre: "Peralonso", precio: 6000 },
  { nombre: "Pio XII", precio: 6000 },
  { nombre: "Prado Alto/Bajo", precio: 6500 },
  { nombre: "Porvenir", precio: 6000 },
  { nombre: "Puertas del Sol", precio: 9000 },
  // R
  { nombre: "Rambla/Residencias", precio: 5000 },
  { nombre: "Rosales", precio: 5000 },
  { nombre: "Reserva Campestre", precio: 10000 },
  { nombre: "Rincón de la Francia", precio: 9000 },
  // S
  { nombre: "Samaria/Solferino", precio: 7000 },
  { nombre: "San Cayetano", precio: 6000 },
  { nombre: "San Joaquín", precio: 6000 },
  { nombre: "San Jorge/Sol", precio: 5500 },
  { nombre: "San José", precio: 7000 },
  { nombre: "San Marcel/Montañita", precio: 6000 },
  { nombre: "San Sebastián", precio: 8000 },
  { nombre: "Sinaí", precio: 6000 },
  { nombre: "Sultana/Floresta de la Sult.", precio: 5000 },
  // T
  { nombre: "Toscana", precio: 5000 },
  { nombre: "Topacio", precio: 9000 },
  { nombre: "Torres de San Vicente", precio: 7000 },
  { nombre: "Trébol/Tejares", precio: 5500 },
  // U
  { nombre: "Uribe AV Paralela", precio: 5500 },
  // V
  { nombre: "Vélez", precio: 5500 },
  { nombre: "Versalles", precio: 5000 },
  { nombre: "Villa Carmenza", precio: 7000 },
  { nombre: "Viña del Río/Villahermosa", precio: 6000 },
  { nombre: "Villa Julia", precio: 8000 },
  { nombre: "Villa Pilar", precio: 7500 },
  { nombre: "Mirador U.Pilar - Sacatín", precio: 8500 },
  { nombre: "Mirador de Sancancio", precio: 5500 },
  { nombre: "Villamaría/Pradera-Turín", precio: 10000 },
  { nombre: "La Floresta - Descache", precio: 13000 },
  { nombre: "Villa del Río", precio: 6000 },
  { nombre: "Riduco/Induma", precio: 10000 },
  { nombre: "Gallinazo", precio: 13000 },
  { nombre: "Termales Otoño/Acuaparq", precio: 15000 },
];

// ─── Centros Comerciales ───

export const CENTROS_COMERCIALES: Barrio[] = [
  { nombre: "Edificio la Alcaldía", precio: 7000 },
  { nombre: "C.C Parque Caldas", precio: 6000 },
  { nombre: "C.C Fundadores", precio: 6000 },
  { nombre: "C.C Mall Plaza", precio: 6000 },
  { nombre: "C.C Cable Plaza/Luker", precio: 5000 },
  { nombre: "C.C Sancancio", precio: 5000 },
];

// Todos los destinos de Manizales combinados
export const TODOS_DESTINOS_MANIZALES: Barrio[] = [
  ...MANIZALES_BARRIOS,
  ...CENTROS_COMERCIALES,
  { nombre: "Despachos Terminal", precio: 10000 },
].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

export const DESPACHO_TERMINAL = 10000;
export const RECARGO_NOCTURNO = 500; // después de 10PM

export function buscarBarrio(query: string): Barrio[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return TODOS_DESTINOS_MANIZALES.filter((b) =>
    b.nombre.toLowerCase().includes(q)
  ).slice(0, 10);
}
