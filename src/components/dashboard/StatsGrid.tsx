import { StatCard } from "@/components/ui/StatCard";
import { formatMoney } from "@/lib/format";
import type { InventoryStats } from "@/lib/inventoryStats";

export function StatsGrid({ stats }: { stats: InventoryStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Ingredients"
        value={String(stats.total)}
        hint="Active items tracked"
      />
      <StatCard
        label="Low stock"
        value={String(stats.lowStock)}
        hint="At or below reorder"
      />
      <StatCard
        label="Out of stock"
        value={String(stats.outOfStock)}
        hint="Needs restocking now"
      />
      <StatCard
        label="Stock value"
        value={formatMoney(stats.inventoryValue)}
        hint="At current unit cost"
      />
    </div>
  );
}
