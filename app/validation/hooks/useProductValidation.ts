import { useMemo } from 'react';
import type { ICategoryDetails } from '~/types/interfaces/details.interface';
import type { ICategoryAttr } from '~/types/interfaces/attributes.interface';
import { AttributeType } from '~/types/interfaces/attributes.interface';
import * as yup from 'yup';

/**
 * Create validation schema for product details (without title/description)
 */
const createProductDetailsValidationSchema = (detailsData: ICategoryDetails | null) => {
  if (!detailsData?.bind) {
    return yup.object({});
  }

  const dynamicFields: { [key: string]: any } = {};
  const bind = detailsData.bind;

  // Messages
  const messages = {
    required: "این فیلد الزامی است",
    invalidOption: "گزینه انتخاب شده معتبر نیست",
  };

  // Create option validation
  const createOptionValidation = (
    options: any[],
    required: boolean = false,
    valueKey: string = "value"
  ) => {
    const validValues = options
      .map((option) => {
        if (valueKey === "id") return option.id;
        if (valueKey === "text") return option.text?.toString();
        return option.value || option.id;
      })
      .filter((val) => val !== undefined);

    let validation = yup.string();

    if (required) {
      validation = validation.required(messages.required);
    }

    validation = validation.test(
      "valid-option",
      messages.invalidOption,
      function (value) {
        if (!value && !required) return true;
        if (!value && required) return false;
        return value ? validValues.includes(value) : false;
      }
    );

    return validation;
  };

  // Fake product validation
  if (bind.allow_fake) {
    dynamicFields.is_fake_product = yup.boolean();
  }

  // Brand validation
  if (bind.brands && bind.brands.length > 0) {
    dynamicFields.brand = createOptionValidation(bind.brands, true, "id");
  }

  // Status validation
  if (bind.statuses && bind.statuses.length > 0) {
    dynamicFields.status = createOptionValidation(bind.statuses, true, "value");
  }

  // Platform validation
  if (bind.platforms && bind.platforms.length > 0) {
    dynamicFields.platform = createOptionValidation(bind.platforms, true, "value");
  }

  // Product class validation
  if (bind.product_classes && bind.product_classes.length > 0) {
    dynamicFields.product_class = createOptionValidation(bind.product_classes, true, "value");
  }

  // Category product types validation
  if (bind.category_product_types && bind.category_product_types.length > 0) {
    dynamicFields.category_product_type = createOptionValidation(bind.category_product_types, true, "value");
  }

  // Fake reasons validation
  if (bind.fake_reasons && bind.fake_reasons.length > 0) {
    dynamicFields.fake_reason = createOptionValidation(bind.fake_reasons, true, "text");
  }

  // Brand model validation
  if (bind.brand_model) {
    dynamicFields.brand_model = bind.brand_model.require
      ? yup.string().required(messages.required)
      : yup.string();
  }

  // ID type validation
  if (bind.general_mefa && Object.keys(bind.general_mefa).length > 0) {
    dynamicFields.id_type = yup
      .string()
      .required(messages.required)
      .oneOf(["general", "custom"], messages.invalidOption);

    // General MEFA ID validation
    const generalMefaOptions = Object.keys(bind.general_mefa);
    dynamicFields.general_mefa_id = yup.string().when("id_type", {
      is: "general",
      then: (schema) =>
        schema.required(messages.required).test(
          "valid-general-mefa",
          messages.invalidOption,
          function (value) {
            if (!value) return false;
            return generalMefaOptions.includes(value);
          }
        ),
      otherwise: (schema) => schema,
    });

    // Custom ID validation
    dynamicFields.custom_id = yup.string().when("id_type", {
      is: "custom",
      then: (schema) => schema.required(messages.required).min(1, "شناسه خصوصی نمی‌تواند خالی باشد"),
      otherwise: (schema) => schema,
    });
  }

  return yup.object(dynamicFields);
};

/**
 * Create validation schema for product attributes (without title/description)
 */
