import { supabase } from '@/lib/supabase';
import type { DrinkWithRecipe } from '@/types/domain';

/**
 * Drinks come back with their recipe and each ingredient's live stock, so the
 * Recipes page and the daily usage form can share one cached request.
 */
export async function listDrinksWithRecipes(): Promise<DrinkWithRecipe[]> {
  const { data, error } = await supabase
    .from('drinks')
    .select(
      `
      id, name, category, price, is_active, created_at,
      recipe_items (
        id, drink_id, ingredient_id, quantity,
        ingredient:ingredients ( id, name, unit, current_stock, reorder_level, cost_per_unit )
      )
    `,
    )
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as DrinkWithRecipe[];
}
