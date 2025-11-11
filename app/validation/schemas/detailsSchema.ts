import * as yup from "yup";
import type {
  ICategoryDetails,
  IBindBrand,
  IBindStatus,
  IBindPlatforms,
  IBindProductClass,
  IBindCPT,
  IBindFakeReason,
  ICDThemes,
} from "~/types/interfaces/details.interface";
import { FieldType } from "~/types/interfaces/details.interface";

/**
 * Validation messages in Persian
 */
const messages = {
  required: "این فیلد الزامی است",
  string: "مقدار وارد شده باید متن باشد",
  boolean: "مقدار وارد شده باید true یا false باشد",
  invalidOption: "گزینه انتخاب شده معتبر نیست",
  min: "حداقل ${min} کاراکتر وارد کنید",
  max: "حداکثر ${max} کاراکتر مجاز است",
  number: "مقدار وارد شده باید عدد باشد",
  minNumber: "عدد باید صفر یا بزرگتر باشد",
};

/**
 * Create validation for dropdown fields with options
 */
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

  // Validate that selected value exists in the valid options
  validation = validation.test(
    "valid-option",
    messages.invalidOption,
    function (value) {
      if (!value && !required) return true; // Optional field can be empty
      if (!value && required) return false; // Required field cannot be empty
      return value ? validValues.includes(value) : false;
    }
  );

  return validation;
};

/**
 * Base details form schema (title and description)
 */
export const baseDetailsSchema = yup.object({
  title: yup
    .string()
    .required(messages.required)
    .min(3, "عنوان قالب باید حداقل 3 کاراکتر باشد")
    .max(20, "عنوان قالب باید حداکثر 20 کاراکتر باشد"),
  description: yup.string().max(1000, "توضیحات باید حداکثر 1000 کاراکتر باشد"),
});

/**
 * Generate dynamic validation schema based on details data
 * @param detailsData - The details data to create validation for
 * @param isProductCreation - If true, includes all field validations. If false, only title/description
 */
export const createDetailsFormSchema = (
  detailsData: ICategoryDetails | null,
  isProductCreation: boolean = false
) => {
  if (!detailsData?.bind || !isProductCreation) {
    return baseDetailsSchema;
  }

  const dynamicFields: { [key: string]: any } = {};
  const bind = detailsData.bind;

  // Fake product validation
  if (bind.allow_fake) {
    dynamicFields.is_fake_product = yup.boolean();
  }

  // Generic: if detailsData contains numeric fields, ensure they are numbers >= 0
  Object.keys(detailsData || {}).forEach((key) => {
    const val: any = (detailsData as any)[key];
    if (val && typeof val === "object" && (val.type === FieldType.Number || val.type === "number")) {
      dynamicFields[key] = yup
        .number()
        .typeError(messages.number)
        .min(0, messages.minNumber || "عدد باید مثبت باشد");
      if (val.require) dynamicFields[key] = dynamicFields[key].required(messages.required);
    }
  });

  // Brand validation
  if (bind.brands && bind.brands.length > 0) {
    dynamicFields.brand = createOptionValidation(bind.brands, true, "id");
  }

  // Category product types validation
  if (bind.category_product_types && bind.category_product_types.length > 0) {
    dynamicFields.category_product_type = createOptionValidation(
      bind.category_product_types,
      true,
      "value"
    );
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
            if (!value) return false; // Required when id_type is general
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

  // Brand model validation
  if (bind.brand_model) {
    dynamicFields.brand_model = bind.brand_model.require
      ? yup.string().required(messages.required)
      : yup.string();
  }

  return baseDetailsSchema.shape(dynamicFields);
};

/**
 * Type for details form data
 */
export type DetailsFormData = {
  title: string;
  description?: string;
  tag?: string;
  is_fake_product?: boolean;
  brand?: string;
  category_product_type?: string;
  id_type?: "general" | "custom";
  general_mefa_id?: string;
  custom_id?: string;
  brand_model?: string;
};

/**
 * Get default values for details form
 */
export const getDetailsDefaultValues = (
  detailsData: ICategoryDetails | null,
  currentFormData: { [key: string]: any } = {}
): DetailsFormData => {
  
  const defaultValues: DetailsFormData = {
    title: currentFormData.title ?? "",
    description: currentFormData.description ?? "",
    tag: currentFormData.tag ?? "",
  };


  if (!detailsData?.bind) {
    return defaultValues;
  }

  const bind = detailsData.bind;

  // Set defaults from current form data or defaults
  // Use ?? instead of || to allow empty strings
  defaultValues.is_fake_product = currentFormData.is_fake_product ?? false;
  defaultValues.brand = currentFormData.brand ?? "";
  defaultValues.category_product_type =
    currentFormData.category_product_type ?? "";
  defaultValues.id_type =
    currentFormData.id_type ?? "general";
  defaultValues.general_mefa_id = currentFormData.general_mefa_id ?? "";
  defaultValues.custom_id = currentFormData.custom_id ?? "";
  defaultValues.brand_model = currentFormData.brand_model ?? (bind.brand_model?.value || "");

  
  return defaultValues;
};
