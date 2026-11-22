import { useQuery } from '@tanstack/react-query';
import { listDrinksWithRecipes } from '@/services/recipes.service';
import { queryKeys } from '@/lib/queryKeys';

export function useDrinksWithRecipes() {
  return useQuery({
    queryKey: queryKeys.drinksWithRecipes,
    queryFn: listDrinksWithRecipes,
  });
}
