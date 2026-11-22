import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  adjustIngredientStock,
  listRecentStockLogs,
  listStockLogs,
  stockInIngredient,
  type AdjustmentPayload,
  type StockInPayload,
  type StockLogFilters,
  TransferPayload,
  transferStock,
} from '@/services/stock.service';
import { invalidateInventory, queryKeys } from '@/lib/queryKeys';
import type { StockLogType } from '@/types/domain';
import { useBranches } from '@/context/BranchContext';

export function useStockLogs(filters: StockLogFilters = {}) {
  const { selectedBranch } = useBranches();
  const scopedFilters = { ...filters, branchId: selectedBranch?.id };
  return useQuery({
    queryKey: queryKeys.stockLogs(scopedFilters as Record<string, unknown>),
    queryFn: () => listStockLogs(scopedFilters),
    enabled: Boolean(selectedBranch),
    placeholderData: keepPreviousData,
  });
}

export function useRecentStockLogs(limit = 6, types?: StockLogType[]) {
  const { selectedBranch } = useBranches();
  return useQuery({
    queryKey: [...queryKeys.recentLogs(limit, types), selectedBranch?.id ?? 'none'] as const,
    queryFn: () => listRecentStockLogs(limit, types, selectedBranch!.id),
    enabled: Boolean(selectedBranch),
  });
}

export function useStockIn() {
  const queryClient = useQueryClient();
  const { selectedBranch } = useBranches();

  return useMutation({
    mutationFn: (payload: Omit<StockInPayload, 'branch_id'>) =>
      stockInIngredient({ ...payload, branch_id: selectedBranch!.id }),
    onSuccess: () => invalidateInventory(queryClient),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  const { selectedBranch } = useBranches();

  return useMutation({
    mutationFn: (payload: Omit<AdjustmentPayload, 'branch_id'>) =>
      adjustIngredientStock({ ...payload, branch_id: selectedBranch!.id }),
    onSuccess: () => invalidateInventory(queryClient),
  });
}

export function useTransferStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransferPayload) => transferStock(payload),
    onSuccess: () => invalidateInventory(queryClient),
  });
}
