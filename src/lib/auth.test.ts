import { describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * C4 — auth.ts no debe tener fallbacks inseguros.
 * La app debe fallar si ADMIN_SECRET o ADMIN_PASSWORD no cumplen el mínimo.
 *
 * NOTA: auth.ts usa `next/headers` (solo disponible en runtime Next), así que
 * probamos la función `authenticate` que NO depende de cookies, y verificamos
 * los getters indirectamente. Para `isAuthenticated` se necesita un test de
 * integración HTTP que se cubre en los tests de rutas.
 */
describe("C4: auth.ts env var enforcement", () => {
  const originalSecret = process.env.ADMIN_SECRET;
  const originalPassword = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    // Limpiar cualquier import cacheado entre tests
    // (auth.ts lee env vars en cada llamada, así que esto es simbólico)
  });

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.ADMIN_SECRET;
    else process.env.ADMIN_SECRET = originalSecret;
    if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = originalPassword;
  });

  it("lanza error si ADMIN_SECRET no está configurado", async () => {
    delete process.env.ADMIN_SECRET;
    process.env.ADMIN_PASSWORD = "password-suficientemente-larga";
    const { authenticate } = await import("./auth");
    // Pasamos la password CORRECTA para forzar la creación del token,
    // que es el momento en que getSecret() se ejecuta y debe lanzar.
    expect(() => authenticate("password-suficientemente-larga")).toThrow(/ADMIN_SECRET/);
  });

  it("lanza error si ADMIN_SECRET es menor a 32 caracteres", async () => {
    process.env.ADMIN_SECRET = "too-short";
    process.env.ADMIN_PASSWORD = "password-suficientemente-larga";
    const { authenticate } = await import("./auth");
    expect(() => authenticate("password-suficientemente-larga")).toThrow(/ADMIN_SECRET/);
  });

  it("lanza error si ADMIN_PASSWORD no está configurado", async () => {
    process.env.ADMIN_SECRET = "a".repeat(40);
    delete process.env.ADMIN_PASSWORD;
    const { authenticate } = await import("./auth");
    expect(() => authenticate("cualquier-password")).toThrow(/ADMIN_PASSWORD/);
  });

  it("lanza error si ADMIN_PASSWORD es menor a 12 caracteres", async () => {
    process.env.ADMIN_SECRET = "a".repeat(40);
    process.env.ADMIN_PASSWORD = "corto";
    const { authenticate } = await import("./auth");
    expect(() => authenticate("cualquier-password")).toThrow(/ADMIN_PASSWORD/);
  });

  it("con credenciales válidas, autentica y retorna un token", async () => {
    process.env.ADMIN_SECRET = "a".repeat(40);
    process.env.ADMIN_PASSWORD = "password-larga-12+";
    const { authenticate } = await import("./auth");
    const token = authenticate("password-larga-12+");
    expect(token).not.toBeNull();
    expect(token).toMatch(/^\d+\.[a-f0-9]+$/);
  });

  it("con password incorrecta, retorna null (no throw)", async () => {
    process.env.ADMIN_SECRET = "a".repeat(40);
    process.env.ADMIN_PASSWORD = "password-correcta-123";
    const { authenticate } = await import("./auth");
    const token = authenticate("password-incorrecta-xy");
    expect(token).toBeNull();
  });

  it("no hay fallback a 'admin123' (confirma C4)", async () => {
    process.env.ADMIN_SECRET = "a".repeat(40);
    process.env.ADMIN_PASSWORD = "password-correcta-123";
    const { authenticate } = await import("./auth");
    // Si existiera el fallback a 'admin123', esta password debería funcionar.
    // Como el fallback fue eliminado, esto debe retornar null.
    expect(authenticate("admin123")).toBeNull();
  });
});
