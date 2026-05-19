import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cochesApi } from '@/lib/api';
import type { CocheRequest } from '@/types/coche.types';
import { cocheKeys } from './cocheKeys';

export function useCreateCoche() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CocheRequest) => cochesApi.create(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cocheKeys.all });
    },
  });
}
