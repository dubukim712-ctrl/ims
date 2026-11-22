import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { AuditLogCards, AuditLogTable } from '@/components/recipes/AuditLogTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useStockLogs } from '@/hooks/useStock';
import { getErrorMessage } from '@/lib/errors';
import { STOCK_LOG_LABELS, STOCK_LOG_TYPES } from '@/lib/constants';
import type { StockLogType } from '@/types/domain';

const PAGE_SIZE = 15;

interface AuditLogsProps {
  initialType?: StockLogType | 'all';
}

export function AuditLogs({ initialType = 'all' }: AuditLogsProps) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<StockLogType | 'all'>(initialType);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const logsQuery = useStockLogs({
    page,
    pageSize: PAGE_SIZE,
    type,
    search: debouncedSearch,
  });

  const logs = logsQuery.data?.rows ?? [];
  const count = logsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [type, debouncedSearch]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Stock audit log"
        description="Every restock, recipe deduction, spoilage entry and manual correction."
      />

      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search notes or supplier…"
            label="Search audit logs"
            className="flex-1"
          />
          <Select
            value={type}
            onChange={(event) => setType(event.target.value as StockLogType | 'all')}
            aria-label="Filter by log type"
            className="sm:w-48"
          >
            <option value="all">All movement types</option>
            {STOCK_LOG_TYPES.map((logType) => (
              <option key={logType} value={logType}>
                {STOCK_LOG_LABELS[logType]}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-2 text-xs text-espresso-500">
        <p>
          <span className="font-semibold text-espresso-900">{count}</span> entr
          {count === 1 ? 'y' : 'ies'}
        </p>
        {logsQuery.isFetching ? (
          <span className="inline-flex items-center gap-1.5 text-espresso-300">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            Updating
          </span>
        ) : null}
      </div>

      {logsQuery.isLoading ? (
        <LoadingState label="Loading stock logs…" />
      ) : logsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(logsQuery.error)}
          onRetry={() => void logsQuery.refetch()}
        />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No stock logs found"
          description={
            debouncedSearch || type !== 'all'
              ? 'Try clearing the search or choosing another movement type.'
              : 'Record a restock or log daily usage to start the audit trail.'
          }
          icon={ClipboardList}
        />
      ) : (
        <>
          <AuditLogTable logs={logs} />
          <AuditLogCards logs={logs} />
        </>
      )}

      {count > PAGE_SIZE ? (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-espresso-100 bg-white px-4 py-3 sm:flex-row">
          <p className="text-xs text-espresso-500">
            Page <span className="font-semibold text-espresso-900">{page}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || logsQuery.isFetching}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || logsQuery.isFetching}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
