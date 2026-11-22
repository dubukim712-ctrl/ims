import { NavLink, Link } from "react-router-dom";
import { ArrowRight, Settings, TriangleAlert } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/navigation";
import { useIngredients } from "@/hooks/useIngredients";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { useBranches } from "@/context/BranchContext";
import { BranchManagerModal } from "@/components/layout/BranchManagerModal";
import { Select } from "@/components/ui/Select";

export function Sidebar() {
  const { branches, selectedBranch, setSelectedBranch } = useBranches();
  const [branchModal, setBranchModal] = useState<"add" | "edit" | null>(null);
  const { data: ingredients } = useIngredients();
  const lowCount = (ingredients ?? []).filter(
    (item) => item.current_stock <= item.reorder_level,
  ).length;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-espresso-900 text-cream-100 lg:flex">
      <div className="shrink-0 px-5 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="BrewStock"
            className="h-10 w-10 shrink-0 rounded-xl object-contain"
          />
          <div>
            <p className="font-display text-xl leading-none text-cream-50">
              J.CRESENT
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-300">
              Cafe &amp; Eatery
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <p className="px-1 text-[9px] font-bold uppercase tracking-[0.16em] text-espresso-300">
            Active branch
          </p>
          <Select
            aria-label="Active branch"
            value={selectedBranch?.id ?? ""}
            onChange={(event) => {
              const branch = branches.find(
                (item) => item.id === event.target.value,
              );
              if (branch) setSelectedBranch(branch);
            }}
            className="border-white/10 bg-white/10 text-cream-50"
          >
            {branches.map((branch) => (
              <option
                key={branch.id}
                value={branch.id}
                className="text-espresso-900"
              >
                {branch.name}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setBranchModal("add")}
              className="flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold text-espresso-200 hover:bg-white/5 hover:text-cream-50"
            >
              <Settings className="h-3 w-3" aria-hidden="true" />
              Add
            </button>
            <button
              type="button"
              onClick={() => setBranchModal("edit")}
              disabled={!selectedBranch}
              className="rounded-lg px-2 py-2 text-[11px] font-semibold text-espresso-200 hover:bg-white/5 hover:text-cream-50 disabled:opacity-50"
            >
              Edit selected
            </button>
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-white/10" />

      <nav
        className="flex-1 overflow-y-auto px-3 py-5"
        aria-label="Main navigation"
      >
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-espresso-300">
          Workspace
        </p>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-white/10 text-cream-50 shadow-sm"
                      : "text-espresso-200 hover:bg-white/5 hover:text-cream-50",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive
                          ? "text-caramel-300"
                          : "text-espresso-300 group-hover:text-caramel-300",
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.to === "/inventory" && lowCount > 0 ? (
                      <span className="rounded-full bg-caramel-500 px-2 py-0.5 text-[10px] font-bold text-espresso-900">
                        {lowCount}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-3">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
          <div className="flex items-center gap-2 text-caramel-300">
            <TriangleAlert className="h-4 w-4" aria-hidden="true" />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
              Today&apos;s focus
            </p>
          </div>
          <p className="mt-2 text-sm font-semibold text-cream-50">
            {lowCount > 0
              ? `${lowCount} item${lowCount === 1 ? "" : "s"} need attention`
              : "All stock looks healthy"}
          </p>
          <Link
            to="/inventory"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-caramel-300 hover:text-caramel-200"
          >
            Review inventory
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-3 px-2 pb-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-caramel-500/20 text-xs font-bold text-caramel-200">
            SM
          </span>
          <div>
            <p className="text-xs font-semibold text-cream-50">Shop Manager</p>
            <p className="text-[10px] text-espresso-300">
              Internal inventory tool
            </p>
          </div>
        </div>
      </div>
      {branchModal ? (
        <BranchManagerModal
          open
          onClose={() => setBranchModal(null)}
          branch={branchModal === "edit" ? selectedBranch : null}
        />
      ) : null}
    </aside>
  );
}
