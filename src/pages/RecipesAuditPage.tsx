import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, ClipboardList, CupSoda, SearchX } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { AuditLogs } from '@/components/recipes/AuditLogs';
import { useDrinksWithRecipes } from '@/hooks/useRecipes';
import { getErrorMessage } from '@/lib/errors';
import { STOCK_LOG_TYPES } from '@/lib/constants';
import type { StockLogType } from '@/types/domain';

type PageTab = 'recipes' | 'logs';

export function RecipesAuditPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const tab: PageTab = searchParams.get('tab') === 'logs' ? 'logs' : 'recipes';
  const typeParam = searchParams.get('type');
  const initialType: StockLogType | 'all' = STOCK_LOG_TYPES.includes(typeParam as StockLogType)
    ? (typeParam as StockLogType)
    : 'all';

  const drinksQuery = useDrinksWithRecipes();
  const drinks = drinksQuery.data ?? [];

  const filteredDrinks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return drinks;

    return drinks.filter(
      (drink) =>
        drink.name.toLowerCase().includes(term) ||
        drink.category.toLowerCase().includes(term) ||
        drink.recipe_items.some((item) =>
          (item.ingredient?.name ?? '').toLowerCase().includes(term),
        ),
    );
  }, [drinks, search]);

  const recipeLinks = drinks.reduce((total, drink) => total + drink.recipe_items.length, 0);

  const changeTab = (next: PageTab) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'recipes') {
      params.delete('tab');
      params.delete('type');
    } else {
      params.set('tab', 'logs');
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Recipes & audit logs"
        description="Inspect what goes into every drink, then follow every stock movement in one place."
      />

      <SegmentedTabs
        value={tab}
        onChange={changeTab}
        options={[
          { value: 'recipes', label: 'Recipes', icon: BookOpen, count: drinks.length },
          { value: 'logs', label: 'Audit logs', icon: ClipboardList },
        ]}
      />

      {tab === 'recipes' ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search recipes…"
              label="Search recipes"
              className="w-full sm:max-w-sm"
            />
            <div className="flex items-center gap-2 text-xs text-espresso-500">
              <Badge variant="neutral">{drinks.length} drinks</Badge>
              <Badge variant="caramel">{recipeLinks} recipe links</Badge>
            </div>
          </div>

          {drinksQuery.isLoading ? (
            <LoadingState label="Loading recipes…" />
          ) : drinksQuery.isError ? (
            <ErrorState
              message={getErrorMessage(drinksQuery.error)}
              onRetry={() => void drinksQuery.refetch()}
            />
          ) : drinks.length === 0 ? (
            <EmptyState
              title="No drinks yet"
              description="Create drinks and their recipe items in Supabase to see ingredient breakdowns and cost per cup."
              icon={CupSoda}
            />
          ) : filteredDrinks.length === 0 ? (
            <EmptyState
              title="No recipes match"
              description="Try a different drink name, category or ingredient."
              icon={SearchX}
              action={
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-xs font-semibold text-caramel-700 hover:text-caramel-600"
                >
                  Clear search
                </button>
              }
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredDrinks.map((drink) => (
                <RecipeCard key={drink.id} drink={drink} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <AuditLogs key={initialType} initialType={initialType} />
      )}
    </div>
  );
}
