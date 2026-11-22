import { QueryClient } from '@tanstack/react-query';

/**
 * Shared cache settings. Inventory data changes only when someone performs an
 * action in the app, so we keep it warm and avoid noisy refetches.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
