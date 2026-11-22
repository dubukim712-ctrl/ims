import { sanitizeSearch } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { StockLog, StockLogPage, StockLogType } from '@/types/domain';

export interface StockLogFilters {
  page?: number;
  pageSize?: number;
  type?: StockLogType | 'all';
  types?: StockLogType[];
  search?: string;
  branchId?: string;
}

const LOG_SELECT = `
  id, branch_id, ingredient_id, drink_id, change_amount, type, note, supplier,
  previous_stock, new_stock, cups_sold, created_at,
  ingredient:ingredients ( id, name, unit ),
  drink:drinks ( id, name )
`;

export async function listStockLogs(filters: StockLogFilters = {}): Promise<StockLogPage> {
  const { page = 1, pageSize = 15, type, types, search, branchId } = filters;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('stock_logs')
    .select(LOG_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (branchId) query = query.eq('branch_id', branchId);

  if (type && type !== 'all') query = query.eq('type', type);
  if (types?.length) query = query.in('type', types);

  const term = search ? sanitizeSearch(search) : '';
  if (term) query = query.or(`note.ilike.%${term}%,supplier.ilike.%${term}%`);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { rows: (data ?? []) as unknown as StockLog[], count: count ?? 0 };
}

export async function listRecentStockLogs(
  limit = 6,
  types?: StockLogType[],
  branchId?: string,
): Promise<StockLog[]> {
  let query = supabase
    .from('stock_logs')
    .select(LOG_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (branchId) query = query.eq('branch_id', branchId);

  if (types?.length) query = query.in('type', types);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as StockLog[];
}

export interface StockInPayload {
  branch_id: string;
  ingredient_id: string;
  quantity: number;
  supplier?: string;
  note?: string;
}

export async function stockInIngredient(payload: StockInPayload): Promise<StockLog> {
  const { data, error } = await supabase.rpc('stock_in_ingredient', {
    p_branch_id: payload.branch_id,
    p_ingredient_id: payload.ingredient_id,
    p_quantity: payload.quantity,
    p_supplier: payload.supplier?.trim() || null,
    p_note: payload.note?.trim() || null,
  });

  if (error) throw new Error(error.message);
  return data as StockLog;
}

export interface AdjustmentPayload {
  branch_id: string;
  ingredient_id: string;
  change: number;
  type: Extract<StockLogType, 'spoilage' | 'adjustment'>;
  note: string;
}

export async function adjustIngredientStock(payload: AdjustmentPayload): Promise<StockLog> {
  const { data, error } = await supabase.rpc('adjust_ingredient_stock', {
    p_branch_id: payload.branch_id,
    p_ingredient_id: payload.ingredient_id,
    p_change: payload.change,
    p_type: payload.type,
    p_note: payload.note.trim(),
  });

  if (error) throw new Error(error.message);
  return data as StockLog;
}

export interface TransferPayload {
  from_branch_id: string;
  to_branch_id: string;
  ingredient_id: string;
  quantity: number;
  note?: string;
}

export async function transferStock(payload: TransferPayload): Promise<void> {
  const { error } = await supabase.rpc('transfer_stock', {
    p_from_branch_id: payload.from_branch_id,
    p_to_branch_id: payload.to_branch_id,
    p_ingredient_id: payload.ingredient_id,
    p_quantity: payload.quantity,
    p_note: payload.note?.trim() || null,
  });
  if (error) throw new Error(error.message);
}
