import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logDailyDrinkUsage } from '@/services/usage.service';
import { invalidateInventory } from '@/lib/queryKeys';
import type { CupsSoldItem } from '@/types/domain';

export function useLogDailyUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: CupsSoldItem[]) => logDailyDrinkUsage(items),
    onSuccess: () => invalidateInventory(queryClient),
  });
}
