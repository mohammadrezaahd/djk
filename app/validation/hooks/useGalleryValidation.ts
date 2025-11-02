import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { 
  galleryFormSchema, 
  getGalleryDefaultValues,
  type GalleryFormData 
} from '../schemas/gallerySchema';

/**
 * Custom hook for gallery/image upload form validation using react-hook-form and yup
 */
export const useGalleryValidation = (allowedType?: 'packaging' | 'product' | 'none') => {
  // Get default values
  const defaultValues = getGalleryDefaultValues();
  
  // Set default type if provided
  if (allowedType && allowedType !== 'none') {
    defaultValues.type = allowedType;
  }

  // Initialize react-hook-form
  const form = useForm<GalleryFormData>({
    resolver: yupResolver(galleryFormSchema) as any,
    defaultValues,
    mode: 'onChange', // Validate on change for immediate feedback
  });

  // Update type when allowedType prop changes
  useEffect(() => {
    if (allowedType && allowedType !== 'none') {
      form.setValue('type', allowedType, { shouldValidate: true });
    }
  }, [allowedType, form]);

  // Check form validity
  const isFormValid = form.formState.isValid && !form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  // Helper to reset form
  const resetForm = () => {
    const newDefaults = getGalleryDefaultValues();
    if (allowedType && allowedType !== 'none') {
      newDefaults.type = allowedType;
    }
    form.reset(newDefaults);
  };

  return {
    ...form,
    isFormValid,
    hasErrors,
    resetForm,
  };
};

/**
 * Hook to get field validation info for a specific field
 */
export const useGalleryFieldValidation = (
  form: ReturnType<typeof useGalleryValidation>,
  fieldName: keyof GalleryFormData
) => {
  const fieldError = form.formState.errors[fieldName];
  const fieldValue = form.watch(fieldName);
  
  return {
    error: fieldError,
    hasError: !!fieldError,
    errorMessage: fieldError?.message,
    value: fieldValue,
    isDirty: form.formState.dirtyFields[fieldName] || false,
    isTouched: form.formState.touchedFields[fieldName] || false,
  };
};