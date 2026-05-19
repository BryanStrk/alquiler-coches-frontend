// NOTE: this project compiles with `erasableSyntaxOnly`, so TS `enum` is not
// allowed. We use `as const` objects + derived union types instead — same
// ergonomics, plus we can iterate the values for <Select> options.

export const EstadoCoche = {
  DISPONIBLE: 'DISPONIBLE',
  ALQUILADO: 'ALQUILADO',
  MANTENIMIENTO: 'MANTENIMIENTO',
} as const;
export type EstadoCoche = (typeof EstadoCoche)[keyof typeof EstadoCoche];

export const TipoCombustible = {
  GASOLINA: 'GASOLINA',
  DIESEL: 'DIESEL',
  HIBRIDO: 'HIBRIDO',
  ELECTRICO: 'ELECTRICO',
} as const;
export type TipoCombustible =
  (typeof TipoCombustible)[keyof typeof TipoCombustible];

export interface Coche {
  id: number;
  marca: string;
  modelo: string;
  matricula: string;
  anio: number;
  precioPorDia: number;
  tipoCombustible: TipoCombustible;
  estado: EstadoCoche;
  kilometros: number;
  descripcion: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — server owns id/createdAt/updatedAt. */
export type CocheRequest = Omit<Coche, 'id' | 'createdAt' | 'updatedAt'>;

/** Server-side filters sent as query params to GET /api/coches. */
export interface CocheFilters {
  marca?: string;
  tipoCombustible?: TipoCombustible;
  estado?: EstadoCoche;
}
