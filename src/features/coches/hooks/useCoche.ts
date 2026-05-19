import { useQuery } from '@tanstack/react-query';
import { cochesApi } from '@/lib/api';
import { cocheKeys } from './cocheKeys';

/** Fetch a single coche by id. Disabled when id is not a valid number. */
export function useCoche(id: number) {
  return useQuery({
    queryKey: cocheKeys.detail(id),
    queryFn: () => cochesApi.byId(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
