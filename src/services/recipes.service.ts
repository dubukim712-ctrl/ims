import { supabase } from '@/lib/supabase';
import type { Drink, DrinkInput, DrinkWithRecipe, RecipeInput } from '@/types/domain';

/**
 * Drinks come back with their recipe and each ingredient's live stock, so the
 * Recipes page and the daily usage form can share one cached request.
 */
export async function listDrinksWithRecipes(branchId: string): Promise<DrinkWithRecipe[]> {
  const { data, error } = await supabase
    .from('drinks')
    .select(
      `
      id, name, category, price, is_active, created_at,
      recipe_items (
        id, drink_id, ingredient_id, quantity,
        ingredient:ingredients ( id, name, unit, cost_per_unit )
      )
    `,
    )
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  const ingredientIds = [...new Set(
    (data ?? []).flatMap((drink: any) =>
      (drink.recipe_items ?? []).map((item: any) => item.ingredient_id).filter(Boolean),
    ),
  )];
  let stockByIngredient = new Map<string, { current_stock: number; reorder_level: number }>();
  if (ingredientIds.length) {
    const { data: inventories, error: inventoryError } = await supabase
      .from('branch_inventory')
      .select('ingredient_id, current_stock, reorder_level')
      .eq('branch_id', branchId)
      .in('ingredient_id', ingredientIds);
    if (inventoryError) throw new Error(inventoryError.message);
    stockByIngredient = new Map(
      (inventories ?? []).map((row: any) => [
        row.ingredient_id,
        { current_stock: Number(row.current_stock ?? 0), reorder_level: Number(row.reorder_level ?? 0) },
      ]),
    );
  }

  return (data ?? []).map((drink: any) => ({
    ...drink,
    recipe_items: (drink.recipe_items ?? []).map((item: any) => ({
      ...item,
      ingredient: item.ingredient ? {
        ...item.ingredient,
        ...(stockByIngredient.get(item.ingredient_id) ?? {
          current_stock: 0,
          reorder_level: 0,
        }),
      } : null,
    })),
  })) as DrinkWithRecipe[];
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
