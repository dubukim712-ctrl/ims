import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { SlidersHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { useIngredients } from '@/hooks/useIngredients';
import { useAdjustStock } from '@/hooks/useStock';
import { getErrorMessage } from '@/lib/errors';
import { formatChange, formatQuantity } from '@/lib/format';
import { cn } from '@/lib/cn';
import { spoilageSchema, type SpoilageFormValues } from '@/validation/usage.schema';

type AdjustmentMode = 'spoilage' | 'adjustment';

export function SpoilageForm() {
  const [mode, setMode] = useState<AdjustmentMode>('spoilage');
  const { data: ingredients = [] } = useIngredients();
  const adjustStock = useAdjustStock();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<SpoilageFormValues>({
    resolver: yupResolver(spoilageSchema),
    defaultValues: { ingredient_id: '', quantity: 1, note: '' },
  });

  const ingredientId = watch('ingredient_id');
  const quantity = Number(watch('quantity')) || 0;
  const selected = ingredients.find((item) => item.id === ingredientId) ?? null;
  const signedChange = mode === 'spoilage' ? -Math.abs(quantity) : quantity;
  const newStock = selected ? selected.current_stock + signedChange : 0;

  const changeMode = (next: AdjustmentMode) => {
    setMode(next);
    setValue('quantity', 1);
    clearErrors('quantity');
  };

  const onSubmit = async (values: SpoilageFormValues) => {
    if (!selected) return;

    const qty = Number(values.quantity);
    const change = mode === 'spoilage' ? -Math.abs(qty) : qty;

    if (mode === 'spoilage' && qty <= 0) {
      setError('quantity', { message: 'Enter a positive quantity' });
      return;
    }
    if (selected.current_stock + change < 0) {
      setError('quantity', {
        message: `Only ${formatQuantity(selected.current_stock, selected.unit)} available`,
      });
      return;
    }

    try {
      await adjustStock.mutateAsync({
        ingredient_id: values.ingredient_id,
        change,
        type: mode,
        note: values.note,
      });
      toast.success(mode === 'spoilage' ? 'Spoilage recorded' : 'Stock adjusted', {
        description: `${selected.name} is now ${formatQuantity(selected.current_stock + change, selected.unit)}.`,
      });
      reset({ ingredient_id: values.ingredient_id, quantity: 1, note: '' });
    } catch (error) {
      toast.error('Could not save adjustment', { description: getErrorMessage(error) });
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      <SectionHeading
        title="Spoilage or adjustment"
        description="Write off expired stock or correct the counted quantity."
      />

      <div className="mt-4">
        <SegmentedTabs
          value={mode}
          onChange={changeMode}
          options={[
            { value: 'spoilage', label: 'Spoilage', icon: Trash2 },
            { value: 'adjustment', label: 'Adjustment', icon: SlidersHorizontal },
          ]}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <Field
          label="Ingredient"
          htmlFor="spoilage-ingredient"
          error={errors.ingredient_id?.message}
          required
        >
          <Select
            id="spoilage-ingredient"
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

        <Field
          label={mode === 'spoilage' ? 'Quantity spoiled' : 'Adjustment amount'}
          htmlFor="spoilage-quantity"
          error={errors.quantity?.message}
          hint={
            mode === 'spoilage'
              ? 'Enter a positive amount. It will be removed from stock.'
              : 'Positive adds stock. Negative removes stock.'
          }
          required
        >
          <div className="relative">
            <Input
              id="spoilage-quantity"
              type="number"
              step="0.1"
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
          label="Reason"
          htmlFor="spoilage-note"
          error={errors.note?.message}
          hint="Required for the audit log."
          required
        >
          <Textarea
            id="spoilage-note"
            placeholder={
              mode === 'spoilage'
                ? 'e.g. Milk expired, pearls left out overnight'
                : 'e.g. Weekly count found 200 g extra'
            }
            invalid={Boolean(errors.note)}
            {...register('note')}
          />
        </Field>

        <div className="rounded-2xl bg-cream-50 p-4 ring-1 ring-inset ring-espresso-100">
          {selected ? (
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-espresso-300">Current</p>
                <p className="mt-1 text-sm font-semibold text-espresso-900">
                  {formatQuantity(selected.current_stock, selected.unit)}
                </p>
              </div>
              <span className="text-espresso-300">→</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-espresso-300">Change</p>
                <p
                  className={cn(
                    'mt-1 text-sm font-semibold',
                    signedChange >= 0 ? 'text-matcha-700' : 'text-berry-700',
                  )}
                >
                  {formatChange(signedChange, selected.unit)}
                </p>
              </div>
              <span className="text-espresso-300">=</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-espresso-300">New stock</p>
                <p
                  className={cn(
                    'mt-1 text-sm font-bold',
                    newStock < 0 ? 'text-berry-700' : 'text-espresso-900',
                  )}
                >
                  {formatQuantity(newStock, selected.unit)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-espresso-300">
              Choose an ingredient to preview the stock change.
            </p>
          )}
          {selected && newStock < 0 ? (
            <p className="mt-3 border-t border-espresso-100 pt-2.5 text-[11px] font-medium text-berry-700">
              This would make stock negative. Reduce the quantity.
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={adjustStock.isPending}
          disabled={!ingredients.length}
        >
          {mode === 'spoilage' ? (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          )}
          {mode === 'spoilage' ? 'Record spoilage' : 'Save adjustment'}
        </Button>
      </form>
    </Card>
  );
}
