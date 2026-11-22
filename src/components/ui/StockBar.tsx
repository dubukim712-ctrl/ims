import { getStockPercent, getStockStatus } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Ingredient } from '@/types/domain';

const barColors = {
  out: 'bg-berry-500',
  low: 'bg-honey-500',
  healthy: 'bg-matcha-500',
};

export function StockBar({ ingredient }: { ingredient: Ingredient }) {
  const status = getStockStatus(ingredient);
  const percent = getStockPercent(ingredient);

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-label={`${ingredient.name} stock level`}
    >
      <div
        className={cn('h-full rounded-full transition-all', barColors[status])}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
