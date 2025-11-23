import * as yup from 'yup';
import { TicketPriority } from '~/types/dtos/ticketing.dto';

// Schema for creating a new ticket
export const newTicketSchema = yup.object({
  subject: yup
    .string()
    .required('موضوع تیکت الزامی است')
    .min(3, 'موضوع باید حداقل ۳ کاراکتر باشد')
    .max(200, 'موضوع نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد'),
  department_id: yup
    .number()
    .required('انتخاب دپارتمان الزامی است')
    .min(1, 'دپارتمان معتبری انتخاب کنید'),
  priority: yup
    .number()
    .required('انتخاب اولویت الزامی است')
    .oneOf(
      [TicketPriority.HIGH, TicketPriority.MEDIUM, TicketPriority.LOW],
      'اولویت معتبری انتخاب کنید'
    ),
  first_message: yup
    .string()
    .required('متن پیام اولیه الزامی است')
    .min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد')
    .max(2000, 'پیام نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد'),
  files: yup
    .array()
    .of(yup.mixed<File>())
    .optional()
    .max(5, 'حداکثر ۵ فایل می‌توانید آپلود کنید'),
});

// Schema for sending a reply message
export const replyMessageSchema = yup.object({
  message: yup
    .string()
    .required('متن پیام الزامی است')
    .min(1, 'پیام نمی‌تواند خالی باشد')
    .max(2000, 'پیام نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد'),
  files: yup
    .array()
    .of(yup.mixed<File>())
    .optional()
    .max(5, 'حداکثر ۵ فایل می‌توانید آپلود کنید'),
});

// Schema for ticket list filters
export const ticketFiltersSchema = yup.object({
  search: yup.string().optional(),
  status_filter: yup.string().optional(),
  department_id: yup.number().optional(),
});

// Type definitions
export type NewTicketFormData = yup.InferType<typeof newTicketSchema>;
export type ReplyMessageFormData = yup.InferType<typeof replyMessageSchema>;
export type TicketFiltersFormData = yup.InferType<typeof ticketFiltersSchema>;

// Default values
export const getNewTicketDefaultValues = (): NewTicketFormData => ({
  subject: '',
  department_id: undefined as any, // Will be set when departments load
  priority: TicketPriority.MEDIUM,
  first_message: '',
  files: [],
});

export const getReplyMessageDefaultValues = (): ReplyMessageFormData => ({
  message: '',
  files: [],
});

export const getTicketFiltersDefaultValues = (): TicketFiltersFormData => ({
  search: '',
  status_filter: '',
  department_id: 0,
});