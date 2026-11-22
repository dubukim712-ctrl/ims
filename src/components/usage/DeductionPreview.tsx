import { AlertTriangle, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatQuantity } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Unit } from '@/types/domain';

export interface DeductionItem {
  id: string;
  name: string;
  unit: Unit;
  required: number;
  available: number;
}

interface DeductionPreviewProps {
  items: DeductionItem[];
  totalCups: number;
}

export function DeductionPreview({ items, totalCups }: DeductionPreviewProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-caramel-100 p-1.5 text-caramel-700">
            <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <h3 className="font-display text-base text-espresso-900">Deduction preview</h3>
        </div>
        <Badge variant="caramel">{totalCups} cups</Badge>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-xs leading-relaxed text-espresso-300">
          Enter cups sold to see which recipe ingredients will be deducted.
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.map((item) => {
            const short = item.required > item.available;
            return (
              <li key={item.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-espresso-800">{item.name}</p>
                  <p className={cn('text-[10px]', short ? 'text-berry-700' : 'text-espresso-300')}>
                    {short
                      ? `Only ${formatQuantity(item.available, item.unit)} available`
                      : `${formatQuantity(item.available, item.unit)} in stock`}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 text-xs font-bold',
                    short ? 'text-berry-700' : 'text-espresso-900',
                  )}
                >
                  −{formatQuantity(item.required, item.unit)}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {items.some((item) => item.required > item.available) ? (
        <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-berry-50 p-2.5 text-[10px] leading-relaxed text-berry-700">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          Some ingredients are short. The database will reject the entry and no stock will change.
        </p>
      ) : (
        <p className="mt-4 border-t border-espresso-100 pt-3 text-[10px] leading-relaxed text-espresso-300">
          Stock is checked again when you submit. All deductions happen in one transaction.
        </p>
      )}
    </Card>
  );
}
