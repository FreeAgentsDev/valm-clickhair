# Panel Admin – Ideas de diseño y arquitectura MVC

> Referencias de diseño y estructura de código para el panel admin de Val M Beauty & Click Hair.

---

## 1. Ideas de diseño

### 1.1 Paleta de colores (opciones)

El storefront usa rojo (#D62839) y violeta (#9B8FD9). El admin debe sentirse distinto pero coherente.

| Opción | Descripción | Uso |
|--------|-------------|-----|
| **A. Neutro oscuro** | Fondo slate/zinc (#0f172a), sidebar oscuro, acentos sutiles | Estilo "dashboard profesional" (Vercel, Linear) |
| **B. Blanco limpio** | Fondo blanco/gris claro, bordes suaves, acentos de marca | Estilo "minimalista" (Notion, Stripe Dashboard) |
| **C. Híbrido** | Sidebar oscuro + contenido claro | Estilo "clásico admin" (Shopify, Vercel) |
| **D. Marca suave** | Fondo blanco con toques de #D62839 o #9B8FD9 en sidebar/acciones | Conexión visual con la tienda |

**Recomendación:** Opción C o D. Sidebar oscuro (#1e293b) + contenido blanco, con acentos de marca en botones primarios.

```css
/* Variables sugeridas */
--admin-sidebar-bg: #1e293b;
--admin-sidebar-text: #94a3b8;
--admin-sidebar-active: #f8fafc;
--admin-content-bg: #f8fafc;
--admin-card-bg: #ffffff;
--admin-accent: #D62839;  /* o #9B8FD9 para variar */
```

---

### 1.2 Layout – Sidebar

| Estilo | Descripción | Referencia |
|--------|-------------|------------|
| **Sidebar fijo** | Siempre visible, ~240px | Vercel, Linear |
| **Sidebar colapsable** | Iconos cuando está cerrado | Shopify, Notion |
| **Sidebar + breadcrumbs** | Navegación clara en header | Stripe |

**Estructura sugerida:**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Val M Admin                    [Usuario] [Salir] │
├──────────────┬──────────────────────────────────────────┤
│              │  Dashboard / Productos / Pedidos          │
│  📊 Dashboard│  ───────────────────────────────────────  │
│  📦 Productos│                                          │
│  📋 Pedidos  │  [Contenido de la página]                 │
│  🏷️ Marcas   │                                          │
│              │                                          │
│  ─────────── │                                          │
│  🏠 Ver tienda│                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

### 1.3 Componentes clave

#### Login
- Card centrada, fondo suave (gradiente o patrón sutil)
- Logo de Val M + Click Hair
- Campos: email, contraseña
- Botón primario con color de marca
- Link "¿Olvidaste tu contraseña?" (si el back lo soporta)

#### Dashboard
- 4 StatCards: Productos, Pedidos del mes, Ventas, Stock bajo
- Gráfico placeholder (barras o líneas) para tendencias
- Lista de "Últimos pedidos" (5 items)
- Accesos rápidos: Nuevo producto, Ver tienda

#### Tabla de productos
- Columnas: Imagen miniatura, Nombre, Marca, Precio, Stock, Acciones
- Filtro por marca (Valm / Click)
- Búsqueda por nombre
- Botón "Nuevo producto" destacado
- Acciones: Editar (ícono lápiz), Eliminar (ícono papelera) con confirmación

#### Formulario producto
- Layout de 2 columnas en desktop: imagen a la izquierda, campos a la derecha
- Secciones: Información básica, Precio y stock, Envío (peso, dimensiones)
- Select de marca con colores de cada tienda
- Preview de imagen al subir/cambiar URL

---

### 1.4 Referencias visuales

| Panel | Qué tomar |
|-------|-----------|
| **Vercel Dashboard** | Sidebar oscuro, cards limpias, tipografía clara |
| **Stripe Dashboard** | Tablas bien espaciadas, estados (badges), acciones contextuales |
| **Shopify Admin** | Filtros, búsqueda, empty states amigables |
| **Linear** | Minimalismo, iconografía consistente, feedback sutil |
| **Shadcn/ui** | Componentes base (Table, Card, Button, Input) – compatible con Tailwind |

---

### 1.5 Tipografía y espaciado

- **Fuente:** Plus Jakarta Sans (ya usada en el proyecto)
- **Títulos:** font-bold, text-xl / text-2xl
- **Cuerpo:** text-sm / text-base, text-gray-600
- **Espaciado:** p-6 en cards, gap-4/gap-6 entre elementos
- **Bordes:** rounded-xl (16px) para cards y botones

---

## 2. Arquitectura tipo MVC

Next.js no es MVC puro, pero podemos mapear responsabilidades:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN (View)                │
│  app/admin/*, components/admin/*                                 │
│  - Páginas y componentes UI                                      │
│  - Solo renderizan y delegan lógica                              │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CAPA DE LÓGICA (Controller)                  │
│  hooks/, actions/, route handlers                                │
│  - useAdminAuth, useProducts, useOrders                          │
│  - Server Actions o API routes que orquestan                     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE DATOS (Model)                      │
│  lib/, types/                                                    │
│  - admin-api.ts (cliente HTTP)                                   │
│  - types (Product, Order, etc.)                                  │
│  - Servicios que hablan con el backend                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de carpetas (MVC adaptado)

```
src/
├── types/                    # MODEL – Definiciones
│   ├── index.ts              # Tipos compartidos (Product, Brand, etc.)
│   └── admin.ts              # Tipos específicos del admin (AdminUser, ApiResponse)
│
├── lib/                      # MODEL – Acceso a datos
│   ├── products.ts           # Datos estáticos (fallback)
│   ├── brands.ts
│   └── admin-api.ts          # Cliente API para el backend
│
├── services/                 # MODEL – Lógica de negocio (opcional)
│   └── product-service.ts   # Validaciones, transformaciones antes de API
│
├── hooks/                    # CONTROLLER – Lógica reutilizable
│   ├── useAdminAuth.ts       # Estado de auth, login, logout
│   ├── useProducts.ts        # Fetch, create, update, delete productos
│   └── useOrders.ts          # Fetch pedidos
│
├── app/admin/                # VIEW – Páginas
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/page.tsx
│   └── productos/
│       ├── page.tsx
│       ├── nuevo/page.tsx
│       └── [id]/page.tsx
│
├── components/admin/         # VIEW – Componentes UI
│   ├── layout/
│   │   ├── AdminSidebar.tsx
│   │   └── AdminHeader.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   └── RecentOrders.tsx
│   ├── products/
│   │   ├── ProductTable.tsx
│   │   ├── ProductForm.tsx
│   │   └── ProductFilters.tsx
│   └── ui/                   # Componentes genéricos (inputs, modals)
│       ├── DataTable.tsx
│       └── ConfirmDialog.tsx
│
└── app/api/                  # CONTROLLER – Endpoints propios (si hace falta)
    └── admin/
        └── [...proxy]/       # Proxy al backend si es necesario
```

---

## 4. Flujo de datos (ejemplo: listar productos)

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ productos/   │     │ useProducts()   │     │ admin-api.ts     │
│ page.tsx     │────▶│ (hook)          │────▶│ getProducts()     │
│ (View)       │     │ (Controller)    │     │ (Model)          │
└──────────────┘     └─────────────────┘     └──────────────────┘
       │                       │                        │
       │                       │                        ▼
       │                       │              ┌──────────────────┐
       │                       │              │ Backend API      │
       │                       │              │ GET /products    │
       │                       │              └──────────────────┘
       │                       │                        │
       │                       │◀───────────────────────┘
       │                       │  { products: [...] }
       │◀───────────────────────┘
       │  Renderiza ProductTable
       ▼
┌──────────────┐
│ ProductTable │
│ (View)       │
└──────────────┘
```

---

## 5. Responsabilidades por capa

### Model (lib/, types/, services/)
- Definir tipos e interfaces
- Llamar al backend (fetch, axios)
- Transformar respuestas (normalizar datos)
- **No:** lógica de UI, estado de formularios

### Controller (hooks/, Server Actions)
- Orquestar llamadas al Model
- Gestionar estado (loading, error, data)
- Validar antes de enviar
- **No:** JSX, estilos

### View (app/, components/)
- Renderizar UI
- Capturar eventos y llamar a hooks/actions
- Mostrar loading y errores
- **No:** fetch directo, lógica de negocio compleja

---

## 6. Ejemplo de código (ProductForm)

```tsx
// VIEW – ProductForm.tsx
// Solo UI, delega a useProducts
function ProductForm({ product, onSuccess }: Props) {
  const { createProduct, updateProduct, isLoading, error } = useProducts();
  const [formData, setFormData] = useState(product ?? defaultValues);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (product) {
      updateProduct(product.id, formData).then(onSuccess);
    } else {
      createProduct(formData).then(onSuccess);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs controlados por formData */}
    </form>
  );
}
```

```ts
// CONTROLLER – useProducts.ts
// Orquesta llamadas al API
function useProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await adminApi.getProducts();
    setData(result);
    setLoading(false);
  };

  const createProduct = async (payload: CreateProductDTO) => {
    await adminApi.postProduct(payload);
    await fetchProducts();
  };

  return { products: data, fetchProducts, createProduct, ... };
}
```

```ts
// MODEL – admin-api.ts
// Solo HTTP, sin estado
export const adminApi = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Error fetching products");
    return res.json();
  },
  async postProduct(payload: CreateProductDTO) {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error creating product");
    return res.json();
  },
};
```

---

## 7. Resumen

| Aspecto | Decisión |
|---------|----------|
| **Diseño** | Sidebar oscuro + contenido claro, acentos de marca |
| **Layout** | Sidebar fijo 240px, header con usuario y logout |
| **Componentes** | Cards, tablas, formularios con Tailwind + posible Shadcn |
| **Arquitectura** | MVC adaptado: Model (lib, types), Controller (hooks), View (app, components) |
| **Flujo** | Página → Hook → API → Backend |

---

*Documento de referencia para diseño y arquitectura del panel admin.*
