import { CupSoda } from 'lucide-react';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { CupsSoldFormBody } from '@/components/usage/CupsSoldFormBody';
import { useDrinksWithRecipes } from '@/hooks/useRecipes';
import { getErrorMessage } from '@/lib/errors';

export function CupsSoldForm() {
  const drinksQuery = useDrinksWithRecipes();
  const drinks = drinksQuery.data ?? [];

  if (drinksQuery.isLoading) return <LoadingState label="Loading drinks and recipes…" />;

  if (drinksQuery.isError) {
    return (
      <ErrorState
        message={getErrorMessage(drinksQuery.error)}
        onRetry={() => void drinksQuery.refetch()}
      />
    );
  }

  if (drinks.length === 0) {
    return (
      <EmptyState
        title="No drinks available"
        description="Add active drinks and their recipe items in Supabase to start logging cups sold."
        icon={CupSoda}
      />
    );
  }

  // Remount the form when the drink list changes so defaults stay in sync.
  return <CupsSoldFormBody key={drinks.map((drink) => drink.id).join('|')} drinks={drinks} />;
}
