import { z } from "zod";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";

const messages = {
  required: "این فیلد الزامی است",
  string: "مقدار وارد شده باید متن باشد",
  invalidOption: "گزینه انتخاب شده معتبر نیست",
  min: (min: number) => `حداقل ${min} کاراکتر وارد کنید`,
};

export const createDetailsSchema = (detailsData: ICategoryDetails) => {
  let schemaFields: { [key: string]: z.ZodTypeAny } = {};

  if (!detailsData?.bind) {
    return z.object(schemaFields);
  }

  const bind = detailsData.bind;

  if (bind.allow_fake) {
    schemaFields.is_fake_product = z.boolean().optional();
  }

  if (bind.brands && bind.brands.length > 0) {
    const brandIds = bind.brands.map((b) => b.id.toString());
    schemaFields.brand = z.string({ required_error: messages.required }).refine((val) => brandIds.includes(val), {
      message: messages.invalidOption,
    });
  }

  if (bind.statuses && bind.statuses.length > 0) {
    const statusValues = bind.statuses.map((s) => s.value);
    schemaFields.status = z.string().refine((val) => statusValues.includes(val), {
      message: messages.invalidOption,
    }).optional();
  }

  if (bind.platforms && bind.platforms.length > 0) {
    const platformValues = bind.platforms.map((p) => p.value);
    schemaFields.platform = z.string().refine((val) => platformValues.includes(val), {
        message: messages.invalidOption,
    }).optional();
  }

  if (bind.product_classes && bind.product_classes.length > 0) {
    const classValues = bind.product_classes.map((pc) => pc.value);
    schemaFields.product_class = z.string().refine((val) => classValues.includes(val), {
        message: messages.invalidOption,
    }).optional();
  }

  if (bind.category_product_types && bind.category_product_types.length > 0) {
    const typeValues = bind.category_product_types.map((cpt) => cpt.value);
    schemaFields.category_product_type = z.string({ required_error: messages.required }).refine((val) => typeValues.includes(val), {
        message: messages.invalidOption,
    });
  }

  if (bind.brand_model) {
      let brandModelSchema = z.string();
      if(bind.brand_model.require) {
          brandModelSchema = brandModelSchema.min(1, messages.required);
      }
      schemaFields.brand_model = brandModelSchema.optional();
  }

  if (bind.fake_reasons && bind.fake_reasons.length > 0) {
    const reasonTexts = bind.fake_reasons.map((fr) => fr.text.toString());
     schemaFields.fake_reason = z.string().refine((val) => reasonTexts.includes(val), {
        message: messages.invalidOption,
    }).optional();
  }

  if (bind.general_mefa && Object.keys(bind.general_mefa).length > 0) {
      schemaFields.id_type = z.enum(["general", "custom"], { required_error: messages.required });

      const generalMefaIds = Object.keys(bind.general_mefa);
      schemaFields.general_mefa_id = z.string().refine((val) => generalMefaIds.includes(val), {
          message: messages.invalidOption,
      }).optional();

      schemaFields.custom_id = z.string().optional();
  }


  return z.object(schemaFields);
};

export const createAttributesSchema = (attributesData: ICategoryAttr) => {
    let schemaFields: { [key: string]: z.ZodTypeAny } = {};

    if (!attributesData?.category_group_attributes) {
        return z.object(schemaFields);
    }

    Object.values(attributesData.category_group_attributes).forEach((group) => {
        Object.values(group.attributes).forEach((attr) => {
            const fieldKey = attr.code || attr.id.toString();
            let fieldSchema;

            switch (attr.type) {
                case "input":
                case "text":
                    fieldSchema = z.string();
                    if (attr.require) {
                        fieldSchema = fieldSchema.min(1, messages.required);
                    }
                    break;
                case "select":
                    const optionValues = Object.keys(attr.values);
                    fieldSchema = z.string().refine((val) => optionValues.includes(val), {
                        message: messages.invalidOption,
                    });
                    if (attr.require) {
                        fieldSchema = fieldSchema.min(1, messages.required);
                    }
                    break;
                case "checkbox":
                    const checkboxValues = Object.keys(attr.values);
                    fieldSchema = z.array(z.string()).refine((val) => val.every(v => checkboxValues.includes(v)), {
                        message: messages.invalidOption,
                    });
                     if (attr.require) {
                        fieldSchema = fieldSchema.min(1, { message: messages.required });
                    }
                    break;
                default:
                    fieldSchema = z.any();
            }

            schemaFields[fieldKey] = fieldSchema.optional();
        });
    });

    return z.object(schemaFields);
};
