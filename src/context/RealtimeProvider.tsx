import { useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBranches } from '@/context/BranchContext';
import { subscribeToBrewstockRealtime } from '@/services/realtime.service';
import { invalidateRealtimeInventory } from '@/lib/queryKeys';
import { supabase } from '@/lib/supabase';

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { selectedBranch, refreshBranches } = useBranches();
  const branchId = selectedBranch?.id;

  useEffect(() => {
    if (!branchId) return;

    const channel = subscribeToBrewstockRealtime(branchId, {
      onInventoryChange: () => invalidateRealtimeInventory(queryClient),
      onStockLogChange: () => invalidateRealtimeInventory(queryClient),
      onBranchChange: () => {
        void refreshBranches();
        invalidateRealtimeInventory(queryClient);
      },
    });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [branchId, queryClient, refreshBranches]);

  return children;
}
