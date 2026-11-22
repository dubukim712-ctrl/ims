import { useDeferredValue, useMemo, useState } from 'react';
import { PackagePlus, Plus, SearchX } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { IngredientFormModal } from '@/components/inventory/IngredientFormModal';
import { InventoryFilters, type StockFilter } from '@/components/inventory/InventoryFilters';
import { IngredientTable } from '@/components/inventory/IngredientTable';
import { IngredientCard } from '@/components/inventory/IngredientCard';
import { useIngredients } from '@/hooks/useIngredients';
import { getErrorMessage } from '@/lib/errors';
import type { Ingredient } from '@/types/domain';

type ModalState = { mode: 'create' } | { mode: 'edit'; ingredient: Ingredient } | null;

export function InventoryPage() {
  const ingredientsQuery = useIngredients();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<StockFilter>('all');
  const [modal, setModal] = useState<ModalState>(null);
  const deferredSearch = useDeferredValue(search);

  const ingredients = ingredientsQuery.data ?? [];

  const categories = useMemo(
    () => [...new Set(ingredients.map((item) => item.category))].sort(),
    [ingredients],
  );

  const filtered = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();

    return ingredients.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        (item.supplier ?? '').toLowerCase().includes(term);

      const low = item.current_stock <= item.reorder_level;
      const matchesStatus =
        status === 'all' ||
        (status === 'low' && low) ||
        (status === 'out' && item.current_stock <= 0) ||
        (status === 'healthy' && !low);

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [ingredients, category, status, deferredSearch]);

  const lowCount = ingredients.filter(
    (item) => item.current_stock <= item.reorder_level,
  ).length;
  const hasFilters = Boolean(search) || category !== 'All' || status !== 'all';

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('all');
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Search, filter and maintain every ingredient used behind the counter."
        actions={
          <Button onClick={() => setModal({ mode: 'create' })}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add ingredient
          </Button>
        }
      />

      {ingredientsQuery.isLoading ? (
        <LoadingState label="Loading ingredients…" />
      ) : ingredientsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(ingredientsQuery.error)}
          onRetry={() => void ingredientsQuery.refetch()}
        />
      ) : (
        <>
          <InventoryFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            status={status}
            onStatusChange={setStatus}
            categories={categories}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-espresso-500">
            <p>
              Showing <span className="font-semibold text-espresso-900">{filtered.length}</span> of{' '}
              {ingredients.length} ingredients
            </p>
            <div className="flex items-center gap-3">
              {lowCount > 0 ? (
                <span className="font-semibold text-honey-700">{lowCount} low stock</span>
              ) : null}
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-caramel-700 hover:text-caramel-600"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>

          {ingredients.length === 0 ? (
            <EmptyState
              title="Your inventory is empty"
              description="Add your first ingredient to start tracking stock, reorder levels and daily usage."
              icon={PackagePlus}
              action={
                <Button size="sm" onClick={() => setModal({ mode: 'create' })}>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add ingredient
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No ingredients match"
              description="Try a different search term, category or stock status."
              icon={SearchX}
              action={
                <Button size="sm" variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <IngredientTable
                ingredients={filtered}
                onEdit={(ingredient) => setModal({ mode: 'edit', ingredient })}
              />
              <div className="grid gap-3 sm:grid-cols-2 md:hidden">
                {filtered.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    onEdit={(item) => setModal({ mode: 'edit', ingredient: item })}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {modal ? (
        <IngredientFormModal
          key={modal.mode === 'edit' ? modal.ingredient.id : 'new-ingredient'}
          open
          onClose={() => setModal(null)}
          ingredient={modal.mode === 'edit' ? modal.ingredient : null}
        />
      ) : null}
    </div>
  );
}
