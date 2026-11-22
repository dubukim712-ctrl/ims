import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { StockInForm } from '@/components/stock/StockInForm';
import { RecentRestocks } from '@/components/stock/RecentRestocks';

export function StockInPage() {
  const [searchParams] = useSearchParams();
  const ingredientId = searchParams.get('ingredient') ?? undefined;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Stock in"
        description="Record deliveries, keep supplier notes and bring low-stock items back to a healthy level."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <StockInForm defaultIngredientId={ingredientId} />
        <RecentRestocks />
      </div>
    </div>
  );
}
