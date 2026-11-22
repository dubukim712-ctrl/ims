import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StockBar } from '@/components/ui/StockBar';
import { StockStatusBadge } from '@/components/inventory/StockStatusBadge';
import { formatMoney, formatQuantity } from '@/lib/format';
import type { Ingredient } from '@/types/domain';

interface IngredientTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
}

export function IngredientTable({ ingredients, onEdit }: IngredientTableProps) {
  return (
    <Card className="hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-espresso-100 bg-cream-50">
            <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-espresso-300">
              <th className="px-5 py-3.5">Ingredient</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="w-52 px-4 py-3.5">Stock level</th>
              <th className="px-4 py-3.5">Reorder at</th>
              <th className="px-4 py-3.5">Unit cost</th>
              <th className="px-5 py-3.5 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso-100">
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id} className="transition hover:bg-cream-50/70">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-espresso-900">{ingredient.name}</p>
                  <p className="mt-0.5 text-[11px] text-espresso-300">
                    {ingredient.supplier || 'No supplier'}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-xs text-espresso-500">{ingredient.category}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-espresso-800">
                      {formatQuantity(ingredient.current_stock, ingredient.unit)}
                    </span>
                    <StockStatusBadge ingredient={ingredient} />
                  </div>
                  <div className="mt-2">
                    <StockBar ingredient={ingredient} />
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-espresso-500">
                  {formatQuantity(ingredient.reorder_level, ingredient.unit)}
                </td>
                <td className="px-4 py-3.5 text-xs text-espresso-500">
                  {formatMoney(ingredient.cost_per_unit)}
                  <span className="text-espresso-300">/{ingredient.unit}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${ingredient.name}`}
                    onClick={() => onEdit(ingredient)}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
