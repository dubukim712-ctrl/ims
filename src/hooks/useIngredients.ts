import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createIngredient,
  listIngredients,
  updateIngredient,
} from '@/services/ingredients.service';
import { invalidateInventory, queryKeys } from '@/lib/queryKeys';
import type { IngredientInput } from '@/types/domain';

export function useIngredients() {
  return useQuery({
    queryKey: queryKeys.ingredients,
    queryFn: listIngredients,
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IngredientInput) => createIngredient(input),
    onSuccess: () => invalidateInventory(queryClient),
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: IngredientInput }) =>
      updateIngredient(id, input),
    onSuccess: () => invalidateInventory(queryClient),
  });
}
