import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { DrinkImagePicker } from '@/components/recipes/DrinkImagePicker';
import { useSaveDrink } from '@/hooks/useRecipes';
import { DRINK_CATEGORIES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errors';
import { drinkSchema, type DrinkFormValues } from '@/validation/drink.schema';
import type { Drink } from '@/types/domain';

interface DrinkFormModalProps {
  open: boolean;
  onClose: () => void;
  drink?: Drink | null;
}

export function DrinkFormModal({ open, onClose, drink }: DrinkFormModalProps) {
  const saveMutation = useSaveDrink();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEdit = Boolean(drink);
  const categoryOptions = useMemo(() => {
    const values = new Set(DRINK_CATEGORIES);
    if (drink?.category) values.add(drink.category);
    return [...values];
  }, [drink?.category]);

  useEffect(() => {
    setImageFile(null);
  }, [drink?.id, open]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DrinkFormValues>({
    resolver: yupResolver(drinkSchema),
    defaultValues: {
      name: drink?.name ?? '',
      category: drink?.category ?? DRINK_CATEGORIES[0],
      price: drink?.price ?? 0,
    },
  });

  const onSubmit = async (values: DrinkFormValues) => {
    try {
      await saveMutation.mutateAsync({
        input: { ...values, image_url: drink?.image_url ?? null },
        drinkId: drink?.id,
        imageFile: imageFile ?? undefined,
      });
      toast.success(drink ? `${values.name} updated` : `${values.name} added`);
      onClose();
    } catch (error) {
      toast.error('Could not save drink', { description: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit drink' : 'Add drink'}
      description="Manage drinks once, then assign recipe ingredients to them."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saveMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" form="drink-form" loading={saveMutation.isPending}>
            {isEdit ? 'Save changes' : 'Add drink'}
          </Button>
        </div>
      }
    >
      <form id="drink-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Drink name" htmlFor="drink-name" error={errors.name?.message} required>
          <Input
            id="drink-name"
            placeholder="e.g. Iced Vanilla Latte"
            invalid={Boolean(errors.name)}
            {...register('name')}
          />
        </Field>
        <Field label="Category" htmlFor="drink-category" error={errors.category?.message} required>
          <Select id="drink-category" invalid={Boolean(errors.category)} {...register('category')}>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Price" htmlFor="drink-price" error={errors.price?.message} required>
          <Input
            id="drink-price"
            type="number"
            step="0.01"
            min="0"
            invalid={Boolean(errors.price)}
            {...register('price', { valueAsNumber: true })}
          />
        </Field>
        <DrinkImagePicker
          id="drink-image"
          name={drink?.name ?? 'Drink'}
          imageUrl={drink?.image_url}
          file={imageFile}
          onChange={setImageFile}
        />
      </form>
    </Modal>
  );
}
