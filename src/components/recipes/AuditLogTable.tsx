import { Card } from '@/components/ui/Card';
import { StockLogTypeBadge } from '@/components/stock/StockLogRow';
import { formatChange, formatDateTime, formatQuantity } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { StockLog } from '@/types/domain';

export function AuditLogTable({ logs }: { logs: StockLog[] }) {
  return (
    <Card className="hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-espresso-100 bg-cream-50">
            <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-espresso-300">
              <th className="px-5 py-3.5">When</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Ingredient</th>
              <th className="px-4 py-3.5">Change</th>
              <th className="px-4 py-3.5">Stock after</th>
              <th className="px-5 py-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso-100">
            {logs.map((log) => {
              const unit = log.ingredient?.unit ?? 'g';
              const detail = [log.note, log.supplier, log.drink?.name].filter(Boolean).join(' · ');

              return (
                <tr key={log.id} className="align-top transition hover:bg-cream-50/70">
                  <td className="whitespace-nowrap px-5 py-3.5 text-xs text-espresso-500">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StockLogTypeBadge type={log.type} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-espresso-900">
                      {log.ingredient?.name ?? 'Unknown'}
                    </p>
                    {log.drink?.name ? (
                      <p className="mt-0.5 text-[10px] text-espresso-300">{log.drink.name}</p>
                    ) : null}
                  </td>
                  <td
                    className={cn(
                      'whitespace-nowrap px-4 py-3.5 text-xs font-bold',
                      log.change_amount >= 0 ? 'text-matcha-700' : 'text-berry-700',
                    )}
                  >
                    {formatChange(log.change_amount, unit)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-espresso-700">
                    {formatQuantity(log.new_stock, unit)}
                  </td>
                  <td className="max-w-xs px-5 py-3.5 text-xs text-espresso-500">
                    <p className="line-clamp-2">{detail || '—'}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function AuditLogCards({ logs }: { logs: StockLog[] }) {
  return (
    <div className="space-y-3 md:hidden">
      {logs.map((log) => {
        const unit = log.ingredient?.unit ?? 'g';
        const detail = [log.note, log.supplier, log.drink?.name].filter(Boolean).join(' · ');

        return (
          <Card key={log.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <StockLogTypeBadge type={log.type} />
              <p className="text-[10px] text-espresso-300">{formatDateTime(log.created_at)}</p>
            </div>
            <div className="mt-2.5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-espresso-900">
                  {log.ingredient?.name ?? 'Unknown'}
                </p>
                <p className="mt-0.5 text-[11px] text-espresso-300">
                  Stock after: {formatQuantity(log.new_stock, unit)}
                </p>
              </div>
              <p
                className={cn(
                  'shrink-0 text-sm font-bold',
                  log.change_amount >= 0 ? 'text-matcha-700' : 'text-berry-700',
                )}
              >
                {formatChange(log.change_amount, unit)}
              </p>
            </div>
            {detail ? (
              <p className="mt-2.5 border-t border-espresso-100 pt-2.5 text-[11px] text-espresso-500">
                {detail}
              </p>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
