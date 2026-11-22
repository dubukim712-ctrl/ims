import { supabase } from '@/lib/supabase';
import type { Ingredient, IngredientInput } from '@/types/domain';

const INGREDIENT_COLUMNS =
  'id, name, category, unit, current_stock, reorder_level, cost_per_unit, supplier, is_active, created_at, updated_at';

export async function listIngredients(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select(INGREDIENT_COLUMNS)
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Ingredient[];
}

export async function createIngredient(input: IngredientInput): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .insert(toRow(input))
    .select(INGREDIENT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as Ingredient;
}

export async function updateIngredient(
  id: string,
  input: IngredientInput,
): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(INGREDIENT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as Ingredient;
}

function toRow(input: IngredientInput) {
  return {
    name: input.name.trim(),
    category: input.category.trim(),
    unit: input.unit,
    current_stock: input.current_stock,
    reorder_level: input.reorder_level,
    cost_per_unit: input.cost_per_unit,
    supplier: input.supplier?.trim() || null,
  };
}
