import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, Plus, X } from 'lucide-react';
import {
  cocheSchema,
  type CocheFormValues,
} from '@/features/coches/schemas/cocheSchema';
import { EstadoCoche, TipoCombustible } from '@/types/coche.types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { optimizeImage } from '@/lib/cloudinary';
import { uploadImage } from '@/lib/api';

interface CocheFormProps {
  defaultValues: CocheFormValues;
  onSubmit: (values: CocheFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const combustibleOptions = Object.values(TipoCombustible).map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));

const estadoOptions = Object.values(EstadoCoche).map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));

/** Grupo de campos: div + título uppercase (fieldset semántico sin bordes
 *  nativos feos). Da la sensación de "ficha técnica" de revista. */
function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-md border border-border bg-surface p-6">
      <legend className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {children}
      </div>
    </fieldset>
  );
}

export function CocheForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: CocheFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CocheFormValues>({
    resolver: zodResolver(cocheSchema),
    defaultValues,
  });

  // useWatch (subscription-based) instead of watch() — plays nicely with the
  // React Compiler and only re-renders this component on the watched fields.
  const descripcion = useWatch({ control, name: 'descripcion' }) ?? '';
  const imageUrls = useWatch({ control, name: 'imageUrls' }) ?? [];

  // Subida OK → añadimos la URL al final del array (preservamos el orden).
  const addImage = (url: string) =>
    setValue('imageUrls', [...imageUrls.filter(Boolean), url], {
      shouldValidate: true,
    });

  // IMPORTANTE: quitar una miniatura SOLO la elimina del array del
  // formulario; NO llama a deleteImage() de Cloudinary. Son cosas
  // distintas: el admin puede querer desvincular la imagen de este coche
  // pero reutilizarla, o haberla quitado por error. El borrado físico
  // (DELETE /api/media/{publicId}) es un flujo aparte y deliberado.
  const removeImage = (index: number) =>
    setValue(
      'imageUrls',
      imageUrls.filter((_, i) => i !== index),
      { shouldValidate: true },
    );

  // ── Slot de subida integrado en el grid ──────────────────────────────
  // preview = objectURL local que se ve ANTES de que el backend responda.
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Token de cancelación: como api.uploadImage no acepta AbortSignal (y no
  // tocamos api.ts), "Cancelar" invalida la subida en curso incrementando
  // este contador; cuando la promesa resuelva, si el token cambió, se
  // descarta el resultado. La request sigue en segundo plano pero se ignora.
  const cancelToken = useRef(0);

  // Limpiamos el objectURL al desmontar para no fugar memoria.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reseteamos el input para poder re-seleccionar el mismo fichero.
    e.target.value = '';
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploadError(null);
    void startUpload(file, objectUrl);
  };

  const startUpload = async (file: File, objectUrl: string) => {
    const token = ++cancelToken.current;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (cancelToken.current !== token) return; // cancelado
      addImage(res.url);
    } catch (err) {
      if (cancelToken.current !== token) return;
      setUploadError(
        err instanceof Error ? err.message : 'Error al subir',
      );
    } finally {
      if (cancelToken.current === token) {
        setUploading(false);
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
      }
    }
  };

  const cancelUpload = () => {
    cancelToken.current++; // invalida la subida en curso
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setUploading(false);
    setUploadError(null);
  };

  const imageError =
    (typeof errors.imageUrls?.message === 'string' &&
      errors.imageUrls.message) ||
    errors.imageUrls?.root?.message;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      noValidate
    >
      <FieldGroup title="Datos del vehículo">
        <Input
          label="Marca"
          placeholder="Aston Martin"
          error={errors.marca?.message}
          {...register('marca')}
        />
        <Input
          label="Modelo"
          placeholder="DB11"
          error={errors.modelo?.message}
          {...register('modelo')}
        />
        <Input
          label="Matrícula"
          placeholder="1234 BCD"
          hint="Formato español 2000+: 4 dígitos + 3 consonantes"
          error={errors.matricula?.message}
          {...register('matricula')}
        />
        <Input
          label="Año"
          type="number"
          error={errors.anio?.message}
          {...register('anio', { valueAsNumber: true })}
        />
      </FieldGroup>

      <FieldGroup title="Especificaciones y precio">
        <Input
          label="Precio por día (€)"
          type="number"
          step="0.01"
          error={errors.precioPorDia?.message}
          {...register('precioPorDia', { valueAsNumber: true })}
        />
        <Input
          label="Kilómetros"
          type="number"
          error={errors.kilometros?.message}
          {...register('kilometros', { valueAsNumber: true })}
        />
        <Select
          label="Tipo de combustible"
          options={combustibleOptions}
          error={errors.tipoCombustible?.message}
          {...register('tipoCombustible')}
        />
        <Select
          label="Estado"
          options={estadoOptions}
          error={errors.estado?.message}
          {...register('estado')}
        />
      </FieldGroup>

      <fieldset className="rounded-md border border-border bg-surface p-6">
        <legend className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Descripción
        </legend>
        <Textarea
          rows={4}
          placeholder="Detalla equipamiento, motor, extras…"
          count={descripcion.length}
          limit={1000}
          error={errors.descripcion?.message}
          {...register('descripcion')}
        />
      </fieldset>

      {/* Galería de imágenes — grid compacto. Los thumbs y el slot de
          subida comparten el mismo grid y tamaño (aspect-square). El admin
          sube ficheros (POST /api/media/upload); la URL devuelta se añade
          a imageUrls, que se envía tal cual al backend al guardar. */}
      <fieldset className="rounded-md border border-border bg-surface p-6">
        <legend className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Imágenes
        </legend>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {imageUrls.filter(Boolean).map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-sm border border-border bg-surface-2"
            >
              <img
                src={optimizeImage(url, { width: 400, height: 400 })}
                alt={`Imagen ${i + 1} del coche`}
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Quitar imagen ${i + 1}`}
                className="press absolute top-2 right-2 grid size-8 place-items-center rounded-sm bg-bg/80 text-text opacity-0 backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 hover:text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          {/* Slot uploader — última celda, mismo tamaño que los thumbs. */}
          <div className="relative aspect-square overflow-hidden rounded-sm">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Vista previa de la imagen a subir"
                  className="size-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/75 backdrop-blur-sm">
                    <Spinner className="text-accent" />
                    <span className="text-xs font-medium uppercase tracking-wider text-text">
                      Subiendo…
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="press absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-sm bg-bg/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-text backdrop-blur-md hover:text-danger"
                >
                  <X className="size-3" />
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="press flex size-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border-strong bg-surface text-text-dim transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                <Plus className="size-6" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  Añadir imagen
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>
        </div>

        {uploadError && (
          <p className="mt-3 text-xs text-danger">{uploadError}</p>
        )}
        {imageError && (
          <p className="mt-3 text-xs text-danger">{imageError}</p>
        )}
      </fieldset>

      <div className="flex gap-3">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="min-w-48"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
