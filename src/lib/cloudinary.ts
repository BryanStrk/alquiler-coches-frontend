/**
 * Cloudinary — utilidades de optimización de URLs en el cliente.
 *
 * Este módulo NO sube archivos: solo transforma URLs ya existentes de
 * Cloudinary para servirlas optimizadas (auto-formato, auto-calidad,
 * resize). La subida real se hace contra el backend en src/lib/api.ts.
 */

/**
 * Devuelve una versión optimizada de una URL de Cloudinary aplicando
 * transformaciones de entrega (formato y calidad automáticos, resize opcional).
 *
 * ESTRATEGIA — String replacement en lugar de SDK
 * ────────────────────────────────────────────────
 * En lugar de extraer el public_id y reconstruir la URL desde cero con
 * @cloudinary/url-gen (que se rompe con URLs cuya estructura no es la
 * esperada — por ejemplo, assets subidos por "fetch by URL" con public_id
 * autogenerado tipo `abc123_xyz` SIN carpeta), insertamos las
 * transformaciones DESPUÉS de "/upload/" y preservamos el resto de la URL
 * intacto: versión, carpeta, public_id y extensión.
 *
 *   ANTES:    /upload/v1779147434/abc123_xyz.jpg
 *   DESPUÉS:  /upload/f_auto,q_auto,w_800,h_600,c_fill/v1779147434/abc123_xyz.jpg
 *
 * Ventajas frente al SDK:
 *  - Funciona con CUALQUIER URL de Cloudinary, tenga carpeta o no.
 *  - Preserva la versión (algunos assets requieren la versión para resolverse).
 *  - Es idempotente: si la URL ya tiene transformaciones, no las pisa.
 *  - 10 líneas de código vs ~30 con el SDK. Más fácil de explicar.
 *
 * @param url   URL completa de Cloudinary (o de cualquier otro host).
 * @param opts  Dimensiones opcionales para resize (modo "fill").
 * @returns URL transformada, o la URL original si no es de Cloudinary.
 */
export function optimizeImage(
  url: string,
  opts: { width?: number; height?: number } = {},
): string {
  // 1) Si NO es URL de Cloudinary → devolverla tal cual.
  //    Ejemplo: placeholders de placehold.co del seed data, imágenes externas, etc.
  if (!url.includes('res.cloudinary.com')) return url;

  // 2) Si la URL YA contiene transformaciones, no las pisamos (idempotencia).
  //    Detectamos transformaciones por su patrón típico: una letra minúscula
  //    + "_" + valor, justo después de "/upload/". Ejemplos: f_auto, q_auto,
  //    w_800, c_fill, etc.
  if (/\/upload\/[a-z]_[^/]+/i.test(url)) return url;

  // 3) Construir el segmento de transformaciones.
  //    - f_auto: Cloudinary elige el mejor formato (WebP, AVIF...) según el navegador.
  //    - q_auto: calidad ajustada automáticamente sin pérdida visible.
  //    - w_/h_/c_fill: redimensionado opcional manteniendo el encuadre.
  const transformations: string[] = ['f_auto', 'q_auto'];
  if (opts.width)  transformations.push(`w_${opts.width}`);
  if (opts.height) transformations.push(`h_${opts.height}`);
  if (opts.width || opts.height) transformations.push('c_fill');

  // 4) Insertar el segmento justo después de "/upload/" preservando el resto.
  //    Esto funciona tanto con assets en carpeta como en root, con versión o sin.
  return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
}
