import * as yup from 'yup';
import { UNITS } from '@/lib/constants';
import type { Unit } from '@/types/domain';

export const ingredientSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Ingredient name is required')
    .min(2, 'Use at least 2 characters')
    .max(80, 'Keep the name under 80 characters'),
  category: yup.string().trim().required('Choose a category'),
  unit: yup
    .mixed<Unit>()
    .oneOf(UNITS, 'Choose a valid unit')
    .required('Choose a unit'),
  current_stock: yup
    .number()
    .typeError('Enter a number')
    .min(0, 'Stock cannot be negative')
    .required('Current stock is required')
    .default(0),
  reorder_level: yup
    .number()
    .typeError('Enter a number')
    .min(0, 'Reorder level cannot be negative')
    .required('Reorder level is required')
    .default(0),
  cost_per_unit: yup
    .number()
    .typeError('Enter a number')
    .min(0, 'Cost cannot be negative')
    .required('Cost per unit is required')
    .default(0),
  supplier: yup
    .string()
    .trim()
    .max(120, 'Keep the supplier under 120 characters')
    .default(''),
});

export type IngredientFormValues = yup.InferType<typeof ingredientSchema>;
