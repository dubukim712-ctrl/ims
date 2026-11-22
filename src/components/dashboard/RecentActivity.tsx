import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ErrorState } from '@/components/ui/States';
import { StockLogRow } from '@/components/stock/StockLogRow';
import type { StockLog } from '@/types/domain';

interface RecentActivityProps {
  logs: StockLog[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RecentActivity({ logs, isLoading, isError, onRetry }: RecentActivityProps) {
  return (
    <Card className="p-5">
      <SectionHeading
        title="Recent activity"
        description="Latest stock movements"
        action={
          <Link
            to="/recipes?tab=logs"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-caramel-700 hover:text-caramel-600"
          >
            View logs
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mt-3">
        {isLoading ? (
          <div className="space-y-3 py-2">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex animate-pulse items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cream-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 rounded bg-cream-100" />
                  <div className="h-2.5 w-24 rounded bg-cream-100" />
                </div>
                <div className="h-3 w-14 rounded bg-cream-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState className="py-6" message="Could not load recent activity." onRetry={onRetry} />
        ) : logs.length === 0 ? (
          <p className="py-8 text-center text-sm text-espresso-300">
            No stock movements yet. Record a restock or log today&apos;s usage.
          </p>
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
