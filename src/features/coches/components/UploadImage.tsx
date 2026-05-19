import { useState, type ChangeEvent } from 'react';
import { uploadImage } from '@/lib/api';
import { optimizeImage } from '@/lib/cloudinary';

interface Props {
  /** Callback que se invoca cuando la subida termina con éxito. */
  onUploaded?: (url: string, publicId: string) => void;
  /** Tipo de archivo aceptado. Por defecto solo imágenes. */
  accept?: string;
}

/**
 * Componente reutilizable para subir un archivo a Cloudinary vía backend.
 * Maneja tres estados visibles: archivo seleccionado, subida en curso, error.
 *
 * Idea clave: mostramos un preview LOCAL antes de subir. Esperar al servidor
 * para enseñar la imagen haría que la UI se sintiera lenta; con el preview
 * local la respuesta es instantánea y, cuando llega la URL real de
 * Cloudinary (ya optimizada), la sustituimos sin que el usuario lo note.
 */
export function UploadImage({
  onUploaded,
  accept = 'image/*',
}: Props) {
  // Cuatro piezas de estado, una por cada cosa que el usuario puede ver
  // cambiar. Tenerlas separadas hace el render trivial de razonar: cada
  // trozo de JSX depende de UNA variable, no de combinaciones implícitas.
  const [file, setFile] = useState<File | null>(null); // qué subir
  const [preview, setPreview] = useState<string | null>(null); // qué mostrar
  const [uploading, setUploading] = useState(false); // está cargando
  const [error, setError] = useState<string | null>(null); // falló algo

  /**
   * El usuario selecciona un archivo. Generamos un preview LOCAL inmediato
   * con URL.createObjectURL: crea una URL especial (blob:...) que apunta al
   * fichero que está en el disco del usuario, sin subir nada todavía.
   *
   * Detalle importante: cada createObjectURL reserva memoria que el
   * navegador NO libera solo. Si el usuario cambia de archivo varias veces
   * iríamos dejando blobs huérfanos. Por eso revocamos el preview anterior
   * antes de crear el nuevo: limpiar lo que ensucias.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  };

  /**
   * El usuario pulsa "Subir". Llamamos al backend y, si va bien,
   * sustituimos el preview local (blob:) por la URL que sirve Cloudinary
   * ya optimizada (f_auto, q_auto, resize) mediante optimizeImage.
   * Luego avisamos al componente padre con el callback `onUploaded`.
   */
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadImage(file);
      // El blob local ya no hace falta: lo liberamos antes de pisarlo.
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
      setPreview(
        optimizeImage(result.url, { width: 800, height: 600 }),
      );
      onUploaded?.(result.url, result.publicId);
    } catch (e) {
      // uploadImage lanza Error con un mensaje legible (lo preparamos en
      // api.ts). Si por lo que sea no fuera un Error, caemos a un texto
      // genérico para no mostrar "[object Object]" al usuario.
      setError(
        e instanceof Error ? e.message : 'Error subiendo el archivo',
      );
    } finally {
      // `finally` garantiza que el spinner se apaga tanto si la subida
      // fue bien como si falló: nunca dejamos el botón en "Subiendo…".
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="block w-full text-sm text-muted file:mr-4 file:cursor-pointer
                   file:rounded-md file:border-0 file:bg-accent file:px-4
                   file:py-2 file:font-medium file:text-bg
                   hover:file:bg-accent-hover"
      />

      {preview && (
        <img
          src={preview}
          alt="Vista previa del archivo seleccionado"
          className="max-h-64 rounded-md border border-border"
        />
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="press rounded-md bg-accent px-4 py-2 font-medium text-bg
                   transition-colors duration-150 hover:bg-accent-hover
                   disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Subiendo…' : 'Subir a Cloudinary'}
      </button>

      {error && (
        <p className="border-l-2 border-danger pl-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
