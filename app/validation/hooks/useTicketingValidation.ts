import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import {
  newTicketSchema,
  replyMessageSchema,
  ticketFiltersSchema,
  getNewTicketDefaultValues,
  getReplyMessageDefaultValues,
  getTicketFiltersDefaultValues,
  type NewTicketFormData,
  type ReplyMessageFormData,
  type TicketFiltersFormData,
} from '../schemas/ticketingSchema';

/**
 * Custom hook for new ticket form validation
 */
export const useNewTicketValidation = () => {
  const defaultValues = useMemo(() => getNewTicketDefaultValues(), []);

  const form = useForm<NewTicketFormData>({
    resolver: yupResolver(newTicketSchema) as any,
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  // More accurate validation check
  const isFormValid = form.formState.isValid && 
    !form.formState.isSubmitting &&
    form.formState.isDirty;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return {
    ...form,
    isFormValid,
    hasErrors,
  };
};

/**
 * Custom hook for reply message form validation
 */
export const useReplyMessageValidation = () => {
  const defaultValues = useMemo(() => getReplyMessageDefaultValues(), []);

  const form = useForm<ReplyMessageFormData>({
    resolver: yupResolver(replyMessageSchema) as any,
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
 * Custom hook for ticket filters form validation
 */
export const useTicketFiltersValidation = () => {
  const defaultValues = useMemo(() => getTicketFiltersDefaultValues(), []);

  const form = useForm<TicketFiltersFormData>({
    resolver: yupResolver(ticketFiltersSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  return {
    ...form,
  };
};