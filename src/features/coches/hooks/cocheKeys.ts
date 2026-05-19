import type { CocheFilters } from '@/types/coche.types';

/** Centralized TanStack Query keys for the coches domain. */
export const cocheKeys = {
  all: ['coches'] as const,
  list: (filters?: CocheFilters) =>
    ['coches', 'list', filters ?? {}] as const,
  disponibles: () => ['coches', 'disponibles'] as const,
  detail: (id: number) => ['coches', 'detail', id] as const,
};
