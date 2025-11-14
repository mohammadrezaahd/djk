import * as yup from 'yup';
import type { ICategoryAttr, IAttr } from '~/types/interfaces/attributes.interface';
import { AttributeType } from '~/types/interfaces/attributes.interface';

/**
 * Validation messages in Persian
 */
const messages = {
  required: 'این فیلد الزامی است',
  string: 'مقدار وارد شده باید متن باشد',
  number: 'مقدار وارد شده باید عدد باشد',
  array: 'مقدار وارد شده باید آرایه باشد',
  min: 'حداقل ${min} کاراکتر وارد کنید',
  max: 'حداکثر ${max} کاراکتر مجاز است',
  positiveNumber: 'عدد باید مثبت باشد',
  invalidOption: 'گزینه انتخاب شده معتبر نیست',
  invalidOptions: 'یک یا چند گزینه انتخاب شده معتبر نیست',
};

/**
 * Create validation rule for a single select attribute
 */
const createSelectValidation = (attr: IAttr) => {
  const validOptions = Object.keys(attr.values);
  
  let validation = yup.string();
  
  if (attr.required) {
    validation = validation.required(messages.required);
  }
  
  // Validate that selected value exists in the valid options
  validation = validation.test(
    'valid-option',
    messages.invalidOption,
    function(value) {
      if (!value && !attr.required) return true; // Optional field can be empty
      if (!value && attr.required) return false; // Required field cannot be empty
      return value ? validOptions.includes(value) : false;
    }
  );
  
  return validation;
};

/**
 * Create validation rule for a multi-select (checkbox) attribute
 */
const createCheckboxValidation = (attr: IAttr) => {
  const validOptions = Object.keys(attr.values);
  
  let validation = yup.array().of(yup.string());
  
  if (attr.required) {
    validation = validation.min(1, messages.required);
  }
  
  // Validate that all selected values exist in the valid options
  validation = validation.test(
    'valid-options',
    messages.invalidOptions,
    function(value) {
      if (!value || value.length === 0) {
        return !attr.required; // Empty is OK if not required
      }
      return value.every((val: any) => typeof val === 'string' && validOptions.includes(val));
    }
  );
  
  return validation;
};

/**
 * Create validation rule for input/text attributes
 */
const createInputValidation = (attr: IAttr) => {
  let validation: yup.StringSchema | yup.NumberSchema;
  
  if (attr.type === AttributeType.Input) {
    // Numeric input
    validation = yup.number().typeError('مقدار وارد شده باید عدد باشد');
    
    if (attr.required) {
      validation = validation.required(messages.required);
    }
    
    // Enforce non-negative number (>= 0)
    validation = validation.min(0, 'عدد باید صفر یا بزرگتر باشد');
  } else {
    // Text input
    validation = yup.string();
    
    if (attr.required) {
      validation = validation.required(messages.required);
      validation = validation.min(3, messages.min);
    }
    
    // Add length validations if needed
    validation = validation.max(5000, messages.max);
  }
  
  return validation;
};

/**
 * Base attributes form schema (title and description)
 */
export const baseAttributesSchema = yup.object({
  title: yup
    .string()
    .required(messages.required)
    .min(3, 'عنوان قالب باید حداقل 3 کاراکتر باشد')
    .max(20, 'عنوان قالب باید حداکثر 20 کاراکتر باشد'),
  description: yup
    .string()
    .max(1000, 'توضیحات باید حداکثر 1000 کاراکتر باشد'),
});

/**
 * Generate dynamic validation schema based on attributes data
 * @param attributesData - The attributes data to create validation for
 * @param isProductCreation - If true, includes all field validations. If false, only title/description
 */
export const createAttributesFormSchema = (
  attributesData: ICategoryAttr | null,
  isProductCreation: boolean = false
) => {
  if (!attributesData?.category_group_attributes || !isProductCreation) {
    return baseAttributesSchema;
  }

  const dynamicFields: { [key: string]: any } = {};

  // Extract all attributes from category groups
  Object.values(attributesData.category_group_attributes).forEach((categoryData) => {
    Object.values(categoryData.attributes).forEach((attr) => {
      // Skip specific attribute (as per original code)
      if (attr.id === 2233) return;
      
      const fieldKey = attr.id.toString();
      
      switch (attr.type) {
        case AttributeType.Select:
          dynamicFields[fieldKey] = createSelectValidation(attr);
          break;
          
        case AttributeType.Checkbox:
          dynamicFields[fieldKey] = createCheckboxValidation(attr);
          break;
          
        case AttributeType.Input:
        case AttributeType.Text:
        case AttributeType.MultiText:
          dynamicFields[fieldKey] = createInputValidation(attr);
          break;
          
        default:
          // Default to string validation for unknown types
          if (attr.required) {
            dynamicFields[fieldKey] = yup.string().required(messages.required);
          } else {
            dynamicFields[fieldKey] = yup.string();
          }
      }
    });
  });

  return baseAttributesSchema.shape(dynamicFields);
};

/**
 * Type for attributes form data
 */
export type AttributesFormData = {
  title: string;
  description?: string;
  [key: string]: any; // Dynamic attribute fields
};

/**
 * Get default values for attributes form
 */
export const getAttributesDefaultValues = (
  attributesData: ICategoryAttr | null,
  currentFormData: { [key: string]: any } = {}
): AttributesFormData => {
  const defaultValues: AttributesFormData = {
    title: currentFormData.title ?? '',
    description: currentFormData.description ?? '',
  };

  if (!attributesData?.category_group_attributes) {
    return defaultValues;
  }

  // Set default values from current form data or attribute defaults
  Object.values(attributesData.category_group_attributes).forEach((categoryData) => {
    Object.values(categoryData.attributes).forEach((attr) => {
      if (attr.id === 2233) return;
      
      const fieldKey = attr.id.toString();
      const currentValue = currentFormData[fieldKey];
      
      if (currentValue !== undefined) {
        defaultValues[fieldKey] = currentValue;
      } else {
        // Set default based on attribute type
        switch (attr.type) {
          case AttributeType.Select:
            defaultValues[fieldKey] = '';
            break;
          case AttributeType.Checkbox:
            defaultValues[fieldKey] = [];
            break;
          case AttributeType.Input:
            defaultValues[fieldKey] = '';
            break;
          case AttributeType.Text:
            defaultValues[fieldKey] = '';
            break;
          case AttributeType.MultiText:
            defaultValues[fieldKey] = '';
            break;
          default:
            defaultValues[fieldKey] = '';
        }
      }
    });
  });

  return defaultValues;
};