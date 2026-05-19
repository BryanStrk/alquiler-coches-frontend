import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cochesApi } from '@/lib/api';
import { cocheKeys } from './cocheKeys';

export function useDeleteCoche() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cochesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cocheKeys.all });
    },
  });
}
