import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { ArrowRight, PackagePlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useIngredients } from '@/hooks/useIngredients';
import { useStockIn } from '@/hooks/useStock';
import { getErrorMessage } from '@/lib/errors';
import { formatQuantity } from '@/lib/format';
import { stockInSchema, type StockInFormValues } from '@/validation/stock.schema';

interface StockInFormProps {
  defaultIngredientId?: string;
}

export function StockInForm({ defaultIngredientId }: StockInFormProps) {
  const { data: ingredients = [] } = useIngredients();
  const stockIn = useStockIn();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StockInFormValues>({
    resolver: yupResolver(stockInSchema),
    defaultValues: {
      ingredient_id: defaultIngredientId ?? '',
      quantity: 1,
      supplier: '',
      note: '',
    },
  });

  const ingredientId = watch('ingredient_id');
  const quantity = Number(watch('quantity')) || 0;
  const selected = ingredients.find((item) => item.id === ingredientId) ?? null;

  // Prefill the supplier whenever a different ingredient is chosen.
  useEffect(() => {
    if (!selected) return;
    setValue('supplier', selected.supplier ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, setValue]);

  const newStock = selected ? selected.current_stock + quantity : 0;

  const onSubmit = async (values: StockInFormValues) => {
    try {
      await stockIn.mutateAsync(values);
      toast.success(`Restocked ${selected?.name ?? 'ingredient'}`, {
        description: `Added ${formatQuantity(values.quantity, selected?.unit ?? 'g')} to inventory.`,
      });
      reset({
        ingredient_id: values.ingredient_id,
        quantity: 1,
        supplier: values.supplier,
        note: '',
      });
    } catch (error) {
      toast.error('Could not record stock in', { description: getErrorMessage(error) });
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      <SectionHeading
        title="Record a restock"
        description="Add delivered stock and keep the supplier note for your audit trail."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <Field
          label="Ingredient"
          htmlFor="ingredient_id"
          error={errors.ingredient_id?.message}
          required
        >
          <Select
            id="ingredient_id"
            invalid={Boolean(errors.ingredient_id)}
            {...register('ingredient_id')}
          >
            <option value="">Choose an ingredient…</option>
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name} · {formatQuantity(ingredient.current_stock, ingredient.unit)} on hand
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Quantity received"
            htmlFor="quantity"
            error={errors.quantity?.message}
            hint="Use the ingredient's stock unit."
            required
          >
            <div className="relative">
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                className="pr-14"
                invalid={Boolean(errors.quantity)}
                {...register('quantity', { valueAsNumber: true })}
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-espresso-300">
                {selected?.unit ?? 'unit'}
              </span>
            </div>
          </Field>

          <Field
            label="Supplier"
            htmlFor="supplier"
            error={errors.supplier?.message}
            hint="Prefilled from the ingredient when available."
          >
            <Input
              id="supplier"
              placeholder="e.g. Highland Roasters"
              invalid={Boolean(errors.supplier)}
              {...register('supplier')}
            />
          </Field>
        </div>

        <Field
          label="Supplier note"
          htmlFor="note"
          error={errors.note?.message}
          hint="Optional — invoice number, delivery condition, etc."
        >
          <Textarea
            id="note"
            placeholder="e.g. Invoice #1042, delivered chilled"
            invalid={Boolean(errors.note)}
            {...register('note')}
          />
        </Field>

        <div className="rounded-2xl bg-cream-50 p-4 ring-1 ring-inset ring-espresso-100">
          {selected ? (
            <>
              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-espresso-300">Current</p>
                  <p className="mt-1 text-sm font-semibold text-espresso-900">
                    {formatQuantity(selected.current_stock, selected.unit)}
                  </p>
                </div>
                <span className="text-espresso-300">+</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-espresso-300">Incoming</p>
                  <p className="mt-1 text-sm font-semibold text-matcha-700">
                    {formatQuantity(quantity, selected.unit)}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-espresso-300" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-espresso-300">New stock</p>
                  <p className="mt-1 text-sm font-bold text-espresso-900">
                    {formatQuantity(newStock, selected.unit)}
                  </p>
                </div>
              </div>
              <p className="mt-3 border-t border-espresso-100 pt-2.5 text-[11px] text-espresso-500">
                Reorder level is {formatQuantity(selected.reorder_level, selected.unit)}.
                {newStock > selected.reorder_level
                  ? ' This restock brings the item back above its reorder level.'
                  : ' The item will still need attention after this restock.'}
              </p>
            </>
          ) : (
            <p className="flex items-center gap-2 text-xs text-espresso-300">
              <PackagePlus className="h-4 w-4" aria-hidden="true" />
              Choose an ingredient to preview the new stock level.
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={stockIn.isPending}
          disabled={!ingredients.length}
        >
          <PackagePlus className="h-4 w-4" aria-hidden="true" />
          Record stock in
        </Button>
      </form>
    </Card>
  );
}
