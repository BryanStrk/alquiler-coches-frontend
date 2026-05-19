import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cochesApi } from '@/lib/api';
import type { CocheRequest } from '@/types/coche.types';
import { cocheKeys } from './cocheKeys';

interface UpdateArgs {
  id: number;
  data: CocheRequest;
}

export function useUpdateCoche() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateArgs) =>
      cochesApi.update(id, data),
    onSuccess: (_data, { id }) => {
      // Refresh the detail view and any list that might include this coche.
      qc.invalidateQueries({ queryKey: cocheKeys.detail(id) });
      qc.invalidateQueries({ queryKey: cocheKeys.all });
    },
  });
}
