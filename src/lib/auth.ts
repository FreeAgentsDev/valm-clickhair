import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SECRET no está configurado o es demasiado corto (mínimo 32 caracteres)"
    );
  }
  return secret;
}

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD no está configurado o es demasiado corto (mínimo 12 caracteres)"
    );
  }
  return password;
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
