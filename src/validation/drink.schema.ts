import * as yup from 'yup';

export const drinkSchema = yup.object({
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
});

export type DrinkFormValues = yup.InferType<typeof drinkSchema>;
