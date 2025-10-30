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
 */
export const useDetailsValidation = (
  detailsData: ICategoryDetails | null,
  currentFormData: { [key: string]: any } = {}
) => {
  // Get default values
  const defaultValues = useMemo(() => {
    return getDetailsDefaultValues(detailsData, currentFormData);
  }, [detailsData, currentFormData]);

  // Validation schema
  const validationSchema = useMemo(() => {
    return createDetailsFormSchema(detailsData);
  }, [detailsData]);

  // Initialize react-hook-form
  const form = useForm<DetailsFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
    mode: 'onChange', // Validate on change for immediate feedback
  });

  // Reset form when details data changes
  useEffect(() => {
    const newDefaults = getDetailsDefaultValues(detailsData, currentFormData);
    form.reset(newDefaults);
  }, [detailsData, currentFormData, form]);

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