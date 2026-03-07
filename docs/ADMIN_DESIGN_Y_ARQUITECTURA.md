# Panel Admin – Diseño y arquitectura implementada

> Documentación de lo implementado en Semana 1 para Val M Beauty & Click Hair.

---

## 1. Cambios realizados (Semana 1)

### 1.1 Panel admin con autenticación

- **Login:** Pantalla con contraseña única (`admin123`).
- **Persistencia:** `localStorage` con clave `admin_authenticated`.
- **Rutas:** `/admin` (panel), `/admin/login` (acceso).
- **Protección:** Redirect a login si no hay sesión.

### 1.2 Tema claro

- Fondo blanco y gris claro (`bg-white`, `bg-gray-50`).
- Bordes y textos en tonos grises.
- Acentos de marca (#D62839) en botones y elementos activos.

### 1.3 CRUD de productos

- **Almacenamiento:** `localStorage` con clave `admin_products`.
- **Formulario:** Diseño tipo tarjeta de producto (imagen izquierda, detalles derecha).
- **Campos:** Marca, nombre, precio, descripción, categoría, stock, peso, imagen.
- **Acciones:** Crear, editar, eliminar productos.
- **Storefront:** Productos leídos desde `localStorage` vía `ProductsGridClient` y `ProductPageClient`.

### 1.4 Contenido general de marca

- **Secciones editables:** "Sobre [marca]" y "Marcas que manejamos".
- **Almacenamiento:** `localStorage` con clave `admin_brand_content`.
- **Marcas:** Valm Beauty y Click Hair, cada una con su contenido.
- **Storefront:** `BrandInfoSectionClient` muestra el contenido editado en las páginas de marca.

### 1.5 Popup de anuncio

- **Modal:** Aparece al cargar la página si está habilitado.
- **Configuración:** Título, contenido, imagen, botón CTA (texto + URL).
- **Almacenamiento:** `localStorage` con clave `admin_popup`.
- **Comportamiento:** Se oculta por sesión al cerrar (no vuelve hasta recargar).

---

## 2. Estructura de archivos creados/modificados

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx           # Panel principal
│   │   └── login/page.tsx     # Login
│   ├── [brand]/page.tsx       # Usa BrandInfoSectionClient
│   └── layout.tsx             # DataInitializer + PopupAnnouncement
├── components/
│   ├── admin/
│   │   ├── AdminPanel.tsx
│   │   ├── DataInitializer.tsx
│   │   ├── layout/AdminLayout.tsx
│   │   └── editors/
│   │       ├── ProductEditor.tsx
│   │       ├── BrandContentEditor.tsx
│   │       └── PopupEditor.tsx
│   ├── BrandInfoSectionClient.tsx
│   ├── PopupAnnouncement.tsx
│   └── ProductsGridClient.tsx
├── hooks/
│   ├── useAdmin.ts
│   ├── useBrandContent.ts
│   └── usePopup.ts
├── lib/
│   └── storage.ts             # Servicio localStorage
└── types/
    └── index.ts               # Product, BrandContent, PopupConfig
```

---

## 3. Tabs del panel admin

| Tab | Descripción |
|-----|-------------|
| **Productos** | CRUD de productos con formulario tipo tarjeta |
| **Contenido general** | Editar "Sobre" y "Marcas" por marca |
| **Anuncio popup** | Habilitar/deshabilitar y configurar el modal de bienvenida |

---

## 4. Flujo de datos (localStorage)

- **admin_products:** Lista de productos.
- **admin_brand_content:** Contenido por marca (descripción, marcas que manejamos).
- **admin_popup:** Configuración del popup (enabled, título, contenido, imagen, CTA).
- **storage-update:** Evento disparado al guardar para sincronizar vistas.

---

*Documento actualizado con los cambios implementados en Semana 1.*
