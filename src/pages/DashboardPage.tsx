import { useMemo } from "react";
import { CupSoda, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { LowStockSection } from "@/components/dashboard/LowStockSection";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useIngredients } from "@/hooks/useIngredients";
import { useRecentStockLogs } from "@/hooks/useStock";
import {
  computeInventoryStats,
  getLowStockIngredients,
} from "@/lib/inventoryStats";
import { getErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";

export function DashboardPage() {
  const ingredientsQuery = useIngredients();
  const logsQuery = useRecentStockLogs(6);

  const ingredients = ingredientsQuery.data ?? [];
  const stats = useMemo(
    () => computeInventoryStats(ingredients),
    [ingredients],
  );
  const lowStock = useMemo(
    () => getLowStockIngredients(ingredients),
    [ingredients],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatDate()}
        title="Good day, knee-gas!"
        description="A quick look at stock health, low-stock alerts and today’s inventory activity."
        actions={
          <>
            <ButtonLink to="/usage" variant="outline" size="md">
              <CupSoda className="h-4 w-4" aria-hidden="true" />
              Log usage
            </ButtonLink>
            <ButtonLink to="/stock-in" size="md">
              <PackagePlus className="h-4 w-4" aria-hidden="true" />
              Stock in
            </ButtonLink>
          </>
        }
      />

      {ingredientsQuery.isLoading ? (
        <LoadingState label="Loading inventory…" />
      ) : ingredientsQuery.isError ? (
        <ErrorState
          message={getErrorMessage(ingredientsQuery.error)}
          onRetry={() => void ingredientsQuery.refetch()}
        />
      ) : (
        <>
          <StatsGrid stats={stats} />

          <LowStockSection
            lowStock={lowStock}
            totalIngredients={ingredients.length}
          />

          <div className="grid items-start gap-4 lg:grid-cols-2">
            <CategoryBreakdown ingredients={ingredients} />
            <RecentActivity
              logs={logsQuery.data ?? []}
              isLoading={logsQuery.isLoading}
              isError={logsQuery.isError}
              onRetry={() => void logsQuery.refetch()}
            />
          </div>
        </>
      )}
    </div>
  );
}
