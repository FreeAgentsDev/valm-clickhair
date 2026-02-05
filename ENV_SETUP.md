# Configuración de variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Base URL de la aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Wompi - Pasarela de pagos
# Regístrate en comercios.wompi.co
WOMPI_API_KEY=tu_api_key
WOMPI_USER_PRINCIPAL_ID=tu_principal_id
WOMPI_ACCEPTANCE_TOKEN=token_de_aceptacion

# ADDI - Compra ahora, paga después
# Regístrate en co.addi.com
ADDI_CLIENT_ID=tu_client_id
ADDI_CLIENT_SECRET=tu_client_secret

# Skydropx - Envíos
# Obtén credenciales en pro.skydropx.com > Conexiones > API
SKYDROPX_TOKEN=tu_token_skydropx
```

## Cómo obtener las credenciales

- **Wompi**: [comercios.wompi.co](https://comercios.wompi.co) → Desarrollo → Programadores → Pagos a Terceros
- **ADDI**: [co.addi.com](https://co.addi.com) → Contactar para integración de comercios
- **Skydropx**: [pro.skydropx.com](https://pro.skydropx.com) → Conexiones → API
