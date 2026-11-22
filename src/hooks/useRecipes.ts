import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listDrinksWithRecipes, saveDrink, saveRecipe } from '@/services/recipes.service';
import { queryKeys } from '@/lib/queryKeys';
import type { DrinkInput, RecipeInput } from '@/types/domain';

export function useDrinksWithRecipes() {
  return useQuery({
    queryKey: queryKeys.drinksWithRecipes,
    queryFn: listDrinksWithRecipes,
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RecipeInput) => saveRecipe(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.drinksWithRecipes });
    },
  });
}

export function useSaveDrink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input, drinkId }: { input: DrinkInput; drinkId?: string }) =>
      saveDrink(input, drinkId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.drinksWithRecipes });
    },
  });
}
