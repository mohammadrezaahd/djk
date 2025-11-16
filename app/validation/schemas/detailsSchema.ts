import { z } from "zod";
import type { ICategoryDetails } from "../../types/interfaces/details.interface";
import type { IStringField } from "../../types/interfaces/components.interface";

// Utility function to get default values for Zod schema
export const getDetailsDefaultValues = (
  schemaData?: ICategoryDetails | null,
  currentFormData?: Record<string, any>
) => {
  if (!schemaData) {
    return {};
  }

  const defaultValues: Record<string, any> = {};

  // Set default for title if not in current form data
  if (currentFormData?.title === undefined) {
    defaultValues.title = schemaData.title || "";
  }

  // Set defaults for various fields
  const fields: (keyof ICategoryDetails)[] = [
    "brand",
    "status",
    "platform",
    "product_class",
    "category_product_type",
    "theme",
    "id_type",
    "general_mefa_id",
    "custom_id",
    "is_fake_product",
    "fake_reason",
  ];

  fields.forEach((field) => {
    if (
      schemaData[field] !== undefined &&
      currentFormData?.[field] === undefined
    ) {
      const fieldData = schemaData[field] as any;
      if (
        typeof fieldData === "object" &&
        fieldData !== null &&
        "selected" in fieldData &&
        fieldData.selected
      ) {
        defaultValues[field] = fieldData.value;
      }
    }
  });

  // Handle text fields (IStringField)
  if (schemaData.bind) {
    const bind = schemaData.bind as any;
    const textFields: (keyof typeof bind)[] = [
      "brand_model",
      "color_pattern",
      "warranty",
      "size",
      "weight",
      "material",
      "origin_country",
      "manufacturer",
      "model_number",
      "barcode",
      "package_dimensions",
      "special_features",
      "care_instructions",
    ];

    textFields.forEach((fieldName) => {
      const fieldData = bind[fieldName] as IStringField;
      if (fieldData?.value && currentFormData?.[fieldName] === undefined) {
        defaultValues[fieldName] = fieldData.value;
      }
    });
  }

  return defaultValues;
};

// Main function to create the Zod schema
export const getDetailsSchema = (
  schemaData?: ICategoryDetails | null,
  isProduct = false
) => {
  if (!schemaData) {
    return z.object({});
  }

  const schemaObject: Record<string, z.ZodType<any, any>> = {};

  // Always require title
  schemaObject.title = z
    .string()
    .min(1, "عنوان قالب اطلاعات نمی‌تواند خالی باشد");

  // Add description, tag, etc. - not required
  schemaObject.description = z.string().optional();
  schemaObject.tag = z.string().optional();

  // Handle dynamic fields based on schemaData
  if (schemaData.is_fake_product?.required && isProduct) {
    schemaObject.is_fake_product = z.boolean({
      required_error: "انتخاب وضعیت اصالت کالا الزامی است",
    });
  } else {
    schemaObject.is_fake_product = z.boolean().optional();
  }

  // Handle fake_reason - it's required only if is_fake_product is true
  if (schemaData.fake_reason?.required && isProduct) {
    schemaObject.fake_reason = z.string().optional();
  } else {
    schemaObject.fake_reason = z.string().optional();
  }

  // Handle other required fields for products
  const requiredFields: (keyof ICategoryDetails)[] = [
    "brand",
    "status",
    "platform",
    "product_class",
    "category_product_type",
    "theme",
    "id_type",
  ];

  requiredFields.forEach((field) => {
    const fieldData = schemaData[field] as any;
    if (fieldData?.required && isProduct) {
      if (Array.isArray(fieldData.options) && fieldData.options.length > 0) {
        // Create a Zod enum from the option values
        const optionValues = fieldData.options.map((opt: any) => opt.value);
        if (optionValues.length > 0) {
          schemaObject[field] = z.enum([
            optionValues[0],
            ...optionValues.slice(1),
          ]);
        }
      } else {
        // Default to string with min(1) if no options
        schemaObject[field] = z
          .string()
          .min(1, `فیلد ${fieldData.label || field} الزامی است`);
      }
    } else {
      schemaObject[field] = z.any().optional();
    }
  });

  // Handle text fields (IStringField) from bind property
  if (schemaData.bind) {
    const bind = schemaData.bind as any;
    const textFields: (keyof typeof bind)[] = [
      "brand_model",
      "color_pattern",
      "warranty",
      "size",
      "weight",
      "material",
      "origin_country",
      "manufacturer",
      "model_number",
      "barcode",
      "package_dimensions",
      "special_features",
      "care_instructions",
    ];

    textFields.forEach((fieldName) => {
      const fieldData = bind[fieldName] as IStringField;
      if (fieldData) {
        if (fieldData.required && isProduct) {
          schemaObject[fieldName] = z
            .string()
            .min(1, `فیلد ${fieldData.label} الزامی است`);
        } else {
          schemaObject[fieldName] = z.string().optional();
        }
      }
    });
  }

  return z.object(schemaObject).superRefine((data, ctx) => {
    // Conditional validation for fake_reason
    if (
      data.is_fake_product === true &&
      schemaData.fake_reason?.required &&
      isProduct &&
      !data.fake_reason
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "انتخاب دلیل تقلبی بودن کالا الزامی است",
        path: ["fake_reason"],
      });
    }

    // Conditional validation for custom_id based on id_type
    if (
      data.id_type === "custom" &&
      schemaData.custom_id?.required &&
      isProduct &&
      !data.custom_id
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "شناسه اختصاصی الزامی است",
        path: ["custom_id"],
      });
    }

    // Conditional validation for general_mefa_id based on id_type
    if (
      data.id_type === "general" &&
      schemaData.general_mefa_id?.required &&
      isProduct &&
      !data.general_mefa_id
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "شناسه عمومی الزامی است",
        path: ["general_mefa_id"],
      });
    }
  });
};