import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { 
  quickProductSchema, 
  getQuickProductDefaultValues, 
  type QuickProductFormData 
} from '../schemas/quickProductSchema';

/**
 * Custom hook for quick product form validation using react-hook-form and yup
 */
export const useQuickProductValidation = (
  initialValues?: Partial<QuickProductFormData>
) => {
  const defaultValues = {
    ...getQuickProductDefaultValues(),
    ...initialValues,
  };

  const form = useForm<QuickProductFormData>({
    resolver: yupResolver(quickProductSchema),
    defaultValues,
    mode: 'onChange', // Validate on change for real-time feedback
  });

  // Watch all form values for validation state
  const formValues = form.watch();
  
  // Check if form is valid
  const isFormValid = form.formState.isValid && Object.keys(form.formState.errors).length === 0;

  return {
    form,
    formValues,
    isFormValid,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
  };
};