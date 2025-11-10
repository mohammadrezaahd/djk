import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import type { ICategoryDetails } from '~/types/interfaces/details.interface';
import { 
  createDetailsFormSchema, 
  getDetailsDefaultValues, 
  type DetailsFormData 
} from '../schemas/detailsSchema';

/**
 * Custom hook for details form validation using react-hook-form and yup
 * @param detailsData - The details data
 * @param currentFormData - Current form data
 * @param isProductCreation - If true, validates all fields. If false, only title/description
 */
export const useDetailsValidation = (
  detailsData: ICategoryDetails | null,
  currentFormData: { [key: string]: any } = {},
  isProductCreation: boolean = false
) => {
  // Get default values
  const defaultValues = useMemo(() => {
    return getDetailsDefaultValues(detailsData, currentFormData);
  }, [detailsData, currentFormData]);

  // Validation schema
  const validationSchema = useMemo(() => {
    return createDetailsFormSchema(detailsData, isProductCreation);
  }, [detailsData, isProductCreation]);

  // Initialize react-hook-form
  const form = useForm<DetailsFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
    mode: 'onChange', // Validate on change for immediate feedback
  });

  // Reset form only when details data structure changes (not when form values change)
  // We use a ref to track if this is the initial load
  useEffect(() => {
    // Only reset on initial load or when detailsData changes
    // Don't reset when currentFormData changes (user is typing)
    const newDefaults = getDetailsDefaultValues(detailsData, currentFormData);
    form.reset(newDefaults);
  }, [detailsData]); // Only depend on detailsData, not currentFormData

  // Check form validity
  const isFormValid = form.formState.isValid && !form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return {
    ...form,
    isFormValid,
    hasErrors,
  };
};

/**
 * Hook to get field validation info for a specific field
 */
export const useDetailsFieldValidation = (
  form: UseFormReturn<DetailsFormData>,
  fieldName: string
) => {
  const fieldError = form.formState.errors[fieldName as keyof DetailsFormData];
  const fieldValue = form.watch(fieldName as keyof DetailsFormData);
  
  return {
    error: fieldError,
    hasError: !!fieldError,
    errorMessage: fieldError?.message,
    value: fieldValue,
    isDirty: form.formState.dirtyFields[fieldName as keyof DetailsFormData] || false,
    isTouched: form.formState.touchedFields[fieldName as keyof DetailsFormData] || false,
  };
};