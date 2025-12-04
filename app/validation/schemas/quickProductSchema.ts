import * as yup from 'yup';
import type { ICategoryList } from '~/types/interfaces/categories.interface';

/**
 * Validation messages in Persian
 */
const messages = {
  required: 'این فیلد الزامی است',
  string: 'مقدار وارد شده باید متن باشد',
  min: 'حداقل ${min} کاراکتر وارد کنید',
  max: 'حداکثر ${max} کاراکتر مجاز است',
  minLength: (min: number) => `حداقل ${min} کاراکتر وارد کنید`,
  array: {
    min: (min: number) => `حداقل ${min} مورد انتخاب کنید`,
  },
};

/**
 * Quick Product form validation schema
 */
export const quickProductSchema = yup.object({
  title: yup
    .string()
    .required(messages.required)
    .min(3, messages.minLength(3))
    .max(100, 'حداکثر 100 کاراکتر مجاز است')
    .trim(),

  description: yup
    .string()
    .required(messages.required)
    .min(100, messages.minLength(100))
    .max(1000, 'حداکثر 1000 کاراکتر مجاز است')
    .trim(),

  selectedCategory: yup
    .object()
    .nullable()
    .required('انتخاب دسته‌بندی الزامی است')
    .test('is-category', 'دسته‌بندی معتبر انتخاب کنید', (value) => {
      return value && typeof value === 'object' && 'id' in value;
    }),

  images: yup
    .array()
    .of(yup.number().required())
    .min(1, messages.array.min(1))
    .required('انتخاب حداقل یک تصویر الزامی است'),
});

/**
 * Type for quick product form data
 */
export type QuickProductFormData = {
  title: string;
  description: string;
  selectedCategory: ICategoryList | null;
  images: number[];
};

/**
 * Default values for quick product form
 */
export const getQuickProductDefaultValues = (): QuickProductFormData => ({
  title: '',
  description: '',
  selectedCategory: null,
  images: [],
});