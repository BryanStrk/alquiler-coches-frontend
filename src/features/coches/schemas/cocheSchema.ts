import { z } from 'zod';
import { EstadoCoche, TipoCombustible } from '@/types/coche.types';

const currentYear = new Date().getFullYear();

// Spanish plate, post-2000 format: 4 digits + 3 consonants (no vowels, no Ñ/Q),
// optional space. Case-insensitive.
const matriculaRegex = /^\d{4}\s?[BCDFGHJKLMNPRSTVWXYZ]{3}$/i;

export const cocheSchema = z.object({
  marca: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  modelo: z
    .string()
    .min(1, 'Obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  matricula: z
    .string()
    .regex(matriculaRegex, 'Formato no válido (ej: 1234 BCD)'),
  anio: z
    .number({ message: 'Introduce un año' })
    .int('Debe ser un año entero')
    .min(1990, 'Mínimo 1990')
    .max(currentYear + 1, `Máximo ${currentYear + 1}`),
  precioPorDia: z
    .number({ message: 'Introduce un precio' })
    .positive('Debe ser mayor que 0'),
  tipoCombustible: z.enum(
    [
      TipoCombustible.GASOLINA,
      TipoCombustible.DIESEL,
      TipoCombustible.HIBRIDO,
      TipoCombustible.ELECTRICO,
    ],
    { message: 'Selecciona un combustible' },
  ),
  estado: z.enum(
    [
      EstadoCoche.DISPONIBLE,
      EstadoCoche.ALQUILADO,
      EstadoCoche.MANTENIMIENTO,
    ],
    { message: 'Selecciona un estado' },
  ),
  kilometros: z
    .number({ message: 'Introduce los kilómetros' })
    .nonnegative('No puede ser negativo'),
  descripcion: z
    .string()
    .min(10, 'Mínimo 10 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),
  imageUrls: z
    .array(z.string().url('URL no válida'))
    .min(1, 'Añade al menos una imagen'),
});

export type CocheFormValues = z.infer<typeof cocheSchema>;
