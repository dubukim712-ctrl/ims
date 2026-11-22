import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { Branch } from '@/types/domain';

interface BranchContextValue {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  refreshBranches: () => Promise<void>;
  saveBranch: (input: { id?: string; name: string; location?: string }, isActive?: boolean) => Promise<Branch>;
}

const BranchContext = createContext<BranchContextValue | null>(null);
const STORAGE_KEY = 'brewstock-selected-branch';

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(null);

  const refreshBranches = useCallback(async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name, location, is_active, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    const active = (data ?? []) as Branch[];
    setBranches(active);

    setSelectedBranchState((current) => {
      const storedId = localStorage.getItem(STORAGE_KEY);
      return active.find((branch) => branch.id === (current?.id ?? storedId))
        ?? active[0]
        ?? null;
    });
  }, []);

  useEffect(() => {
    void refreshBranches();
  }, [refreshBranches]);

  const setSelectedBranch = useCallback((branch: Branch) => {
    setSelectedBranchState(branch);
    localStorage.setItem(STORAGE_KEY, branch.id);
  }, []);

  useEffect(() => {
    if (selectedBranch) localStorage.setItem(STORAGE_KEY, selectedBranch.id);
  }, [selectedBranch]);

  const saveBranch = useCallback(async (
    input: { id?: string; name: string; location?: string },
    isActive = true,
  ) => {
    const row = {
      name: input.name.trim(),
      location: input.location?.trim() || null,
      is_active: isActive,
    };
    const query = input.id
      ? supabase.from('branches').update(row).eq('id', input.id).select(
          'id, name, location, is_active, created_at',
        ).single()
      : supabase.from('branches').insert(row).select(
          'id, name, location, is_active, created_at',
        ).single();
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    await refreshBranches();
    return data as Branch;
  }, [refreshBranches]);

  const value = useMemo(() => ({
    branches,
    selectedBranch,
    setSelectedBranch,
    refreshBranches,
    saveBranch,
  }), [branches, selectedBranch, setSelectedBranch, refreshBranches, saveBranch]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranches() {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranches must be used inside BranchProvider');
  return context;
}
