import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/cn';

export type StockFilter = 'all' | 'low' | 'out' | 'healthy';

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: StockFilter;
  onStatusChange: (value: StockFilter) => void;
  categories: string[];
}

export function InventoryFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
}: InventoryFiltersProps) {
  return (
    <Card className="p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search ingredients…"
          className="lg:w-72 lg:shrink-0"
        />

        <div className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-1 lg:pb-0">
          {['All', ...categories].map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onCategoryChange(item)}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition',
                  active
                    ? 'border-espresso-900 bg-espresso-900 text-cream-50'
                    : 'border-espresso-100 bg-white text-espresso-500 hover:border-espresso-200 hover:text-espresso-900',
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <Select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as StockFilter)}
          aria-label="Filter by stock status"
          className="lg:w-40 lg:shrink-0"
        >
          <option value="all">All stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
          <option value="healthy">Healthy</option>
        </Select>
      </div>
    </Card>
  );
}
