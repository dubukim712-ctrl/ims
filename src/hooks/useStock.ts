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
} from '@/services/stock.service';
import { invalidateInventory, queryKeys } from '@/lib/queryKeys';
import type { StockLogType } from '@/types/domain';

export function useStockLogs(filters: StockLogFilters = {}) {
  return useQuery({
    queryKey: queryKeys.stockLogs(filters as Record<string, unknown>),
    queryFn: () => listStockLogs(filters),
    placeholderData: keepPreviousData,
  });
}

export function useRecentStockLogs(limit = 6, types?: StockLogType[]) {
  return useQuery({
    queryKey: queryKeys.recentLogs(limit, types),
    queryFn: () => listRecentStockLogs(limit, types),
  });
}

export function useStockIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StockInPayload) => stockInIngredient(payload),
    onSuccess: () => invalidateInventory(queryClient),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdjustmentPayload) => adjustIngredientStock(payload),
    onSuccess: () => invalidateInventory(queryClient),
  });
}
