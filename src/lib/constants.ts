import type { StockLogType, Unit } from '@/types/domain';

export const UNITS: Unit[] = ['g', 'kg', 'ml', 'pcs'];

export const INGREDIENT_CATEGORIES = [
  'Coffee',
  'Tea',
  'Dairy',
  'Syrup',
  'Toppings',
  'Packaging',
  'Other',
];

export const DRINK_CATEGORIES = ['Coffee', 'Milk Tea', 'Fruit Tea', 'Soda', 'Other'];

export const STOCK_LOG_LABELS: Record<StockLogType, string> = {
  stock_in: 'Stock in',
  usage: 'Daily usage',
  spoilage: 'Spoilage',
  adjustment: 'Adjustment',
  transfer_out: 'Transfer out',
  transfer_in: 'Transfer in',
};

export const STOCK_LOG_TYPES: StockLogType[] = [
  'stock_in',
  'usage',
  'spoilage',
  'adjustment',
  'transfer_out',
  'transfer_in',
];
