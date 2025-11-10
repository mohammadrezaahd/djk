import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import type { ICategoryAttr } from '~/types/interfaces/attributes.interface';
import { 
  createAttributesFormSchema, 
  getAttributesDefaultValues, 
  type AttributesFormData 
} from '../schemas/attributesSchema';

/**
 * Custom hook for attributes form validation using react-hook-form and yup
 * @param attributesData - The attributes data
 * @param currentFormData - Current form data
 * @param title - Title from store
 * @param description - Description from store
 * @param isProductCreation - If true, validates all fields. If false, only title/description
 */
export const useAttributesValidation = (
  attributesData: ICategoryAttr | null,
  currentFormData: { [key: string]: any } = {},
  title: string = '',
  description: string = '',
  isProductCreation: boolean = false
) => {
  // Get default values
  const defaultValues = useMemo(() => {
    const defaults = getAttributesDefaultValues(attributesData, currentFormData);
    // Override with current title and description from store
    defaults.title = title;
    defaults.description = description;
    return defaults;
  }, [attributesData, currentFormData, title, description]);

  // Create validation schema based on current attributes data
  const validationSchema = useMemo(() => {
    return createAttributesFormSchema(attributesData, isProductCreation);
  }, [attributesData, isProductCreation]);

  // Initialize react-hook-form
  const form = useForm<AttributesFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
    mode: 'onChange', // Validate on change for immediate feedback
  });

  // Reset form only when attributes data structure changes (not when form values change)
  useEffect(() => {
    const newDefaults = getAttributesDefaultValues(attributesData, currentFormData);
    newDefaults.title = title;
    newDefaults.description = description;
    form.reset(newDefaults);
  }, [attributesData]); // Only depend on attributesData structure, not form values

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
 * Hook to get field validation info for a specific attribute
 */
export const useAttributeFieldValidation = (
  form: UseFormReturn<AttributesFormData>,
  fieldId: string | number
) => {
  const fieldKey = fieldId.toString();
  const fieldError = form.formState.errors[fieldKey];
  const fieldValue = form.watch(fieldKey);
  
  return {
    error: fieldError,
    hasError: !!fieldError,
    errorMessage: fieldError?.message,
    value: fieldValue,
    isDirty: form.formState.dirtyFields[fieldKey] || false,
    isTouched: form.formState.touchedFields[fieldKey] || false,
  };
};