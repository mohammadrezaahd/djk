import React, { useState, useMemo } from "react";
import {
  Box,
  Alert,
  Grid,
  Button,
  Stack,
  Typography,
  Container,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";
import Layout from "~/components/layout/Layout";
import { TitleCard } from "~/components/common";
import { AppEditProduct, QuickEditProduct } from "~/components/products";
import { useProduct, useEditProduct } from "~/api/product.api";
import { useCategoriesList } from "~/api/categories.api";
import {
  getAttributesTemplatesValidationErrors,
  getDetailsTemplatesValidationErrors,
  useProductInfoValidation,
} from "~/validation";
import { useSelectedImages } from "~/api/gallery.api";
import { TemplateSource } from "~/types/dtos/templates.dto";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";

interface TemplateData {
  id: number;
  title: string;
  source: TemplateSource;
  data: ICategoryDetails | ICategoryAttr;
  formData: { [key: string]: any };
}

export function meta() {
  return [
    { title: "ویرایش محصول" },
    { name: "description", content: "صفحه ویرایش محصول در فروشگاه" },
  ];
}

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State for validation data
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [detailsTemplates, setDetailsTemplates] = useState<TemplateData[]>([]);
  const [attributesTemplates, setAttributesTemplates] = useState<
    TemplateData[]
  >([]);
  const [activeDetailsTab, setActiveDetailsTab] = useState(0);
  const [activeAttributesTab, setActiveAttributesTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // API hooks
  const { mutateAsync: editProduct, isPending: isUpdating } = useEditProduct();
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(productId);
  const { data: categoriesData } = useCategoriesList("", 1, 50);

  // Load product data effect
  React.useEffect(() => {
    if (!productData?.data || !categoriesData?.data) return;

    const product = productData.data;

    setProductTitle(product.title);
    setProductDescription(product.description || "");
    setSelectedImages(product.images);

    // Find category
    const category = categoriesData.data.items.find(
      (cat: any) => cat.id === product.category_id
    );
    if (category) {
      setSelectedCategory(category);
    }

    // Load details templates
    if (product.details?.list && product.details.list.length > 0) {
      const templates: TemplateData[] = product.details.list.map(
        (detailData: ICategoryDetails, index: number) => {
          const templateId = (detailData as any).template_id || index + 1000;
          const templateTitle =
            (detailData as any).template_title || `قالب ${index + 1}`;

          const formData: { [key: string]: any } = {};

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
            if ((detailData as any)[field] !== undefined) {
              formData[field] = (detailData as any)[field];
            }
          });

          if (detailData.bind) {
            const bind = detailData.bind as any;
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
              if (bind[fieldName]?.value !== undefined) {
                formData[fieldName] = bind[fieldName].value;
              }
            });
          }

          return {
            id: templateId,
            title: templateTitle,
            source: product.source,
            data: detailData,
            formData,
          };
        }
      );
      setDetailsTemplates(templates);
    }

    // Load attributes templates
    if (product.attributes?.list && product.attributes.list.length > 0) {
      const templates: TemplateData[] = product.attributes.list.map(
        (attrData: ICategoryAttr, index: number) => {
          const templateId = (attrData as any).template_id || index + 2000;
          const templateTitle =
            (attrData as any).template_title || `قالب ${index + 1}`;

          const formData: { [key: string]: any } = {};

          if (attrData.category_group_attributes) {
            Object.values(attrData.category_group_attributes).forEach(
              (categoryData: any) => {
                Object.values(categoryData.attributes).forEach((attr: any) => {
                  const fieldKey = attr.code || attr.id.toString();

                  switch (attr.type) {
                    case "input":
                    case "text":
                      if (attr.value) {
                        if (
                          typeof attr.value === "object" &&
                          attr.value.original_text
                        ) {
                          formData[fieldKey] = attr.value.original_text;
                        } else if (typeof attr.value === "string") {
                          formData[fieldKey] = attr.value;
                        }
                      }
                      break;
                    case "select":
                      const selectedValue = Object.entries(
                        attr.values || {}
                      ).find(([_, v]: [string, any]) => v.selected)?.[0];
                      if (selectedValue) {
                        formData[fieldKey] = selectedValue;
                      }
                      break;
                    case "checkbox":
                      const selectedValues = Object.entries(attr.values || {})
                        .filter(([_, v]: [string, any]) => v.selected)
                        .map(([k, _]) => k);
                      if (selectedValues.length > 0) {
                        formData[fieldKey] = selectedValues;
                      }
                      break;
                  }
                });
              }
            );
          }

          return {
            id: templateId,
            title: templateTitle,
            source: product.source,
            data: attrData,
            formData,
          };
        }
      );
      setAttributesTemplates(templates);
    }
  }, [productData?.data?.id, categoriesData?.data]); // Fixed dependencies

  // Template data for validation
  const activeDetailsTemplate = detailsTemplates[activeDetailsTab];
  const activeAttributesTemplate = attributesTemplates[activeAttributesTab];

  // Validation
  const productInfoValidation = useProductInfoValidation(
    productTitle,
    productDescription
  );
  const { data: selectedImagesData } = useSelectedImages(selectedImages);

  // Get validation errors for templates
  const allDetailsValidationErrors = useMemo(() => {
    const allErrors = getDetailsTemplatesValidationErrors(detailsTemplates);
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeDetailsTemplate?.id
    );
    return activeTemplateErrors?.errors || {};
  }, [detailsTemplates, activeDetailsTemplate?.id]);

  const allAttributesValidationErrors = useMemo(() => {
    const allErrors =
      getAttributesTemplatesValidationErrors(attributesTemplates);
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeAttributesTemplate?.id
    );
    return activeTemplateErrors?.errors || {};
  }, [attributesTemplates, activeAttributesTemplate?.id]);

  // Calculate if form is valid - different logic for Quick vs App
  const isFormValid = useMemo(() => {
    // Basic validations for all types
    if (!productInfoValidation.isValid) return false;
    if (selectedImages.length === 0) return false;
    const hasProductImage =
      selectedImagesData?.data?.list?.some((img) => img.product === true) ||
      false;
    if (!hasProductImage) return false;

    // For Quick products, templates are optional - no validation required
    if (productData?.data?.source === TemplateSource.Quick) {
      return true; // Only basic validations for Quick products
    }

    // For App products, apply template validations
    if (detailsTemplates.length === 0 || attributesTemplates.length === 0) {
      return false;
    }
    const hasDetailsErrors = Object.keys(allDetailsValidationErrors).length > 0;
    const hasAttributesErrors =
      Object.keys(allAttributesValidationErrors).length > 0;
    return !hasDetailsErrors && !hasAttributesErrors;
  }, [
    productInfoValidation.isValid,
    selectedImages.length,
    selectedImagesData,
    productData?.data?.source,
    detailsTemplates,
    attributesTemplates,
    allDetailsValidationErrors,
    allAttributesValidationErrors,
  ]);

  // Save handler
  const handleSave = async () => {
    try {
      // Build details list
      const detailsList = detailsTemplates.map((template) => {
        const finalData = JSON.parse(JSON.stringify(template.data));
        const formData = template.formData;

        // Apply static fields
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

        // Apply bind selections
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
              reason.selected = reason.text.toString() === formData.fake_reason;
            });
          }
          if (bind.category_data?.themes && formData.theme) {
            bind.category_data.themes.forEach((theme: any) => {
              theme.selected = theme.value === formData.theme;
            });
          }

          // Apply text fields
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
      });

      // Build attributes list
      const attributesList = attributesTemplates.map((template) => {
        const finalData = JSON.parse(JSON.stringify(template.data));
        const formData = template.formData;

        if (finalData.category_group_attributes) {
          Object.keys(finalData.category_group_attributes).forEach(
            (categoryId) => {
              const categoryData =
                finalData.category_group_attributes[categoryId];
              Object.keys(categoryData.attributes).forEach((attributeId) => {
                const attr = categoryData.attributes[attributeId];
                const fieldKey = attr.code || attr.id.toString();
                const formValue = formData[fieldKey];
                const hasFormValue = fieldKey in formData;

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
                          .split("\n")
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
                      if (formValue) {
                        const formValueStr = formValue.toString();
                        if (attr.values[formValueStr]) {
                          attr.values[formValueStr].selected = true;
                        }
                      }
                      break;
                    case "checkbox":
                      Object.keys(attr.values).forEach((valueId) => {
                        attr.values[valueId].selected = false;
                      });
                      if (Array.isArray(formValue) && formValue.length > 0) {
                        formValue.forEach((valueId: any) => {
                          const valueIdStr = valueId.toString();
                          if (attr.values[valueIdStr]) {
                            attr.values[valueIdStr].selected = true;
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
      });

      const finalProductData = {
        category_id: productData?.data?.category_id || 0,
        title: productTitle,
        description: productDescription,
        details: { list: detailsList },
        attributes: { list: attributesList },
        images: selectedImages,
        source: productData?.data?.source || ("App" as TemplateSource),
        tag: "test",
        variant_data: {},
      };

      const response = await editProduct({
        id: productId,
        data: finalProductData as any,
      });

      if (response?.status === "true") {
        enqueueSnackbar("محصول با موفقیت به‌روزرسانی شد", {
          variant: "success",
        });
        navigate("/dashboard/products/list");
      } else {
        enqueueSnackbar("خطا در به‌روزرسانی محصول", { variant: "error" });
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      enqueueSnackbar(error?.message || "خطا در به‌روزرسانی محصول", {
        variant: "error",
      });
    }
  };

  // Navigation handlers
  const handleNavigateBack = () => {
    navigate("/dashboard/products/list");
  };

  const handleSaveSuccess = () => {
    navigate("/dashboard/products/list");
  };

  // State update handlers with useCallback for stable references
  const handleProductTitleChange = React.useCallback((value: string) => {
    setProductTitle(value);
  }, []);

  const handleProductDescriptionChange = React.useCallback((value: string) => {
    setProductDescription(value);
  }, []);

  const handleImagesChange = React.useCallback((images: number[]) => {
    setSelectedImages(images);
  }, []);

  const handleDetailsTemplatesChange = React.useCallback(
    (templates: TemplateData[]) => {
      setDetailsTemplates(templates);
    },
    []
  );

  const handleAttributesTemplatesChange = React.useCallback(
    (templates: TemplateData[]) => {
      setAttributesTemplates(templates);
    },
    []
  );

  const handleActiveDetailsTabChange = React.useCallback((tab: number) => {
    setActiveDetailsTab(tab);
  }, []);

  const handleActiveAttributesTabChange = React.useCallback((tab: number) => {
    setActiveAttributesTab(tab);
  }, []);

  // Validation
  if (!productId || productId === 0) {
    return (
      <Layout title="ویرایش محصول">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">شناسه محصول نامعتبر است.</Alert>
        </Box>
      </Layout>
    );
  }

  if (isProductLoading) {
    return (
      <Layout title="ویرایش محصول">
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              gap: 2,
            }}
          >
            <Typography variant="h6">
              در حال بارگذاری اطلاعات محصول...
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (productError || !productData?.data) {
    return (
      <Layout title="ویرایش محصول">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            خطا در بارگذاری اطلاعات محصول. لطفاً دوباره تلاش کنید.
          </Alert>
        </Box>
      </Layout>
    );
  }

  const renderComponent = () => {
    if (!productData?.data || !productData.data?.source) return null;
    switch (productData.data?.source) {
      case TemplateSource.App:
        return (
          <AppEditProduct
            productData={productData}
            productTitle={productTitle}
            productDescription={productDescription}
            selectedImages={selectedImages}
            detailsTemplates={detailsTemplates}
            attributesTemplates={attributesTemplates}
            activeDetailsTab={activeDetailsTab}
            activeAttributesTab={activeAttributesTab}
            productInfoValidation={productInfoValidation}
            allDetailsValidationErrors={allDetailsValidationErrors}
            allAttributesValidationErrors={allAttributesValidationErrors}
            onProductTitleChange={handleProductTitleChange}
            onProductDescriptionChange={handleProductDescriptionChange}
            onImagesChange={handleImagesChange}
            onDetailsTemplatesChange={handleDetailsTemplatesChange}
            onAttributesTemplatesChange={handleAttributesTemplatesChange}
            onActiveDetailsTabChange={handleActiveDetailsTabChange}
            onActiveAttributesTabChange={handleActiveAttributesTabChange}
          />
        );
      case TemplateSource.Quick:
        return (
          <QuickEditProduct
            productData={productData}
            productTitle={productTitle}
            productDescription={productDescription}
            selectedImages={selectedImages}
            onProductTitleChange={handleProductTitleChange}
            onProductDescriptionChange={handleProductDescriptionChange}
            onImagesChange={handleImagesChange}
            onDetailsTemplatesChange={handleDetailsTemplatesChange}
            onAttributesTemplatesChange={handleAttributesTemplatesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="ویرایش محصول">
      <Container maxWidth="lg">
        <Box sx={{ p: 3 }}>
          <TitleCard
            title="ویرایش محصول"
            description="اطلاعات محصول را ویرایش کنید."
          />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {renderComponent()}

            {!isFormValid && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="warning">
                  لطفاً تمام فیلدهای الزامی را پر کنید:
                  <ul style={{ margin: "8px 0", paddingRight: "20px" }}>
                    {!productInfoValidation.isValid && (
                      <li>عنوان و توضیحات محصول را به درستی وارد کنید</li>
                    )}
                    {selectedImages.length === 0 && (
                      <li>حداقل یک تصویر برای محصول انتخاب کنید</li>
                    )}
                    {selectedImages.length > 0 &&
                      !selectedImagesData?.data?.list?.some(
                        (img) => img.product === true
                      ) && (
                        <li>
                          حداقل یکی از تصاویر انتخاب شده باید عکس محصول
                          (product) باشد
                        </li>
                      )}
                    {/* Only show template validations for App products, not Quick */}
                    {productData?.data?.source === TemplateSource.App && (
                      <>
                        {(detailsTemplates.length === 0 ||
                          attributesTemplates.length === 0) && (
                          <li>حداقل یک قالب برای جزئیات و ویژگی‌ها انتخاب کنید</li>
                        )}
                        {Object.keys(allDetailsValidationErrors).length > 0 && (
                          <li>فیلدهای الزامی در قالب‌های جزئیات را پر کنید</li>
                        )}
                        {Object.keys(allAttributesValidationErrors).length > 0 && (
                          <li>فیلدهای الزامی در قالب‌های ویژگی‌ها را پر کنید</li>
                        )}
                      </>
                    )}
                  </ul>
                </Alert>
              </Grid>
            )}

            {/* Action Buttons */}
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={handleNavigateBack} variant="outlined">
                  بازگشت
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  disabled={!isFormValid || isUpdating}
                >
                  {isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default EditProductPage;
