import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listDrinksWithRecipes, saveDrink, saveRecipe } from '@/services/recipes.service';
import { queryKeys } from '@/lib/queryKeys';
import type { DrinkInput, RecipeInput } from '@/types/domain';
import { useBranches } from '@/context/BranchContext';

export function useDrinksWithRecipes() {
  const { selectedBranch } = useBranches();
  return useQuery({
    queryKey: [...queryKeys.drinksWithRecipes, selectedBranch?.id ?? 'none'] as const,
    queryFn: () => listDrinksWithRecipes(selectedBranch!.id),
    enabled: Boolean(selectedBranch),
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      imageFile,
    }: {
      input: RecipeInput;
      imageFile?: File;
    }) => saveRecipe(input, imageFile),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.drinksWithRecipes });
    },
  });
}

export function useSaveDrink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      drinkId,
      imageFile,
    }: {
      input: DrinkInput;
      drinkId?: string;
      imageFile?: File;
    }) => saveDrink(input, drinkId, imageFile),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.drinksWithRecipes });
    },
  });
}
