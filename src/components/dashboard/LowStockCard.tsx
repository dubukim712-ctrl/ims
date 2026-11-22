import { Link } from 'react-router-dom';
import { ArrowRight, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { StockBar } from '@/components/ui/StockBar';
import { formatQuantity, getStockStatus } from '@/lib/format';
import type { Ingredient } from '@/types/domain';

export function LowStockCard({ ingredient }: { ingredient: Ingredient }) {
  const status = getStockStatus(ingredient);
  const isOut = status === 'out';
  const shortfall = Math.max(ingredient.reorder_level - ingredient.current_stock, 0);

  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-espresso-900">{ingredient.name}</p>
          <p className="mt-0.5 text-[11px] text-espresso-300">{ingredient.category}</p>
        </div>
        <Badge variant={isOut ? 'berry' : 'honey'} className="shrink-0">
          {isOut ? 'Out' : 'Low'}
        </Badge>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="font-display text-2xl leading-none text-espresso-900">
          {formatQuantity(ingredient.current_stock, ingredient.unit)}
        </p>
        <p className="text-right text-[10px] leading-tight text-espresso-300">
          Reorder at
          <br />
          <span className="font-semibold text-espresso-500">
            {formatQuantity(ingredient.reorder_level, ingredient.unit)}
          </span>
        </p>
      </div>

      <div className="mt-3">
        <StockBar ingredient={ingredient} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-espresso-100 pt-3">
        <p className="inline-flex items-center gap-1 text-[11px] font-medium text-espresso-500">
          <TriangleAlert className="h-3 w-3 text-honey-500" aria-hidden="true" />
          {isOut ? 'Restock immediately' : `${formatQuantity(shortfall, ingredient.unit)} to reorder`}
        </p>
        <Link
          to={`/stock-in?ingredient=${ingredient.id}`}
          className="inline-flex items-center gap-0.5 text-[11px] font-bold text-caramel-700 hover:text-caramel-600"
        >
          Restock
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
