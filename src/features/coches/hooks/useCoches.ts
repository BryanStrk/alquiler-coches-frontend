import { useQuery } from '@tanstack/react-query';
import { cochesApi } from '@/lib/api';
import type { CocheFilters } from '@/types/coche.types';
import { cocheKeys } from './cocheKeys';

/** List coches with optional server-side filters (marca/combustible/estado). */
export function useCoches(filters?: CocheFilters) {
  return useQuery({
    queryKey: cocheKeys.list(filters),
    queryFn: () => cochesApi.list(filters),
  });
}
