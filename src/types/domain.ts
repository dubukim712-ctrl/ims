/** Units supported by the shop. Stock is always displayed in the stored unit. */
export type Unit = 'g' | 'kg' | 'ml' | 'pcs';

export type StockStatus = 'out' | 'low' | 'healthy';

export type StockLogType =
  | 'stock_in'
  | 'usage'
  | 'spoilage'
  | 'adjustment'
  | 'transfer_out'
  | 'transfer_in';

export interface Branch {
  id: string;
  name: string;
  location: string | null;
  is_active: boolean;
  created_at: string;
}

export interface BranchInventory {
  id: string;
  branch_id: string;
  ingredient_id: string;
  current_stock: number;
  reorder_level: number;
  updated_at: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: Unit;
  current_stock: number;
  reorder_level: number;
  cost_per_unit: number;
  supplier: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** The editable fields on an ingredient. */
export type IngredientInput = {
  name: string;
  category: string;
  unit: Unit;
  current_stock: number;
  reorder_level: number;
  cost_per_unit: number;
  supplier?: string | null;
};

export interface Drink {
  id: string;
  name: string;
  category: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  unit: Unit;
  current_stock: number;
  reorder_level: number;
  cost_per_unit: number;
}

export interface RecipeItem {
  id: string;
  drink_id: string;
  ingredient_id: string;
  quantity: number;
  ingredient: RecipeIngredient | null;
}

export interface DrinkWithRecipe extends Drink {
  recipe_items: RecipeItem[];
}

export interface StockLog {
  id: string;
  branch_id: string | null;
  ingredient_id: string;
  drink_id: string | null;
  change_amount: number;
  type: StockLogType;
  note: string | null;
  supplier: string | null;
  previous_stock: number;
  new_stock: number;
  cups_sold: number | null;
  created_at: string;
  ingredient: Pick<Ingredient, 'id' | 'name' | 'unit'> | null;
  drink: Pick<Drink, 'id' | 'name'> | null;
}

export interface StockLogPage {
  rows: StockLog[];
  count: number;
}

export interface CupsSoldItem {
  drink_id: string;
  cups_sold: number;
}

export interface DailyUsageResult {
  drinks_logged: number;
  ingredients_deducted: number;
}

export interface DrinkInput {
  name: string;
  category: string;
  price: number;
}

export interface RecipeInput {
  drink_id?: string;
  name: string;
  category: string;
  price: number;
  items: Array<{
    ingredient_id: string;
    quantity: number;
  }>;
}
