# Plan de implementación – Panel Admin

> Panel básico para Val M Beauty & Click Hair. Listo para conectar cuando se reciba el backend/DB.

---

## 1. Alcance inicial (MVP)

| Módulo | Descripción | Prioridad |
|--------|-------------|-----------|
| **Login** | Pantalla de acceso protegida | P1 |
| **Dashboard** | Resumen básico (métricas placeholder) | P1 |
| **Productos** | Listar, crear, editar, eliminar | P1 |
| **Layout admin** | Sidebar, header, navegación | P1 |
| **Pedidos** | Listar (cuando el back lo soporte) | P2 |
| **Marcas** | Editar info de tiendas | P3 |

---

## 2. Estructura de rutas

```
/admin
├── layout.tsx          # Layout con sidebar + protección
├── page.tsx            # Dashboard
├── login/
│   └── page.tsx        # Login (redirect si ya autenticado)
├── productos/
│   ├── page.tsx        # Lista de productos
│   ├── nuevo/
│   │   └── page.tsx    # Crear producto
│   └── [id]/
│       └── page.tsx    # Editar producto
└── pedidos/
    └── page.tsx        # Lista de pedidos (P2)
```

---

## 3. Stack técnico

| Capa | Tecnología | Notas |
|------|------------|-------|
| **UI** | Next.js App Router + Tailwind | Mismo stack del proyecto |
| **Auth** | Por definir con el back | Cookie/session o JWT según API |
| **API** | Fetch a endpoints del backend | Base URL en env |
| **Estado** | React state + SWR o TanStack Query | Para cache de datos |

---

## 4. Integración con el backend (cuando llegue)

### 4.1 Variables de entorno

```env
# Admin / Backend
NEXT_PUBLIC_ADMIN_API_URL=https://api.ejemplo.com
# o
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:4000
```

### 4.2 Endpoints esperados (a confirmar con el back)

| Método | Endpoint | Uso |
|--------|----------|-----|
| `POST` | `/auth/login` | Login admin |
| `POST` | `/auth/logout` | Logout |
| `GET` | `/auth/me` | Validar sesión |
| `GET` | `/products` | Listar productos |
| `GET` | `/products/:id` | Detalle producto |
| `POST` | `/products` | Crear producto |
| `PUT` | `/products/:id` | Actualizar producto |
| `DELETE` | `/products/:id` | Eliminar producto |
| `GET` | `/orders` | Listar pedidos (P2) |

### 4.3 Modelo de datos (referencia actual)

```ts
// Product (alineado con src/types/index.ts)
interface Product {
  id: string;
  brand: "valm-beauty" | "click-hair";
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  weight?: number;
  dimensions?: { width: number; height: number; length: number };
}
```

---

## 5. Fases de implementación

### Fase 1: Estructura base (sin backend)

1. Crear rutas `/admin/*` con layout y sidebar.
2. Página de login con formulario (sin validación real).
3. Protección de rutas con redirect a `/admin/login` si no hay sesión (mock).
4. Dashboard con cards de métricas placeholder.
5. Lista de productos leyendo de `PRODUCTS` (datos actuales) como fallback.

**Entregable:** Panel navegable con UI lista para conectar API.

---

### Fase 2: Conectar backend

1. Configurar `NEXT_PUBLIC_ADMIN_API_URL`.
2. Crear cliente API (`src/lib/admin-api.ts`) con fetch + manejo de errores.
3. Implementar flujo de login real (token/session según lo que entregue el back).
4. Sustituir datos mock por llamadas a la API.
5. CRUD de productos contra endpoints reales.

**Entregable:** Panel funcional con datos reales.

---

### Fase 3: Mejoras (opcional)

1. Lista de pedidos.
2. Edición de marcas.
3. Subida de imágenes (si el back lo soporta).
4. Filtros y búsqueda en productos.
5. Paginación.

---

## 6. Componentes a crear

```
src/
├── app/admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/page.tsx
│   └── productos/
│       ├── page.tsx
│       ├── nuevo/page.tsx
│       └── [id]/page.tsx
├── components/admin/
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   ├── ProductForm.tsx
│   ├── ProductTable.tsx
│   └── StatCard.tsx
├── lib/
│   └── admin-api.ts      # Cliente API (Fase 2)
└── hooks/
    └── useAdminAuth.ts   # Hook de auth (Fase 2)
```

---

## 7. Diseño UI (referencia)

- **Sidebar:** Links a Dashboard, Productos, Pedidos.
- **Header:** Usuario, logout.
- **Productos:** Tabla con acciones (editar, eliminar) + botón "Nuevo producto".
- **Formulario producto:** Campos según `Product` (nombre, descripción, precio, categoría, marca, stock, imagen, peso, dimensiones).
- **Estilo:** Mantener Tailwind y paleta del proyecto; tonos más neutros para diferenciar del storefront.

---

## 8. Checklist pre-implementación

- [ ] Recibir documentación de API del backend.
- [ ] Confirmar modelo de auth (JWT, session, etc.).
- [ ] Confirmar estructura de respuestas (éxito/error).
- [ ] Definir manejo de imágenes (URLs, upload, etc.).

---

## 9. Orden sugerido al codear

1. `AdminSidebar` + `AdminHeader` + `layout.tsx`.
2. `login/page.tsx` + protección mock.
3. `page.tsx` (Dashboard).
4. `productos/page.tsx` con datos de `PRODUCTS`.
5. `ProductForm` + `productos/nuevo` + `productos/[id]`.
6. Cliente API y sustitución de mocks cuando llegue el back.

---

*Documento creado para coordinar con el equipo de backend. Actualizar cuando se reciba la API.*
