import { Controller, type Control, type UseFormRegister } from 'react-hook-form';
import { Badge } from '@/components/ui/Badge';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatNumber } from '@/lib/format';
import type { CupsSoldFormValues } from '@/validation/usage.schema';
import type { DrinkWithRecipe } from '@/types/domain';

interface DrinkUsageRowProps {
  drink: DrinkWithRecipe;
  index: number;
  control: Control<CupsSoldFormValues>;
  register: UseFormRegister<CupsSoldFormValues>;
  error?: string;
  disabled?: boolean;
}

export function DrinkUsageRow({
  drink,
  index,
  control,
  register,
  error,
  disabled = false,
}: DrinkUsageRowProps) {
  const summary = drink.recipe_items
    .slice(0, 2)
    .map((item) => {
      const ingredient = item.ingredient;
      return `${formatNumber(item.quantity)} ${ingredient?.unit ?? ''} ${ingredient?.name ?? 'Unknown'}`;
    })
    .join(' · ');
  const extra = drink.recipe_items.length - 2;
  const hasRecipe = drink.recipe_items.length > 0;

  return (
    <div className="rounded-2xl border border-espresso-100 bg-white p-3.5 transition hover:border-espresso-200 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-espresso-900">{drink.name}</p>
            <Badge variant="neutral">{drink.category}</Badge>
          </div>
          <p className={`mt-1 text-[11px] ${hasRecipe ? 'text-espresso-500' : 'text-honey-700'}`}>
            {hasRecipe
              ? `${summary}${extra > 0 ? ` · +${extra} more` : ''}`
              : 'No recipe set — add recipe items in Supabase before logging this drink.'}
          </p>
          {error ? (
            <p role="alert" className="mt-1 text-[11px] font-medium text-berry-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
          <span className="text-[11px] font-semibold text-espresso-300">Cups</span>
          <Controller
            control={control}
            name={`items.${index}.cups_sold`}
            render={({ field }) => (
              <QuantityStepper
                value={Number(field.value) || 0}
                onChange={field.onChange}
                disabled={disabled}
                ariaLabel={`Cups sold for ${drink.name}`}
              />
            )}
          />
        </div>
      </div>

      <input
        type="hidden"
        defaultValue={drink.id}
        {...register(`items.${index}.drink_id`)}
      />
    </div>
  );
}
