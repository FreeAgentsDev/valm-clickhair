import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

function getSecret(): string {
  return process.env.ADMIN_SECRET || "valm-default-secret-change-me";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

/** Crea un token firmado con timestamp */
function createToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(timestamp);
  const signature = hmac.digest("hex");
  return `${timestamp}.${signature}`;
}

/** Verifica que un token sea válido y no haya expirado */
function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const age = (Date.now() - parseInt(timestamp, 10)) / 1000;
  if (isNaN(age) || age > SESSION_MAX_AGE || age < 0) return false;

  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(timestamp);
  const expected = hmac.digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex")
  );
}

/** Valida la contraseña y devuelve el token si es correcta */
export function authenticate(password: string): string | null {
  const correct = getAdminPassword();
  // Comparación de tiempo constante para evitar timing attacks
  const passwordBuffer = Buffer.from(password);
  const correctBuffer = Buffer.from(correct);

  if (
    passwordBuffer.length === correctBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, correctBuffer)
  ) {
    return createToken();
  }
  return null;
}

/** Verifica si la sesión actual es válida (server-side) */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return false;
  return verifyToken(session.value);
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
