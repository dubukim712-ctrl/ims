import { useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useCreateIngredient, useUpdateIngredient } from '@/hooks/useIngredients';
import { getErrorMessage } from '@/lib/errors';
import { INGREDIENT_CATEGORIES, UNITS } from '@/lib/constants';
import { convertMassUnit } from '@/lib/format';
import {
  ingredientSchema,
  type IngredientFormValues,
} from '@/validation/ingredient.schema';
import type { Ingredient } from '@/types/domain';

interface IngredientFormModalProps {
  open: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

const unitLabels: Record<string, string> = {
  g: 'g — grams',
  kg: 'kg — kilograms',
  ml: 'ml — milliliters',
  pcs: 'pcs — pieces',
};

export function IngredientFormModal({ open, onClose, ingredient }: IngredientFormModalProps) {
  const isEdit = Boolean(ingredient);
  const createMutation = useCreateIngredient();
  const updateMutation = useUpdateIngredient();
  const pending = createMutation.isPending || updateMutation.isPending;

  const categoryOptions = useMemo(() => {
    const values = new Set(INGREDIENT_CATEGORIES);
    if (ingredient?.category) values.add(ingredient.category);
    return [...values];
  }, [ingredient?.category]);

  const {
    control,
    getValues,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IngredientFormValues>({
    resolver: yupResolver(ingredientSchema),
    defaultValues: {
      name: ingredient?.name ?? '',
      category: ingredient?.category ?? INGREDIENT_CATEGORIES[0],
      unit: ingredient?.unit ?? 'g',
      current_stock: ingredient?.current_stock ?? 0,
      reorder_level: ingredient?.reorder_level ?? 0,
      cost_per_unit: ingredient?.cost_per_unit ?? 0,
      supplier: ingredient?.supplier ?? '',
    },
  });

  const unit = useWatch({ control, name: 'unit' });
  const previousUnit = useRef(unit);

  useEffect(() => {
    const from = previousUnit.current;
    if (from === unit) return;

    const values = getValues();
    if ((from === 'g' || from === 'kg') && (unit === 'g' || unit === 'kg')) {
      setValue('current_stock', convertMassUnit(Number(values.current_stock) || 0, from, unit));
      setValue('reorder_level', convertMassUnit(Number(values.reorder_level) || 0, from, unit));

      const cost = Number(values.cost_per_unit) || 0;
      if (from === 'g' && unit === 'kg') {
        setValue('cost_per_unit', cost * 1000);
      } else if (from === 'kg' && unit === 'g') {
        setValue('cost_per_unit', cost / 1000);
      }
    }
    previousUnit.current = unit;
  }, [getValues, setValue, unit]);

  const onSubmit = async (values: IngredientFormValues) => {
    try {
      if (ingredient) {
        await updateMutation.mutateAsync({ id: ingredient.id, input: values });
        toast.success(`${values.name} updated`);
      } else {
        await createMutation.mutateAsync(values);
        toast.success(`${values.name} added to inventory`);
      }
      onClose();
    } catch (error) {
      toast.error('Could not save ingredient', { description: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit ingredient' : 'Add ingredient'}
      description={
        isEdit
          ? 'Update stock details, reorder level or supplier information.'
          : 'Track a new coffee, tea, dairy, syrup or packaging item.'
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="ingredient-form" loading={pending}>
            {isEdit ? 'Save changes' : 'Add ingredient'}
          </Button>
        </div>
      }
    >
      <form id="ingredient-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Ingredient name" htmlFor="name" error={errors.name?.message} required>
          <Input
            id="name"
            placeholder="e.g. Espresso beans"
            invalid={Boolean(errors.name)}
            {...register('name')}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="category" error={errors.category?.message} required>
            <Select id="category" invalid={Boolean(errors.category)} {...register('category')}>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Unit" htmlFor="unit" error={errors.unit?.message} required>
            <Select id="unit" invalid={Boolean(errors.unit)} {...register('unit')}>
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unitLabels[unit]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Current stock"
            htmlFor="current_stock"
            error={errors.current_stock?.message}
            hint="Amount currently on the shelf."
            required
          >
            <Input
              id="current_stock"
              type="number"
              step={unit === 'kg' ? '0.001' : '0.1'}
              min="0"
              invalid={Boolean(errors.current_stock)}
              {...register('current_stock', { valueAsNumber: true })}
            />
          </Field>

          <Field
            label="Reorder level"
            htmlFor="reorder_level"
            error={errors.reorder_level?.message}
            hint="Alert when stock reaches this amount."
            required
          >
            <Input
              id="reorder_level"
              type="number"
              step={unit === 'kg' ? '0.001' : '0.1'}
              min="0"
              invalid={Boolean(errors.reorder_level)}
              {...register('reorder_level', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Cost per unit"
            htmlFor="cost_per_unit"
            error={errors.cost_per_unit?.message}
            hint="Used to estimate stock value."
            required
          >
            <Input
              id="cost_per_unit"
              type="number"
              step={unit === 'kg' ? '0.01' : '0.001'}
              min="0"
              invalid={Boolean(errors.cost_per_unit)}
              {...register('cost_per_unit', { valueAsNumber: true })}
            />
          </Field>

          <Field label="Supplier" htmlFor="supplier" error={errors.supplier?.message}>
            <Input
              id="supplier"
              placeholder="e.g. Highland Roasters"
              invalid={Boolean(errors.supplier)}
              {...register('supplier')}
            />
          </Field>
        </div>
      </form>
    </Modal>
  );
}
