import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logDailyDrinkUsage } from '@/services/usage.service';
import { invalidateInventory } from '@/lib/queryKeys';
import type { CupsSoldItem } from '@/types/domain';
import { useBranches } from '@/context/BranchContext';

export function useLogDailyUsage() {
  const queryClient = useQueryClient();
  const { selectedBranch } = useBranches();

  return useMutation({
    mutationFn: (items: CupsSoldItem[]) =>
      logDailyDrinkUsage(items, selectedBranch!.id),
    onSuccess: () => invalidateInventory(queryClient),
  });
}