const createProductAttributesValidationSchema = (attributesData: ICategoryAttr | null) => {
  if (!attributesData?.category_group_attributes) {
    return yup.object({});
  }

  const dynamicFields: { [key: string]: any } = {};

  // Messages
  const messages = {
    required: 'این فیلد الزامی است',
    invalidOption: 'گزینه انتخاب شده معتبر نیست',
    invalidOptions: 'یک یا چند گزینه انتخاب شده معتبر نیست',
    positiveNumber: 'عدد باید مثبت باشد',
    min: 'حداقل ${min} کاراکتر وارد کنید',
    max: 'حداکثر ${max} کاراکتر مجاز است',
  };

  // Create validation for different attribute types
  const createSelectValidation = (attr: any) => {
    const validOptions = Object.keys(attr.values);
    let validation = yup.string();
    
    if (attr.required) {
      validation = validation.required(messages.required);
    }
    
    validation = validation.test(
      'valid-option',
      messages.invalidOption,
      function(value) {
        if (!value && !attr.required) return true;
        if (!value && attr.required) return false;
        return value ? validOptions.includes(value) : false;
      }
    );
    
    return validation;
  };

  const createCheckboxValidation = (attr: any) => {
    const validOptions = Object.keys(attr.values);
    let validation = yup.array().of(yup.string());
    
    if (attr.required) {
      validation = validation.min(1, messages.required);
    }
    
    validation = validation.test(
      'valid-options',
      messages.invalidOptions,
      function(value) {
        if (!value || value.length === 0) {
          return !attr.required;
        }
        return value.every((val: any) => typeof val === 'string' && validOptions.includes(val));
      }
    );
    
    return validation;
  };

  const createInputValidation = (attr: any) => {
    let validation: any;
    
    if (attr.type === AttributeType.Input) {
      validation = yup.number().typeError('مقدار وارد شده باید عدد باشد');
      
      if (attr.required) {
        validation = validation.required(messages.required);
      }
      
      validation = validation.min(0, messages.positiveNumber);
    } else {
      validation = yup.string();
      
      if (attr.required) {
        validation = validation.required(messages.required);
        validation = validation.min(3, messages.min);
      }
      
      validation = validation.max(5000, messages.max);
    }
    
    return validation;
  };

  // Extract all attributes from category groups
  Object.values(attributesData.category_group_attributes).forEach((categoryData: any) => {
    Object.values(categoryData.attributes).forEach((attr: any) => {
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
          if (attr.required) {
            dynamicFields[fieldKey] = yup.string().required(messages.required);
          } else {
            dynamicFields[fieldKey] = yup.string();
          }
      }
    });
  });

  return yup.object(dynamicFields);
};

/**
 * Hook for validating product details form data during product creation
 */
export const useProductDetailsValidation = (
  detailsData: ICategoryDetails | null,
  formData: { [key: string]: any } = {}
) => {
  const validationSchema = useMemo(() => {
    return createProductDetailsValidationSchema(detailsData);
  }, [detailsData]);

  const validationResult = useMemo(() => {
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: {} };
    }
  }, [validationSchema, formData]);

  return validationResult;
};

/**
 * Hook for validating product attributes form data during product creation
 */
export const useProductAttributesValidation = (
  attributesData: ICategoryAttr | null,
  formData: { [key: string]: any } = {}
) => {
  const validationSchema = useMemo(() => {
    return createProductAttributesValidationSchema(attributesData);
  }, [attributesData]);

  const validationResult = useMemo(() => {
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: {} };
    }
  }, [validationSchema, formData]);

  return validationResult;
};

/**
 * Hook for validating product info (title and description)
 */
export const useProductInfoValidation = (
  title: string,
  description: string
) => {
  const productInfoSchema = useMemo(() => {
    return yup.object({
      title: yup
        .string()
        .required('عنوان محصول الزامی است')
        .min(3, 'عنوان محصول باید حداقل 3 کاراکتر باشد')
        .max(100, 'عنوان محصول باید حداکثر 100 کاراکتر باشد'),
      description: yup
        .string()
        .max(1000, 'توضیحات محصول باید حداکثر 1000 کاراکتر باشد'),
    });
  }, []);

  const validationResult = useMemo(() => {
    try {
      productInfoSchema.validateSync({ title, description }, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: {} };
    }
  }, [productInfoSchema, title, description]);

  return validationResult;
};