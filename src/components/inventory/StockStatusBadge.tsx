import { Badge } from '@/components/ui/Badge';
import { getStockStatus } from '@/lib/format';
import type { Ingredient } from '@/types/domain';

export function StockStatusBadge({ ingredient }: { ingredient: Ingredient }) {
  const status = getStockStatus(ingredient);

  if (status === 'out') return <Badge variant="berry">Out of stock</Badge>;
  if (status === 'low') return <Badge variant="honey">Low stock</Badge>;
  return <Badge variant="matcha">Healthy</Badge>;
}
