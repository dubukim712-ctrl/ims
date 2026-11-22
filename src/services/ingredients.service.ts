import { supabase } from '@/lib/supabase';
import type { Ingredient, IngredientInput } from '@/types/domain';

const INGREDIENT_COLUMNS =
  'id, name, category, unit, cost_per_unit, supplier, is_active, created_at, updated_at';

export async function listIngredients(branchId: string): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select(`${INGREDIENT_COLUMNS}, branch_inventory!inner ( branch_id, current_stock, reorder_level )`)
    .eq('is_active', true)
    .eq('branch_inventory.branch_id', branchId)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row: any) => {
    const inventory = row.branch_inventory?.[0];
    return {
      ...row,
      branch_inventory: undefined,
      current_stock: Number(inventory?.current_stock ?? 0),
      reorder_level: Number(inventory?.reorder_level ?? 0),
    } as Ingredient;
  });
}

export async function createIngredient(input: IngredientInput, branchId: string): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .insert(toRow(input))
    .select(INGREDIENT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  const ingredient = data as Ingredient;
  const { error: inventoryError } = await supabase
    .from('branch_inventory')
    .upsert({
      branch_id: branchId,
      ingredient_id: ingredient.id,
      current_stock: input.current_stock,
      reorder_level: input.reorder_level,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'branch_id,ingredient_id' });
  if (inventoryError) throw new Error(inventoryError.message);
  return { ...ingredient, current_stock: input.current_stock, reorder_level: input.reorder_level };
}

export async function updateIngredient(
  id: string,
  input: IngredientInput,
  branchId: string,
): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(INGREDIENT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  const ingredient = data as Ingredient;
  const { error: inventoryError } = await supabase
    .from('branch_inventory')
    .upsert({
      branch_id: branchId,
      ingredient_id: id,
      current_stock: input.current_stock,
      reorder_level: input.reorder_level,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'branch_id,ingredient_id' });
  if (inventoryError) throw new Error(inventoryError.message);
  return { ...ingredient, current_stock: input.current_stock, reorder_level: input.reorder_level };
}

function toRow(input: IngredientInput) {
  return {
    name: input.name.trim(),
    category: input.category.trim(),
    unit: input.unit,
    cost_per_unit: input.cost_per_unit,
    supplier: input.supplier?.trim() || null,
  };
}
