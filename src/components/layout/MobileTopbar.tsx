import { Link, useLocation } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/navigation";
import { useIngredients } from "@/hooks/useIngredients";
import { useBranches } from "@/context/BranchContext";
import { Select } from "@/components/ui/Select";

export function MobileTopbar() {
  const location = useLocation();
  const { data: ingredients } = useIngredients();
  const { branches, selectedBranch, setSelectedBranch } = useBranches();
  const current = NAV_ITEMS.find((item) =>
    item.to === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(item.to),
  );
  const lowCount = (ingredients ?? []).filter(
    (item) => item.current_stock <= item.reorder_level,
  ).length;

  return (
    <header className="sticky top-0 z-20 border-b border-espresso-100 bg-cream-50/90 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="J.Cresent"
            className="h-9 w-9 shrink-0 rounded-xl object-contain"
          />
          <div>
            <p className="font-display text-lg leading-none text-espresso-900">
              J.CRESENT
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-espresso-300">
              {current?.label ?? "Inventory"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            aria-label="Active branch"
            value={selectedBranch?.id ?? ""}
            onChange={(event) => {
              const branch = branches.find(
                (item) => item.id === event.target.value,
              );
              if (branch) setSelectedBranch(branch);
            }}
            className="h-9 w-[108px] px-2 text-[11px]"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
          <Link
            to="/inventory"
            className="inline-flex items-center gap-1.5 rounded-full border border-espresso-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-espresso-700 shadow-sm"
          >
            <TriangleAlert
              className={
                lowCount > 0
                  ? "h-3.5 w-3.5 text-honey-500"
                  : "h-3.5 w-3.5 text-matcha-500"
              }
            />
            {lowCount > 0 ? `${lowCount} low` : "Stock ok"}
          </Link>
        </div>
      </div>
    </header>
  );
}
