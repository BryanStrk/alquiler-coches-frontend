import { useState } from 'react';
import { UploadImage } from '@/features/coches/components/UploadImage';
import { Badge } from '@/components/ui/Badge';

interface SubidaResult {
  url: string;
  publicId: string;
}

/**
 * Página temporal para validar end-to-end la integración con Cloudinary.
 *
 * Es deliberadamente fea y simple: su único objetivo es comprobar que la
 * cadena backend ↔ JWT ↔ Cloudinary funciona. Cuando todo esté verde,
 * BÓRRALA y mete <UploadImage> dentro de CocheCreatePage / CocheEditPage.
 * Dejar páginas de prueba en producción es deuda técnica que nadie recuerda.
 *
 * Acceso: http://localhost:5173/test-upload (ruta protegida: requiere
 * sesión con rol ADMIN).
 */
export function TestUploadPage() {
  // Acumulamos los resultados de la sesión para poder copiar los publicId
  // y verlos en pantalla sin tener que abrir la consola.
  const [resultados, setResultados] = useState<SubidaResult[]>([]);

  const handleUploaded = (url: string, publicId: string) => {
    // El console.log es intencional aquí: es una página de diagnóstico.
    console.log('Subido:', publicId, url);
    setResultados((prev) => [...prev, { url, publicId }]);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-12 lg:px-10">
      <header>
        <div className="mb-2 flex items-center gap-3">
          <h1 className="font-display text-3xl text-text">
            Test de Cloudinary
          </h1>
          <Badge color="warning">DEV</Badge>
        </div>
        <p className="text-sm text-muted">
          Sube imágenes y vídeos para verificar que el backend, el JWT y
          Cloudinary están bien conectados. Requiere login como ADMIN.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="font-semibold text-text">Imagen</h2>
        <UploadImage onUploaded={handleUploaded} accept="image/*" />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-text">Vídeo</h2>
        <UploadImage onUploaded={handleUploaded} accept="video/*" />
      </section>

      {resultados.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold text-text">
            Subidas en esta sesión:
          </h2>
          <ul className="space-y-2">
            {resultados.map((r) => (
              <li
                key={r.publicId}
                className="break-all rounded border border-border p-2 text-xs text-muted"
              >
                <div>
                  <strong className="text-text">publicId:</strong>{' '}
                  {r.publicId}
                </div>
                <div>
                  <strong className="text-text">url:</strong>{' '}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent underline"
                  >
                    {r.url}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
