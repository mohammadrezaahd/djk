import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import {
  registerFormSchema,
  phoneSchema,
  passwordLoginSchema,
  getRegisterDefaultValues,
  getPhoneDefaultValues,
  getPasswordLoginDefaultValues,
  type RegisterFormData,
  type PhoneFormData,
  type PasswordLoginFormData,
} from '../schemas/authSchema';

/**
 * Custom hook for register form validation
 */
export const useRegisterValidation = () => {
  const defaultValues = useMemo(() => getRegisterDefaultValues(), []);

  const form = useForm<RegisterFormData>({
    resolver: yupResolver(registerFormSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const isFormValid = form.formState.isValid && !form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return {
    ...form,
    isFormValid,
    hasErrors,
  };
};

/**
 * Custom hook for phone form validation
 */
export const usePhoneValidation = (initialPhone: string = '') => {
  const defaultValues = useMemo(() => ({
    phone: initialPhone,
  }), [initialPhone]);

  const form = useForm<PhoneFormData>({
    resolver: yupResolver(phoneSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const isFormValid = form.formState.isValid && !form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return {
    ...form,
    isFormValid,
    hasErrors,
  };
};

/**
 * Custom hook for password login form validation
 */
export const usePasswordLoginValidation = (initialPhone: string = '') => {
  const defaultValues = useMemo(() => ({
    ...getPasswordLoginDefaultValues(),
    phone: initialPhone,
  }), [initialPhone]);

  const form = useForm<PasswordLoginFormData>({
    resolver: yupResolver(passwordLoginSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const isFormValid = form.formState.isValid && !form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return {
    ...form,
    isFormValid,
    hasErrors,
  };
};
