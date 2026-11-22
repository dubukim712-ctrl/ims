import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useIngredients } from '@/hooks/useIngredients';
import { useSaveRecipe } from '@/hooks/useRecipes';
import { DRINK_CATEGORIES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errors';
import { formatMoney } from '@/lib/format';
import { recipeSchema, type RecipeFormValues } from '@/validation/recipe.schema';
import type { DrinkWithRecipe } from '@/types/domain';

interface RecipeFormModalProps {
  open: boolean;
  onClose: () => void;
  drink?: DrinkWithRecipe | null;
  drinks: DrinkWithRecipe[];
}

export function RecipeFormModal({ open, onClose, drink, drinks }: RecipeFormModalProps) {
  const saveMutation = useSaveRecipe();
  const ingredientsQuery = useIngredients();
  const ingredients = ingredientsQuery.data ?? [];
  const isEdit = Boolean(drink);
  const [selectedDrinkId, setSelectedDrinkId] = useState(
    drink?.id ?? drinks.find((item) => item.recipe_items.length === 0)?.id ?? drinks[0]?.id ?? '',
  );

  const categoryOptions = useMemo(() => {
    const values = new Set(DRINK_CATEGORIES);
    if (drink?.category) values.add(drink.category);
    return [...values];
  }, [drink?.category]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      name: drink?.name ?? '',
      category: drink?.category ?? DRINK_CATEGORIES[0],
      price: drink?.price ?? 0,
      items: drink?.recipe_items.map((item) => ({
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
      })) ?? [{ ingredient_id: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const selectedDrink = drinks.find((item) => item.id === selectedDrinkId) ?? null;

  useEffect(() => {
    if (isEdit || !selectedDrink) return;
    setValue('name', selectedDrink.name);
    setValue('category', selectedDrink.category);
    setValue('price', selectedDrink.price);
  }, [isEdit, selectedDrink, setValue]);

  const onSubmit = async (values: RecipeFormValues) => {
    try {
      await saveMutation.mutateAsync({
        drink_id: drink?.id ?? selectedDrinkId,
        name: values.name,
        category: values.category,
        price: values.price,
        items: values.items,
      });
      toast.success(drink ? `${values.name} recipe updated` : `${values.name} recipe added`);
      onClose();
    } catch (error) {
      toast.error('Could not save recipe', { description: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit recipe' : 'Add recipe'}
      description={
        isEdit
          ? 'Update the drink details and ingredient quantities per cup.'
          : 'Create a drink and define its ingredients per cup.'
      }
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saveMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" form="recipe-form" loading={saveMutation.isPending}>
            {isEdit ? 'Save changes' : 'Add recipe'}
          </Button>
        </div>
      }
    >
      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isEdit ? (
          <Field
            label="Drink"
            htmlFor="recipe-drink"
            hint="Add a drink first if it is not in this list."
            required
          >
            <Select
              id="recipe-drink"
              value={selectedDrinkId}
              onChange={(event) => setSelectedDrinkId(event.target.value)}
            >
              {drinks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.category} — {formatMoney(item.price)}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        {isEdit ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Drink name" htmlFor="recipe-name" error={errors.name?.message} required>
                <Input
                  id="recipe-name"
                  placeholder="e.g. Iced Vanilla Latte"
                  invalid={Boolean(errors.name)}
                  {...register('name')}
                />
              </Field>

              <Field
                label="Category"
                htmlFor="recipe-category"
                error={errors.category?.message}
                required
              >
                <Select
                  id="recipe-category"
                  invalid={Boolean(errors.category)}
                  {...register('category')}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field
              label="Price"
              htmlFor="recipe-price"
              error={errors.price?.message}
              hint="Selling price per cup."
              required
            >
              <Input
                id="recipe-price"
                type="number"
                step="0.01"
                min="0"
                invalid={Boolean(errors.price)}
                {...register('price', { valueAsNumber: true })}
              />
            </Field>
          </>
        ) : null}

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-espresso-700">
              Ingredients <span className="text-berry-500">*</span>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ ingredient_id: '', quantity: 1 })}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add ingredient
            </Button>
          </div>

          {ingredientsQuery.isLoading ? (
            <p className="mt-3 text-xs text-espresso-300">Loading ingredients…</p>
          ) : ingredientsQuery.isError ? (
            <p className="mt-3 text-xs font-medium text-berry-700">
              Could not load ingredients: {getErrorMessage(ingredientsQuery.error)}
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {fields.map((field, index) => {
                const quantityError = errors.items?.[index]?.quantity?.message;
                return (
                  <div key={field.id} className="grid grid-cols-[minmax(0,1fr)_120px_40px] gap-2">
                    <Select
                      aria-label={`Ingredient ${index + 1}`}
                      invalid={Boolean(errors.items?.[index]?.ingredient_id)}
                      {...register(`items.${index}.ingredient_id`)}
                    >
                      <option value="">Choose ingredient</option>
                      {ingredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </option>
                      ))}
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      aria-label={`Quantity ${index + 1}`}
                      placeholder="Qty"
                      invalid={Boolean(quantityError)}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ingredient ${index + 1}`}
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {errors.items?.message ? (
            <p role="alert" className="mt-2 text-xs font-medium text-berry-700">
              {errors.items.message}
            </p>
          ) : errors.items?.root?.message ? (
            <p role="alert" className="mt-2 text-xs font-medium text-berry-700">
              {errors.items.root.message}
            </p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
