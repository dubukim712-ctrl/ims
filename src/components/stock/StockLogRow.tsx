import { ArrowDownRight, ArrowUpRight, CupSoda, PackagePlus, SlidersHorizontal, Trash2, type LucideIcon } from 'lucide-react';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { formatDateTime, formatQuantity } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { StockLog, StockLogType } from '@/types/domain';

const typeConfig: Record<
  StockLogType,
  { label: string; variant: BadgeVariant; icon: LucideIcon; iconClass: string }
> = {
  stock_in: {
    label: 'Stock in',
    variant: 'matcha',
    icon: PackagePlus,
    iconClass: 'bg-matcha-100 text-matcha-700',
  },
  usage: {
    label: 'Daily usage',
    variant: 'caramel',
    icon: CupSoda,
    iconClass: 'bg-caramel-100 text-caramel-700',
  },
  spoilage: {
    label: 'Spoilage',
    variant: 'berry',
    icon: Trash2,
    iconClass: 'bg-berry-100 text-berry-700',
  },
  adjustment: {
    label: 'Adjustment',
    variant: 'neutral',
    icon: SlidersHorizontal,
    iconClass: 'bg-espresso-100 text-espresso-700',
  },
};

export function StockLogTypeBadge({ type }: { type: StockLogType }) {
  const config = typeConfig[type];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface StockLogRowProps {
  log: StockLog;
  showType?: boolean;
}

export function StockLogRow({ log, showType = false }: StockLogRowProps) {
  const config = typeConfig[log.type];
  const Icon = config.icon;
  const unit = log.ingredient?.unit;
  const positive = log.change_amount > 0;
  const detail = [log.note, log.supplier].filter(Boolean).join(' · ');

  return (
    <div className="flex items-center gap-3 py-3">
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', config.iconClass)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-espresso-900">
            {log.ingredient?.name ?? 'Unknown ingredient'}
          </p>
          {showType ? <StockLogTypeBadge type={log.type} /> : null}
        </div>
        <p className="truncate text-xs text-espresso-300">
          {detail || (log.drink ? log.drink.name : config.label)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            'inline-flex items-center gap-0.5 text-sm font-bold',
            positive ? 'text-matcha-700' : 'text-berry-700',
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {formatQuantity(Math.abs(log.change_amount), unit ?? 'g')}
        </p>
        <p className="mt-0.5 text-[10px] text-espresso-300">{formatDateTime(log.created_at)}</p>
      </div>
    </div>
  );
}
