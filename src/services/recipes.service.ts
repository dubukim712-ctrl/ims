import { supabase } from '@/lib/supabase';
import type { Drink, DrinkInput, DrinkWithRecipe, RecipeInput } from '@/types/domain';

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

export async function saveRecipe(input: RecipeInput): Promise<void> {
  const { error } = await supabase.rpc('upsert_recipe', {
    p_drink_id: input.drink_id ?? null,
    p_name: input.name.trim(),
    p_category: input.category.trim(),
    p_price: input.price,
    p_items: input.items.map((item) => ({
      ingredient_id: item.ingredient_id,
      quantity: item.quantity,
    })),
  });

  if (error) throw new Error(error.message);
}

export async function saveDrink(input: DrinkInput, drinkId?: string): Promise<Drink> {
  const { data, error } = await supabase.rpc('upsert_drink', {
    p_drink_id: drinkId ?? null,
    p_name: input.name.trim(),
    p_category: input.category.trim(),
    p_price: input.price,
  });

  if (error) throw new Error(error.message);
  return data as Drink;
}
