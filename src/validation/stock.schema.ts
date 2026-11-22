import * as yup from 'yup';

export const stockInSchema = yup.object({
  ingredient_id: yup.string().required('Choose an ingredient'),
  quantity: yup
    .number()
    .typeError('Enter a quantity')
    .positive('Quantity must be greater than zero')
    .max(1_000_000, 'That quantity looks too large')
    .required('Quantity is required'),
  supplier: yup
    .string()
    .trim()
    .max(120, 'Keep the supplier under 120 characters')
    .default(''),
  note: yup
    .string()
    .trim()
    .max(300, 'Keep the note under 300 characters')
    .default(''),
});

export type StockInFormValues = yup.InferType<typeof stockInSchema>;
