import { supabase } from '@/lib/supabase';
import type { CupsSoldItem, DailyUsageResult } from '@/types/domain';

/**
 * Sends all drinks sold today in one call. The database function checks stock,
 * deducts every recipe ingredient and writes one stock log per ingredient.
 */
export async function logDailyDrinkUsage(
  items: CupsSoldItem[],
): Promise<DailyUsageResult> {
  const payload = items
    .filter((item) => item.cups_sold > 0)
    .map((item) => ({
      drink_id: item.drink_id,
      cups_sold: Math.trunc(item.cups_sold),
    }));

  if (!payload.length) {
    throw new Error('Enter cups sold for at least one drink.');
  }

  const { data, error } = await supabase.rpc('log_daily_drink_usage', {
    p_items: payload,
  });

  if (error) throw new Error(error.message);

  const result = (data ?? {}) as Partial<DailyUsageResult>;
  return {
    drinks_logged: Number(result.drinks_logged ?? payload.length),
    ingredients_deducted: Number(result.ingredients_deducted ?? 0),
  };
}
