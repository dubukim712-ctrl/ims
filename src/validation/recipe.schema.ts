import * as yup from 'yup';

export const recipeSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Drink name is required')
    .min(2, 'Use at least 2 characters')
    .max(80, 'Keep the name under 80 characters'),
  category: yup.string().trim().required('Choose a category'),
  price: yup
    .number()
    .typeError('Enter a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required')
    .default(0),
  items: yup
    .array()
    .of(
      yup.object({
        ingredient_id: yup.string().required('Choose an ingredient'),
        quantity: yup
          .number()
          .typeError('Enter a quantity')
          .positive('Quantity must be greater than zero')
          .required('Quantity is required'),
      }),
    )
    .min(1, 'Add at least one recipe ingredient')
    .required('Add at least one recipe ingredient')
    .test('unique-ingredients', 'Each ingredient can appear only once', (items) => {
      if (!items) return true;
      const ids = items.map((item) => item.ingredient_id).filter(Boolean);
      return new Set(ids).size === ids.length;
    }),
});

export type RecipeFormValues = yup.InferType<typeof recipeSchema>;
