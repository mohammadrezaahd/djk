import * as yup from 'yup';

/**
 * Validation messages in Persian
 */
const messages = {
  required: 'این فیلد الزامی است',
  string: 'مقدار وارد شده باید متن باشد',
  min: 'حداقل ${min} کاراکتر وارد کنید',
  max: 'حداکثر ${max} کاراکتر مجاز است',
  email: 'فرمت ایمیل صحیح نیست',
  password: {
    min: 'رمز عبور باید حداقل 8 کاراکتر باشد',
    uppercase: 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد',
    lowercase: 'رمز عبور باید حداقل یک حرف کوچک داشته باشد',
    number: 'رمز عبور باید حداقل یک عدد داشته باشد',
    special: 'رمز عبور باید حداقل یک کاراکتر خاص داشته باشد (!@#$%^&*)',
  },
};

/**
 * Register form validation schema
 */
export const registerFormSchema = yup.object({
  first_name: yup
    .string()
    .required(messages.required)
    .min(2, 'نام باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام باید حداکثر 50 کاراکتر باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'نام فقط باید شامل حروف باشد'),

  last_name: yup
    .string()
    .required(messages.required)
    .min(2, 'نام خانوادگی باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام خانوادگی باید حداکثر 50 کاراکتر باشد')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'نام خانوادگی فقط باید شامل حروف باشد'),

  email: yup
    .string()
    .required(messages.required)
    .email(messages.email)
    .max(100, 'ایمیل باید حداکثر 100 کاراکتر باشد'),

  password: yup
    .string()
    .required(messages.required)
    .min(8, messages.password.min)
    .test('has-uppercase', messages.password.uppercase, (value) => {
      if (!value) return false;
      return /[A-Z]/.test(value);
    })
    .test('has-lowercase', messages.password.lowercase, (value) => {
      if (!value) return false;
      return /[a-z]/.test(value);
    })
    .test('has-number', messages.password.number, (value) => {
      if (!value) return false;
      return /[0-9]/.test(value);
    })
    .test('has-special', messages.password.special, (value) => {
      if (!value) return false;
      return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    }),
});

/**
 * Phone validation schema
 */
export const phoneSchema = yup.object({
  phone: yup
    .string()
    .required(messages.required)
    .matches(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
});

/**
 * Password login validation schema
 */
export const passwordLoginSchema = yup.object({
  phone: yup
    .string()
    .required(messages.required)
    .matches(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  
  password: yup
    .string()
    .required(messages.required)
    .min(3, 'رمز عبور باید حداقل 3 کاراکتر باشد'),
});

/**
 * Type for register form data
 */
export type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

/**
 * Type for phone form data
 */
export type PhoneFormData = {
  phone: string;
};

/**
 * Type for password login form data
 */
export type PasswordLoginFormData = {
  phone: string;
  password: string;
};

/**
 * Get default values for register form
 */
export const getRegisterDefaultValues = (): RegisterFormData => ({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
});

/**
 * Get default values for phone form
 */
export const getPhoneDefaultValues = (): PhoneFormData => ({
  phone: '',
});

/**
 * Get default values for password login form
 */
export const getPasswordLoginDefaultValues = (): PasswordLoginFormData => ({
  phone: '',
  password: '',
});
