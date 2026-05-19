import { useQuery } from '@tanstack/react-query';
import { cochesApi } from '@/lib/api';
import { cocheKeys } from './cocheKeys';

/** Coches in DISPONIBLE state (dedicated backend endpoint). */
export function useCochesDisponibles() {
  return useQuery({
    queryKey: cocheKeys.disponibles(),
    queryFn: () => cochesApi.disponibles(),
  });
}
