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

  // Brand validation
  if (bind.brands && bind.brands.length > 0) {
    dynamicFields.brand = createOptionValidation(bind.brands, true, "id");
  }

  // Status validation
  if (bind.statuses && bind.statuses.length > 0) {
    dynamicFields.status = createOptionValidation(
      bind.statuses,
      true,
      "value"
    );
  }

  // Platform validation
  if (bind.platforms && bind.platforms.length > 0) {
    dynamicFields.platform = createOptionValidation(
      bind.platforms,
      true,
      "value"
    );
  }

  // Product class validation
  if (bind.product_classes && bind.product_classes.length > 0) {
    dynamicFields.product_class = createOptionValidation(
      bind.product_classes,
      true,
      "value"
    );
  }

  // Category product types validation
  if (bind.category_product_types && bind.category_product_types.length > 0) {
    dynamicFields.category_product_type = createOptionValidation(
      bind.category_product_types,
      true,
      "value"
    );
  }

  // Fake reasons validation
  if (bind.fake_reasons && bind.fake_reasons.length > 0) {
    dynamicFields.fake_reason = createOptionValidation(
      bind.fake_reasons,
      true,
      "text"
    );
  }

  // Theme validation
  // if (bind.category_data?.themes && bind.category_data.themes.length >= 0) {
  //   dynamicFields.theme = createOptionValidation(
  //     bind.category_data.themes,
  //     true,
  //     "id"
  //   );
  // }

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
  status?: string;
  platform?: string;
  product_class?: string;
  category_product_type?: string;
  fake_reason?: string;
  theme?: string;
  id_type?: "general" | "custom";
  general_mefa_id?: string;
  custom_id?: string;
};

/**
 * Get default values for details form
 */
export const getDetailsDefaultValues = (
  detailsData: ICategoryDetails | null,
  currentFormData: { [key: string]: any } = {}
): DetailsFormData => {
  console.log("🔍 getDetailsDefaultValues - currentFormData:", currentFormData);
  
  const defaultValues: DetailsFormData = {
    title: currentFormData.title || "",
    description: currentFormData.description || "",
    tag: currentFormData.tag || "",
  };

  console.log("🔍 getDetailsDefaultValues - defaultValues.title:", defaultValues.title);

  if (!detailsData?.bind) {
    return defaultValues;
  }

  const bind = detailsData.bind;

  // Set defaults from current form data or defaults
  defaultValues.is_fake_product = currentFormData.is_fake_product ?? false;
  defaultValues.brand = currentFormData.brand || "";
  defaultValues.status = currentFormData.status || "";
  defaultValues.platform = currentFormData.platform || "";
  defaultValues.product_class = currentFormData.product_class || "";
  defaultValues.category_product_type =
    currentFormData.category_product_type || "";
  defaultValues.fake_reason = currentFormData.fake_reason || "";
  defaultValues.theme = currentFormData.theme || "";
  defaultValues.id_type =
    currentFormData.id_type || bind.category_mefa_type || "general";
  defaultValues.general_mefa_id = currentFormData.general_mefa_id || "";
  defaultValues.custom_id = currentFormData.custom_id || "";

  console.log("🔍 getDetailsDefaultValues - final defaultValues:", defaultValues);
  
  return defaultValues;
};
