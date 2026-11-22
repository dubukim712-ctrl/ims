import type { Ingredient } from '@/types/domain';

export interface InventoryStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  healthy: number;
  inventoryValue: number;
}

export interface CategorySummary {
  category: string;
  total: number;
  low: number;
}

export function computeInventoryStats(ingredients: Ingredient[]): InventoryStats {
  return ingredients.reduce<InventoryStats>(
    (stats, ingredient) => {
      const low = ingredient.current_stock <= ingredient.reorder_level;
      const out = ingredient.current_stock <= 0;

      return {
        total: stats.total + 1,
        lowStock: stats.lowStock + (low ? 1 : 0),
        outOfStock: stats.outOfStock + (out ? 1 : 0),
        healthy: stats.healthy + (low ? 0 : 1),
        inventoryValue: stats.inventoryValue + ingredient.current_stock * ingredient.cost_per_unit,
      };
    },
    { total: 0, lowStock: 0, outOfStock: 0, healthy: 0, inventoryValue: 0 },
  );
}

export function groupByCategory(ingredients: Ingredient[]): CategorySummary[] {
  const groups = new Map<string, CategorySummary>();

  for (const ingredient of ingredients) {
    const current = groups.get(ingredient.category) ?? {
      category: ingredient.category,
      total: 0,
      low: 0,
    };
    current.total += 1;
    if (ingredient.current_stock <= ingredient.reorder_level) current.low += 1;
    groups.set(ingredient.category, current);
  }

  return [...groups.values()].sort((a, b) => b.total - a.total);
}

/** Ingredients that need attention, most urgent first. */
export function getLowStockIngredients(ingredients: Ingredient[]): Ingredient[] {
  return ingredients
    .filter((ingredient) => ingredient.current_stock <= ingredient.reorder_level)
    .sort((a, b) => {
      const aRatio = a.current_stock / Math.max(a.reorder_level, 1);
      const bRatio = b.current_stock / Math.max(b.reorder_level, 1);
      return aRatio - bRatio;
    });
}
