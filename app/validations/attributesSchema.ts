import * as yup from "yup";
import type { IAttr } from "~/types/interfaces/attributes.interface";

export const createAttributesSchema = (attributes: IAttr[]) => {
  const shape = attributes.reduce((acc, attr) => {
    let validator;
    switch (attr.element_type) {
      case "text":
        validator = yup.string();
        break;
      case "number":
        validator = yup.number();
        break;
      case "select":
        if (attr.max_selection > 1) {
          validator = yup
            .array()
            .of(yup.string())
            .test(
              "is-valid-option",
              "لطفا یک گزینه معتبر انتخاب کنید",
              (values) =>
                !values ||
                values.every((value) =>
                  attr.options.some((opt) => opt.id.toString() === value)
                )
            );
        } else {
          validator = yup
            .string()
            .test(
              "is-valid-option",
              "لطفا یک گزینه معتبر انتخاب کنید",
              (value) =>
                !value ||
                attr.options.some((opt) => opt.id.toString() === value)
            );
        }
        break;
      case "radio":
        validator = yup.string();
        break;
      case "checkbox":
        validator = yup.boolean();
        break;
      default:
        validator = yup.mixed();
    }

    if (attr.is_required) {
      validator = validator.required("این فیلد الزامی است");
    }

    acc[attr.id.toString()] = validator;
    return acc;
  }, {} as any);

  return yup.object().shape({
    title: yup.string().required("وارد کردن عنوان قالب الزامی است"),
    description: yup.string(),
    ...shape,
  });
};
