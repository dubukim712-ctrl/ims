import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatMoney, formatQuantity } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { DrinkWithRecipe, RecipeIngredient } from '@/types/domain';

function ingredientStatus(ingredient: RecipeIngredient) {
  if (ingredient.current_stock <= 0) return { label: 'Out of stock', dot: 'bg-berry-500' };
  if (ingredient.current_stock <= ingredient.reorder_level) {
    return { label: 'Low stock', dot: 'bg-honey-500' };
  }
  return { label: 'In stock', dot: 'bg-matcha-500' };
}

export function RecipeCard({
  drink,
  onEdit,
}: {
  drink: DrinkWithRecipe;
  onEdit: (drink: DrinkWithRecipe) => void;
}) {
  const costPerCup = drink.recipe_items.reduce(
    (total, item) => total + item.quantity * (item.ingredient?.cost_per_unit ?? 0),
    0,
  );
  const margin = drink.price > 0 ? ((drink.price - costPerCup) / drink.price) * 100 : 0;
  const itemCount = drink.recipe_items.length;

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-tight text-espresso-900">
            {drink.name}
          </p>
          <div className="mt-1.5">
            <Badge variant="neutral">{drink.category}</Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <p className="font-display text-lg text-espresso-900">{formatMoney(drink.price)}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${drink.name}`}
            onClick={() => onEdit(drink)}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-cream-50 p-3 ring-1 ring-inset ring-espresso-100">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-espresso-300">
            Cost / cup
          </p>
          <p className="mt-1 text-sm font-semibold text-espresso-900">{formatMoney(costPerCup)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-espresso-300">
            Margin
          </p>
          <p
            className={cn(
              'mt-1 text-sm font-semibold',
              margin < 0 ? 'text-berry-700' : margin >= 60 ? 'text-matcha-700' : 'text-honey-700',
            )}
          >
            {margin.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-espresso-300">
          Recipe
        </p>

        {itemCount === 0 ? (
          <p className="mt-2 rounded-xl border border-dashed border-espresso-200 bg-cream-50 px-3 py-4 text-xs text-espresso-300">
            No recipe items yet. Edit this drink to add automatic deductions.
          </p>
        ) : (
          <ul className="mt-1.5 divide-y divide-espresso-100">
            {drink.recipe_items.map((item) => {
              const ingredient = item.ingredient;
              const status = ingredient ? ingredientStatus(ingredient) : null;

              return (
                <li key={item.id} className="flex items-center justify-between gap-2 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn('h-1.5 w-1.5 shrink-0 rounded-full', status?.dot ?? 'bg-espresso-200')}
                      title={status?.label}
                    />
                    <span className="truncate text-xs text-espresso-700">
                      {ingredient?.name ?? 'Missing ingredient'}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-espresso-900">
                    {formatQuantity(item.quantity, ingredient?.unit ?? 'g')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-3 border-t border-espresso-100 pt-3 text-[10px] text-espresso-300">
        {itemCount} ingredient{itemCount === 1 ? '' : 's'} · stock status updates live
      </p>
    </Card>
  );
}
