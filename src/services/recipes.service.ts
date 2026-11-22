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
      id, name, category, price, image_url, is_active, created_at,
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

export async function saveRecipe(input: RecipeInput, imageFile?: File): Promise<void> {
  const imageUrl = imageFile ? await uploadDrinkImage(imageFile) : input.image_url ?? null;
  const { error } = await supabase.rpc('upsert_recipe', {
    p_drink_id: input.drink_id ?? null,
    p_name: input.name.trim(),
    p_category: input.category.trim(),
    p_price: input.price,
    p_items: input.items.map((item) => ({
      ingredient_id: item.ingredient_id,
      quantity: item.quantity,
    })),
    p_image_url: imageUrl,
  });

  if (error) throw new Error(error.message);
}

export async function saveDrink(
  input: DrinkInput,
  drinkId?: string,
  imageFile?: File,
): Promise<Drink> {
  const imageUrl = imageFile ? await uploadDrinkImage(imageFile) : input.image_url ?? null;
  const { data, error } = await supabase.rpc('upsert_drink', {
    p_drink_id: drinkId ?? null,
    p_name: input.name.trim(),
    p_category: input.category.trim(),
    p_price: input.price,
    p_image_url: imageUrl,
  });

  if (error) throw new Error(error.message);
  return data as Drink;
}

const drinkImageExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function uploadDrinkImage(file: File): Promise<string> {
  const extension = drinkImageExtensions[file.type];
  if (!extension) {
    throw new Error('Choose a JPEG, PNG, WebP or GIF image.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Drink images must be 5 MB or smaller.');
  }

  // shortcut: a failed drink RPC can leave an unused public file; cleanup needs safe storage delete authorization.
  const path = `drinks/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from('drink-images')
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);
  return supabase.storage.from('drink-images').getPublicUrl(data.path).data.publicUrl;
}
