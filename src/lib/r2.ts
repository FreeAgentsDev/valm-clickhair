import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function getClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Sube un archivo a R2 y devuelve la URL pública.
 * @param file - File del FormData
 * @param folder - Carpeta dentro del bucket (ej: "products", "popup")
 */
export async function uploadToR2(file: File, folder = "products"): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Tipo de archivo no permitido: ${file.type}`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error("El archivo excede 5MB");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const s3 = getClient();
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

/**
 * Extrae el key de R2 desde una URL pública.
 */
function getR2Key(imageUrl: string): string | null {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl || !imageUrl || !imageUrl.startsWith(publicUrl)) return null;
  return imageUrl.slice(publicUrl.length + 1);
}

/**
 * Elimina una imagen de R2 dado su URL público.
 * No lanza error si falla (best-effort).
 */
export async function deleteFromR2(imageUrl: string): Promise<void> {
  const key = getR2Key(imageUrl);
  if (!key) return;

  try {
    const s3 = getClient();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );
  } catch (err) {
    console.error("Error eliminando imagen de R2:", err);
  }
}

/**
 * Elimina múltiples imágenes de R2.
 */
export async function deleteMultipleFromR2(urls: string[]): Promise<void> {
  await Promise.allSettled(urls.map((url) => deleteFromR2(url)));
}
