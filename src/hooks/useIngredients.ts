import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createIngredient,
  listIngredients,
  updateIngredient,
} from '@/services/ingredients.service';
import { invalidateInventory, queryKeys } from '@/lib/queryKeys';
import type { IngredientInput } from '@/types/domain';
import { useBranches } from '@/context/BranchContext';

export function useIngredients() {
  const { selectedBranch } = useBranches();
  return useQuery({
    queryKey: [...queryKeys.ingredients, selectedBranch?.id ?? 'none'] as const,
    queryFn: () => listIngredients(selectedBranch!.id),
    enabled: Boolean(selectedBranch),
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();
  const { selectedBranch } = useBranches();

  return useMutation({
    mutationFn: (input: IngredientInput) => createIngredient(input, selectedBranch!.id),
    onSuccess: () => invalidateInventory(queryClient),
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  const { selectedBranch } = useBranches();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: IngredientInput }) =>
      updateIngredient(id, input, selectedBranch!.id),
    onSuccess: () => invalidateInventory(queryClient),
  });
}
