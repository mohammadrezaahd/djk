import * as yup from 'yup';

/**
 * Validation messages in Persian
 */
const messages = {
  required: 'این فیلد الزامی است',
  string: 'مقدار وارد شده باید متن باشد',
  min: 'حداقل ${min} کاراکتر وارد کنید',
  max: 'حداکثر ${max} کاراکتر مجاز است',
  file: 'فایل انتخاب شده معتبر نیست',
  fileSize: 'حجم فایل نباید بیشتر از 5 مگابایت باشد',
  fileType: 'فقط فرمت‌های تصویری مجاز هستند',
};

/**
 * Allowed image types and extensions
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

/**
 * Gallery/Image upload form validation schema
 */
export const galleryFormSchema = yup.object({
  title: yup
    .string()
    .when('multipleUpload', {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema
        .required(messages.required)
        .min(3, 'عنوان تصویر باید حداقل 3 کاراکتر باشد')
        .max(100, 'عنوان تصویر باید حداکثر 100 کاراکتر باشد'),
    }),
  
  type: yup
    .string()
    .oneOf(['packaging', 'product', 'none'], 'نوع تصویر انتخاب شده معتبر نیست')
    .required(messages.required),
  
  multipleUpload: yup
    .boolean()
    .optional(),
  
  file: yup
    .mixed<File | File[]>()
    .nullable()
    .test('fileRequired', 'انتخاب فایل الزامی است', function(value) {
      return !!value;
    })
    .test('fileSize', messages.fileSize, (value) => {
      if (!value) return true;
      
      const files = Array.isArray(value) ? value : [value];
      // 5MB limit per file
      return files.every(file => file.size <= 5 * 1024 * 1024);
    })
    .test('fileType', messages.fileType, (value) => {
      if (!value) return true;
      
      const files = Array.isArray(value) ? value : [value];
      
      return files.every(file => {
        // Check MIME type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          return false;
        }
        
        // Check file extension
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return ALLOWED_EXTENSIONS.includes(extension);
      });
    })
    .test('fileCount', 'حداکثر 10 فایل مجاز است', (value) => {
      if (!value) return true;
      
      const files = Array.isArray(value) ? value : [value];
      return files.length <= 10;
    }),
});

/**
 * Schema for edit mode where file is optional
 */
export const galleryEditFormSchema = yup.object({
  title: yup
    .string()
    .when('multipleUpload', {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema
        .required(messages.required)
        .min(3, 'عنوان تصویر باید حداقل 3 کاراکتر باشد')
        .max(100, 'عنوان تصویر باید حداکثر 100 کاراکتر باشد'),
    }),
  
  type: yup
    .string()
    .oneOf(['packaging', 'product', 'none'], 'نوع تصویر انتخاب شده معتبر نیست')
    .required(messages.required),
  
  multipleUpload: yup
    .boolean()
    .optional(),
  
  file: yup
    .mixed<File | File[]>()
    .nullable()
    .test('fileSize', messages.fileSize, (value) => {
      if (!value) return true; // Allow null/undefined for edit mode
      
      const files = Array.isArray(value) ? value : [value];
      // 5MB limit per file
      return files.every(file => file.size <= 5 * 1024 * 1024);
    })
    .test('fileType', messages.fileType, (value) => {
      if (!value) return true; // Allow null/undefined for edit mode
      
      const files = Array.isArray(value) ? value : [value];
      
      return files.every(file => {
        // Check MIME type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          return false;
        }
        
        // Check file extension
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return ALLOWED_EXTENSIONS.includes(extension);
      });
    })
    .test('fileCount', 'حداکثر 10 فایل مجاز است', (value) => {
      if (!value) return true;
      
      const files = Array.isArray(value) ? value : [value];
      return files.length <= 10;
    }),
});

/**
 * Type for gallery form data
 */
export type GalleryFormData = {
  title: string;
  type: 'packaging' | 'product' | 'none';
  file: File | File[] | null;
  multipleUpload?: boolean;
};

/**
 * Get default values for gallery form
 */
export const getGalleryDefaultValues = (): GalleryFormData => {
  return {
    title: '',
    type: 'none',
    file: null,
    multipleUpload: false,
  };
};

/**
 * Convert form data to API format
 */
export const convertGalleryFormToApi = (formData: GalleryFormData) => {
  return {
    title: formData.multipleUpload ? '' : formData.title.trim(),
    packaging: formData.type === 'packaging',
    product: formData.type === 'product',
    source: 'app' as any,
    tag: 'upload',
    file: formData.file as File | File[],
    multipleUpload: formData.multipleUpload || false,
  };
};