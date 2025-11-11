import { TemplateSource } from "~/types/dtos/templates.dto";

export const generateFinalProductData = (productState: any) => {
  const detailsList = productState.selectedDetailsTemplates.map(
    (template: any) => {
      const finalData = JSON.parse(JSON.stringify(template.data));
      const formData = template.formData;

      const staticFields = [
        "is_fake_product",
        "brand",
        "status",
        "platform",
        "product_class",
        "category_product_type",
        "fake_reason",
        "theme",
        "id_type",
        "general_mefa_id",
        "custom_id",
      ];

      staticFields.forEach((field) => {
        if (
          formData[field] !== undefined &&
          formData[field] !== null &&
          formData[field] !== ""
        ) {
          (finalData as any)[field] = formData[field];
        }
      });

      const bind = finalData.bind;
      if (bind) {
        if (bind.brands && formData.brand) {
          bind.brands.forEach((brand: any) => {
            brand.selected = brand.id === formData.brand;
          });
        }
        if (bind.statuses && formData.status) {
          bind.statuses.forEach((status: any) => {
            status.selected = status.value === formData.status;
          });
        }
        if (bind.platforms && formData.platform) {
          bind.platforms.forEach((platform: any) => {
            platform.selected = platform.value === formData.platform;
          });
        }
        if (bind.product_classes && formData.product_class) {
          bind.product_classes.forEach((productClass: any) => {
            productClass.selected =
              productClass.value === formData.product_class;
          });
        }
        if (bind.category_product_types && formData.category_product_type) {
          bind.category_product_types.forEach((cpt: any) => {
            cpt.selected = cpt.value === formData.category_product_type;
          });
        }
        if (bind.fake_reasons && formData.fake_reason) {
          bind.fake_reasons.forEach((reason: any) => {
            reason.selected =
              reason.text.toString() === formData.fake_reason;
          });
        }
        if (bind.category_data?.themes && formData.theme) {
          bind.category_data.themes.forEach((theme: any) => {
            theme.selected = theme.value === formData.theme;
          });
        }

        const textFields = [
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
          if (bind[fieldName] && formData[fieldName] !== undefined) {
            bind[fieldName].value = formData[fieldName];
          }
        });
      }

      return finalData;
    }
  );

  const attributesList = productState.selectedAttributesTemplates.map(
    (template: any) => {
      const finalData = JSON.parse(JSON.stringify(template.data));
      const formData = template.formData;

      if (finalData.category_group_attributes) {
        Object.keys(finalData.category_group_attributes).forEach(
          (categoryId) => {
            const categoryData =
              finalData.category_group_attributes[categoryId];

            Object.keys(categoryData.attributes).forEach((attributeId) => {
              const attr = categoryData.attributes[attributeId];
              const formValue = formData[attr.id];
              const hasFormValue = attr.id in formData;

              if (hasFormValue) {
                switch (attr.type) {
                  case "input":
                    attr.value =
                      formValue !== null && formValue !== undefined
                        ? formValue.toString()
                        : "";
                    break;
                  case "text":
                    if (
                      formValue !== null &&
                      formValue !== undefined &&
                      formValue !== ""
                    ) {
                      const lines = formValue
                        .toString()
                        .split("\\n")
                        .filter((line: string) => line.trim() !== "");
                      attr.value = {
                        text_lines: lines,
                        original_text: formValue.toString(),
                      };
                    } else {
                      attr.value = "";
                    }
                    break;
                  case "select":
                    Object.keys(attr.values).forEach((valueId) => {
                      attr.values[valueId].selected = false;
                    });
                    if (formValue && attr.values[formValue]) {
                      attr.values[formValue].selected = true;
                    }
                    break;
                  case "checkbox":
                    Object.keys(attr.values).forEach((valueId) => {
                      attr.values[valueId].selected = false;
                    });
                    if (Array.isArray(formValue) && formValue.length > 0) {
                      formValue.forEach((valueId: string) => {
                        if (attr.values[valueId]) {
                          attr.values[valueId].selected = true;
                        }
                      });
                    }
                    break;
                }
              }
            });
          }
        );
      }

      return finalData;
    }
  );

  return {
    category_id: productState.selectedCategoryId,
    title: productState.productTitle,
    description: productState.productDescription,
    details: { list: detailsList },
    attributes: { list: attributesList },
    images: productState.selectedImages,
    source: TemplateSource.App,
    tag: "test",
    variant_data: {},
  };
};
