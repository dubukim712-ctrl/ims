import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { CupSoda } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DrinkUsageRow } from '@/components/usage/DrinkUsageRow';
import { DeductionPreview, type DeductionItem } from '@/components/usage/DeductionPreview';
import { useLogDailyUsage } from '@/hooks/useUsage';
import { getErrorMessage } from '@/lib/errors';
import { cupsSoldSchema, type CupsSoldFormValues } from '@/validation/usage.schema';
import type { DrinkWithRecipe } from '@/types/domain';

export function CupsSoldFormBody({ drinks }: { drinks: DrinkWithRecipe[] }) {
  const logUsage = useLogDailyUsage();
  const noRecipeCount = drinks.filter((drink) => !drink.recipe_items.length).length;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CupsSoldFormValues>({
    resolver: yupResolver(cupsSoldSchema),
    defaultValues: {
      items: drinks.map((drink) => ({ drink_id: drink.id, cups_sold: 0 })),
    },
  });

  const items = useWatch({ control, name: 'items' }) ?? [];
  const totalCups = items.reduce((sum, item) => sum + (Number(item?.cups_sold) || 0), 0);

  const preview = items.reduce<DeductionItem[]>((totals, item) => {
    const drink = drinks.find((entry) => entry.id === item?.drink_id);
    const cups = Number(item?.cups_sold) || 0;
    if (!drink || cups <= 0) return totals;

    for (const recipe of drink.recipe_items) {
      if (!recipe.ingredient) continue;
      const existing = totals.find((entry) => entry.id === recipe.ingredient?.id);
      if (existing) {
        existing.required += recipe.quantity * cups;
      } else {
        totals.push({
          id: recipe.ingredient.id,
          name: recipe.ingredient.name,
          unit: recipe.ingredient.unit,
          required: recipe.quantity * cups,
          available: recipe.ingredient.current_stock,
        });
      }
    }

    return totals;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  const itemsError = errors.items?.message ?? errors.items?.root?.message ?? undefined;

  const onSubmit = async (values: CupsSoldFormValues) => {
    const payload = values.items
      .filter((item) => Number(item.cups_sold) > 0)
      .map((item) => ({ drink_id: item.drink_id, cups_sold: Number(item.cups_sold) }));

    try {
      const result = await logUsage.mutateAsync(payload);
      toast.success(
        `Logged ${result.drinks_logged} drink${result.drinks_logged === 1 ? '' : 's'} sold`,
        {
          description: `${result.ingredients_deducted} ingredient deduction${
            result.ingredients_deducted === 1 ? '' : 's'
          } saved to stock logs.`,
        },
      );
      reset({ items: drinks.map((drink) => ({ drink_id: drink.id, cups_sold: 0 })) });
    } catch (error) {
      toast.error('Could not log daily usage', { description: getErrorMessage(error) });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <SectionHeading
              title="Cups sold today"
              description="Enter the number of cups sold for each drink. Recipe ingredients are deducted automatically."
            />
            <Badge variant="caramel" className="shrink-0">
              Today
            </Badge>
          </div>

          {noRecipeCount > 0 ? (
            <p className="mt-4 rounded-xl bg-honey-50 px-3.5 py-2.5 text-xs leading-relaxed text-honey-700 ring-1 ring-inset ring-honey-300">
              {noRecipeCount} drink{noRecipeCount === 1 ? ' has' : 's have'} no recipe yet. Those
              rows are disabled until recipe items are added in Supabase.
            </p>
          ) : null}

          <div className="mt-4 space-y-2.5">
            {drinks.map((drink, index) => (
              <DrinkUsageRow
                key={drink.id}
                drink={drink}
                index={index}
                control={control}
                register={register}
                error={errors.items?.[index]?.cups_sold?.message}
                disabled={!drink.recipe_items.length}
              />
            ))}
          </div>

          {itemsError ? (
            <p role="alert" className="mt-3 text-xs font-medium text-berry-700">
              {itemsError}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 border-t border-espresso-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-espresso-300">
                Total cups
              </p>
              <p className="font-display text-2xl leading-tight text-espresso-900">
                {totalCups}{' '}
                <span className="font-sans text-sm font-medium text-espresso-300">cups</span>
              </p>
            </div>
            <Button type="submit" size="lg" loading={logUsage.isPending}>
              <CupSoda className="h-4 w-4" aria-hidden="true" />
              Log daily usage
            </Button>
          </div>
        </Card>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <DeductionPreview items={preview} totalCups={totalCups} />
        </div>
      </div>
    </form>
  );
}
