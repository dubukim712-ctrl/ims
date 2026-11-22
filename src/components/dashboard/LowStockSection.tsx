import { CheckCircle2, PackagePlus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LowStockCard } from '@/components/dashboard/LowStockCard';
import type { Ingredient } from '@/types/domain';

interface LowStockSectionProps {
  lowStock: Ingredient[];
  totalIngredients: number;
}

export function LowStockSection({ lowStock, totalIngredients }: LowStockSectionProps) {
  return (
    <section className="space-y-3">
      <SectionHeading
        title="Low-stock alerts"
        description="Items at or below their reorder level"
        action={
          <Badge variant={lowStock.length ? 'honey' : 'matcha'}>
            {lowStock.length} alert{lowStock.length === 1 ? '' : 's'}
          </Badge>
        }
      />

      {totalIngredients === 0 ? (
        <EmptyState
          title="No ingredients yet"
          description="Add coffee beans, tea, milk and packaging to start tracking stock."
          icon={PackagePlus}
          action={
            <ButtonLink to="/inventory" size="sm">
              Go to inventory
            </ButtonLink>
          }
        />
      ) : lowStock.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-matcha-300 bg-matcha-50 px-5 py-4">
          <span className="rounded-xl bg-white p-2 text-matcha-700 shadow-sm">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-espresso-900">Every item is above its reorder level</p>
            <p className="text-xs text-espresso-500">Nice work. Keep logging daily usage to stay ahead.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {lowStock.map((ingredient) => (
            <LowStockCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </section>
  );
}
