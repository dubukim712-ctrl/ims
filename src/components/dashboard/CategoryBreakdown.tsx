import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { groupByCategory } from '@/lib/inventoryStats';
import { cn } from '@/lib/cn';
import type { Ingredient } from '@/types/domain';

export function CategoryBreakdown({ ingredients }: { ingredients: Ingredient[] }) {
  const categories = groupByCategory(ingredients).slice(0, 7);

  return (
    <Card className="p-5">
      <SectionHeading
        title="Stock by category"
        description="Coverage across your ingredient groups"
      />

      {categories.length === 0 ? (
        <p className="mt-6 text-sm text-espresso-300">No categories to show yet.</p>
      ) : (
        <ul className="mt-4 space-y-3.5">
          {categories.map((category) => {
            const percent = category.total ? (category.low / category.total) * 100 : 0;
            return (
              <li key={category.category}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-espresso-700">{category.category}</span>
                  <span className="text-espresso-300">
                    {category.total} item{category.total === 1 ? '' : 's'}
                    {category.low > 0 ? ` · ${category.low} low` : ''}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-200">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      category.low > 0 ? 'bg-honey-500' : 'bg-matcha-500',
                    )}
                    style={{ width: `${category.low > 0 ? Math.max(percent, 6) : 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
