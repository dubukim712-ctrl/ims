import { Link, useLocation } from 'react-router-dom';
import { Coffee, TriangleAlert } from 'lucide-react';
import { NAV_ITEMS } from '@/components/layout/navigation';
import { useIngredients } from '@/hooks/useIngredients';

export function MobileTopbar() {
  const location = useLocation();
  const { data: ingredients } = useIngredients();
  const current = NAV_ITEMS.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to),
  );
  const lowCount = (ingredients ?? []).filter(
    (item) => item.current_stock <= item.reorder_level,
  ).length;

  return (
    <header className="sticky top-0 z-20 border-b border-espresso-100 bg-cream-50/90 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso-900 text-caramel-300">
            <Coffee className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg leading-none text-espresso-900">BrewStock</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-espresso-300">
              {current?.label ?? 'Inventory'}
            </p>
          </div>
        </div>

        <Link
          to="/inventory"
          className="inline-flex items-center gap-1.5 rounded-full border border-espresso-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-espresso-700 shadow-sm"
        >
          <TriangleAlert className={lowCount > 0 ? 'h-3.5 w-3.5 text-honey-500' : 'h-3.5 w-3.5 text-matcha-500'} />
          {lowCount > 0 ? `${lowCount} low` : 'Stock ok'}
        </Link>
      </div>
    </header>
  );
}
