import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeCallbacks {
  onInventoryChange: () => void;
  onStockLogChange: () => void;
  onBranchChange: () => void;
}

export function subscribeToBrewstockRealtime(
  branchId: string,
  callbacks: RealtimeCallbacks,
): RealtimeChannel {
  return supabase
    .channel(`brewstock-realtime-${branchId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'branch_inventory',
        filter: `branch_id=eq.${branchId}`,
      },
      callbacks.onInventoryChange,
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'stock_logs',
        filter: `branch_id=eq.${branchId}`,
      },
      callbacks.onStockLogChange,
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'branches',
      },
      callbacks.onBranchChange,
    )
    .subscribe();
}
