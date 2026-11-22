import * as yup from 'yup';

const cupsItemSchema = yup.object({
  drink_id: yup.string().required(),
  cups_sold: yup
    .number()
    .typeError('Enter a number')
    .integer('Use whole cups')
    .min(0, 'Cups cannot be negative')
    .max(500, 'Maximum 500 cups per drink')
    .required()
    .default(0),
});

export const cupsSoldSchema = yup.object({
  items: yup
    .array()
    .of(cupsItemSchema)
    .required()
    .min(1, 'No drinks are available to log')
    .test(
      'at-least-one-cup',
      'Enter cups sold for at least one drink',
      (items) => (items ?? []).some((item) => Number(item?.cups_sold) > 0),
    ),
});

export type CupsSoldFormValues = yup.InferType<typeof cupsSoldSchema>;

export const spoilageSchema = yup.object({
  ingredient_id: yup.string().required('Choose an ingredient'),
  quantity: yup
    .number()
    .typeError('Enter a quantity')
    .required('Quantity is required')
    .test('not-zero', 'Quantity cannot be zero', (value) => Number(value) !== 0),
  note: yup
    .string()
    .trim()
    .required('Add a short reason')
    .min(3, 'Add a little more detail')
    .max(300, 'Keep the reason under 300 characters'),
});

export type SpoilageFormValues = yup.InferType<typeof spoilageSchema>;
