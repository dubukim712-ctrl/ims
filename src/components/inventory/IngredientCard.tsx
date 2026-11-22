import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StockBar } from '@/components/ui/StockBar';
import { StockStatusBadge } from '@/components/inventory/StockStatusBadge';
import { formatMoney, formatQuantity } from '@/lib/format';
import type { Ingredient } from '@/types/domain';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onTransfer?: (ingredient: Ingredient) => void;
}

export function IngredientCard({ ingredient, onEdit, onTransfer }: IngredientCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-espresso-900">{ingredient.name}</p>
          <p className="mt-0.5 text-[11px] text-espresso-300">
            {ingredient.category} · {formatMoney(ingredient.cost_per_unit)}/{ingredient.unit}
          </p>
        </div>
        <StockStatusBadge ingredient={ingredient} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl leading-none text-espresso-900">
            {formatQuantity(ingredient.current_stock, ingredient.unit)}
          </p>
          <p className="mt-1 text-[11px] text-espresso-300">
            Reorder at {formatQuantity(ingredient.reorder_level, ingredient.unit)}
          </p>
        </div>
        <div className="flex gap-1.5">
          {onTransfer ? (
            <Button variant="outline" size="sm" onClick={() => onTransfer(ingredient)}>
              Transfer
            </Button>
          ) : null}
          <Button variant="outline" size="sm" onClick={() => onEdit(ingredient)}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <StockBar ingredient={ingredient} />
      </div>

      <p className="mt-3 truncate border-t border-espresso-100 pt-2.5 text-[11px] text-espresso-500">
        Supplier: <span className="font-medium">{ingredient.supplier || 'Not set'}</span>
      </p>
    </Card>
  );
}
