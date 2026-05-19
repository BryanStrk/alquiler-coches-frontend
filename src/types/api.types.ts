/**
 * Generic error envelope returned by the Spring Boot backend.
 * Shape kept loose because @Valid errors and business errors differ slightly;
 * callers should read `message` and fall back gracefully.
 */
export interface ErrorResponse {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
  /** Field-level validation errors: { campo: "mensaje" }. */
  errors?: Record<string, string>;
}

/**
 * Respuesta del backend tras subir un archivo a Cloudinary.
 * Espeja com.alquiler.coches.dto.UploadResponse del backend.
 *
 * El `publicId` es la "matrícula" del recurso en Cloudinary: lo necesitas
 * para poder borrarlo después (deleteImage). La `url` es la dirección
 * pública ya servible; nunca exponemos las credenciales de Cloudinary al
 * navegador, por eso pasa todo por nuestro backend.
 */
export interface UploadResponse {
  publicId: string;
  url: string;
}

/**
 * Respuesta del backend tras borrar un archivo de Cloudinary.
 * Espeja com.alquiler.coches.dto.DeleteResponse del backend.
 *
 * `result` refleja literalmente lo que responde Cloudinary ("ok",
 * "not found"...). Lo dejamos como string libre a propósito: si el día
 * de mañana Cloudinary añade un estado nuevo, el tipo no se rompe.
 */
export interface DeleteResponse {
  publicId: string;
  result: string; // "ok", "not found", etc.
}
