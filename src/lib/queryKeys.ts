import type { QueryClient } from '@tanstack/react-query';

/**
 * Central query keys keep cache invalidation predictable.
 * Any write to stock affects ingredients, logs and the dashboard.
 */
export const queryKeys = {
  ingredients: ['ingredients'] as const,
  stockLogs: (filters: Record<string, unknown>) => ['stock-logs', filters] as const,
  recentLogs: (limit: number, types?: string[]) =>
    ['stock-logs', 'recent', limit, types ?? 'all'] as const,
  drinksWithRecipes: ['drinks', 'with-recipes'] as const,
};

export function invalidateInventory(client: QueryClient) {
  void client.invalidateQueries({ queryKey: queryKeys.ingredients });
  void client.invalidateQueries({ queryKey: ['stock-logs'] });
}

export function invalidateRealtimeInventory(client: QueryClient) {
  void client.invalidateQueries({ queryKey: queryKeys.ingredients });
  void client.invalidateQueries({ queryKey: ['stock-logs'] });
  void client.invalidateQueries({ queryKey: queryKeys.drinksWithRecipes });
}
