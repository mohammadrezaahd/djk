import * as yup from "yup";

export const createDetailsSchema = (brands: { id: string }[]) => {
  return yup.object().shape({
    title: yup.string().required("وارد کردن عنوان قالب الزامی است"),
    description: yup.string(),
    is_fake_product: yup.boolean(),
    brand: yup
      .string()
      .when("is_fake_product", {
        is: false,
        then: yup.string().required("انتخاب برند الزامی است"),
        otherwise: yup.string(),
      })
      .test(
        "is-valid-brand",
        "لطفا یک برند معتبر انتخاب کنید",
        (value) => !value || brands.some((brand) => brand.id === value)
      ),
    status: yup.string().required("انتخاب وضعیت محصول الزامی است"),
    platform: yup.string().required("انتخاب پلتفرم الزامی است"),
    product_class: yup.string().required("انتخاب کلاس محصول الزامی است"),
    category_product_type: yup
      .string()
      .required("انتخاب نوع محصول الزامی است"),
    fake_reason: yup.string().when("is_fake_product", {
      is: true,
      then: yup.string().required("انتخاب دلیل تقلبی الزامی است"),
      otherwise: yup.string(),
    }),
    theme: yup.string(),
    id_type: yup.string(),
    general_mefa_id: yup.string().when("id_type", {
      is: "general",
      then: yup.string().required("انتخاب شناسه عمومی الزامی است"),
      otherwise: yup.string(),
    }),
    custom_id: yup.string().when("id_type", {
      is: "custom",
      then: yup.string().required("وارد کردن شناسه خصوصی الزامی است"),
      otherwise: yup.string(),
    }),
  });
};
