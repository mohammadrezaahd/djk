import * as yup from 'yup';

/**
 * Validation schema for template creation (only title and description)
 * This is used in template pages where we only care about template metadata,
 * not the actual field validations
 */
export const templateCreationSchema = yup.object({
  title: yup
    .string()
    .required('عنوان قالب الزامی است')
    .min(3, 'عنوان قالب باید حداقل 3 کاراکتر باشد')
    .max(20, 'عنوان قالب باید حداکثر 20 کاراکتر باشد'),
  description: yup
    .string()
    .max(1000, 'توضیحات باید حداکثر 1000 کاراکتر باشد'),
});

/**
 * Type for template creation form data
 */
export type TemplateCreationFormData = {
  title: string;
  description?: string;
};

/**
 * Get default values for template creation
 */
export const getTemplateCreationDefaultValues = (
  currentFormData: { [key: string]: any } = {}
): TemplateCreationFormData => {
  return {
    title: currentFormData.title ?? '',
    description: currentFormData.description ?? '',
  };
};