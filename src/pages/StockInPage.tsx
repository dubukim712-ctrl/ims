import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { StockInForm } from '@/components/stock/StockInForm';
import { RecentRestocks } from '@/components/stock/RecentRestocks';
import { TransferStockModal } from '@/components/stock/TransferStockModal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function StockInPage() {
  const [searchParams] = useSearchParams();
  const [transferOpen, setTransferOpen] = useState(false);
  const ingredientId = searchParams.get('ingredient') ?? undefined;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Stock in"
        description="Record deliveries, keep supplier notes and bring low-stock items back to a healthy level."
        actions={
          <Button variant="outline" onClick={() => setTransferOpen(true)}>
            Transfer stock
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <StockInForm defaultIngredientId={ingredientId} />
        <RecentRestocks />
      </div>
      {transferOpen ? (
        <TransferStockModal open onClose={() => setTransferOpen(false)} />
      ) : null}
    </div>
  );
}
