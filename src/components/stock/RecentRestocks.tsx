import { Link } from 'react-router-dom';
import { ArrowRight, PackageCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ErrorState } from '@/components/ui/States';
import { StockLogRow } from '@/components/stock/StockLogRow';
import { useStockLogs } from '@/hooks/useStock';
import { getErrorMessage } from '@/lib/errors';

export function RecentRestocks() {
  const logsQuery = useStockLogs({ type: 'stock_in', page: 1, pageSize: 6 });
  const logs = logsQuery.data?.rows ?? [];

  return (
    <Card className="p-5">
      <SectionHeading
        title="Recent restocks"
        description="Latest deliveries recorded"
        action={
          <Link
            to="/recipes?tab=logs&type=stock_in"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-caramel-700 hover:text-caramel-600"
          >
            All logs
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mt-3">
        {logsQuery.isLoading ? (
          <div className="space-y-3 py-2">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex animate-pulse items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cream-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-28 rounded bg-cream-100" />
                  <div className="h-2.5 w-20 rounded bg-cream-100" />
                </div>
              </div>
            ))}
          </div>
        ) : logsQuery.isError ? (
          <ErrorState
            className="py-6"
            message={getErrorMessage(logsQuery.error)}
            onRetry={() => void logsQuery.refetch()}
          />
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="rounded-2xl bg-cream-100 p-3 text-espresso-300">
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-espresso-900">No restocks yet</p>
            <p className="mt-1 text-xs text-espresso-500">
              Your first recorded delivery will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-espresso-100">
            {logs.map((log) => (
              <StockLogRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
