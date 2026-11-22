import type { Ingredient, StockStatus, Unit } from '@/types/domain';

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return numberFormatter.format(value);
}

export function formatQuantity(value: number, unit: Unit): string {
  if (unit === 'g' && value >= 1000) {
    return `${formatNumber(value / 1000)} kg`;
  }
  if (unit === 'kg' && value < 1) {
    return `${formatNumber(value * 1000)} g`;
  }
  return `${formatNumber(value)} ${unit}`;
}

export function convertMassUnit(
  value: number,
  from: Unit,
  to: Unit,
): number {
  if (!Number.isFinite(value) || from === to) return value;
  if (from === 'kg' && to === 'g') return value * 1000;
  if (from === 'g' && to === 'kg') return value / 1000;
  return value;
}

export function formatMoney(value: number): string {
  const digits = Math.abs(value) < 1 ? 3 : 2;
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDate(value: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(value);
}

export function getStockStatus(ingredient: Ingredient): StockStatus {
  if (ingredient.current_stock <= 0) return 'out';
  if (ingredient.current_stock <= ingredient.reorder_level) return 'low';
  return 'healthy';
}

/** How full the stock bar should be relative to a healthy level (2x reorder). */
export function getStockPercent(ingredient: Ingredient): number {
  const target = Math.max(ingredient.reorder_level * 2, ingredient.current_stock, 1);
  return Math.min(100, Math.max(0, (ingredient.current_stock / target) * 100));
}

export function formatChange(value: number, unit?: Unit): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatNumber(value)}${unit ? ` ${unit}` : ''}`;
}

/** Remove characters that would break PostgREST `or` filter syntax. */
export function sanitizeSearch(value: string): string {
  return value.replace(/[,()]/g, ' ').trim();
}
