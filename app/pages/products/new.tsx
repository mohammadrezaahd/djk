import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Box,
  Paper,
  Alert,
  Backdrop,
  Grid,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import type { RootState } from "~/store";
import { TemplateSource } from "~/types/dtos/templates.dto";
import {
  FormStep,
  setCurrentStep,
  setSelectedCategory,
  setAvailableDetailsTemplates,
  addDetailsTemplate,
  removeDetailsTemplate,
  setActiveDetailsTemplateIndex,
  updateDetailsTemplateFormData,
  setAvailableAttributesTemplates,
  addAttributesTemplate,
  removeAttributesTemplate,
  setActiveAttributesTemplateIndex,
  updateAttributesTemplateFormData,
  setProductTitle,
  setProductDescription,
  setSelectedImages,
  updateSelectedTemplateData,
  resetProduct,
  setStepValidationError,
} from "~/store/slices/productSlice";
import { useCategoriesList } from "~/api/categories.api";
import { useDetails, useDetail } from "~/api/details.api";
import { useAttrs, useAttr } from "~/api/attributes.api";
import { useSelectedImages } from "~/api/gallery.api";
import {
  useProductDetailsValidation,
  useProductAttributesValidation,
  useProductInfoValidation,
  validateAllDetailsTemplates,
  validateAllAttributesTemplates,
  getAttributesTemplatesValidationErrors,
} from "~/validation";
import Layout from "~/components/layout/Layout";
import CategorySelector from "~/components/templates/CategorySelector";
import {
  FormSteps,
  TemplateSelection,
  TemplateForms,
  ProductInfoForm,
  ProductDetailsForm,
  ProductAttributesForm,
  ProductImageSelection,
} from "~/components/products";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import { TitleCard } from "~/components/common";
import { useAddProduct } from "~/api/product.api";
import ResultPage from "~/components/products/ResultPage";

export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

const NewProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const productState = useSelector((state: RootState) => state.product);

  // Local state for category management
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategoryLocal] =
    useState<ICategoryList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);

  // Category queries
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesList(categorySearch, 1, 50);

  // استخراج categories و suggestions از response
  const categories = categoriesData?.data?.items || [];
  const suggestedCategories = categoriesData?.data?.suugest || [];
  const {
    mutateAsync: saveProduct,
    isPending: isProductSaving,
    error: productError,
    isSuccess: productSuccess,
  } = useAddProduct();
  // Details and attributes mutations
  const detailsMutation = useDetails();
  const attributesMutation = useAttrs();

  // Template data hooks
  const activeDetailsTemplate =
    productState.selectedDetailsTemplates[
      productState.activeDetailsTemplateIndex
    ];
  const activeAttributesTemplate =
    productState.selectedAttributesTemplates[
      productState.activeAttributesTemplateIndex
    ];

  const { data: activeDetailsTemplateData } = useDetail(
    activeDetailsTemplate?.id || 0
  );
  const { data: activeAttributesTemplateData } = useAttr(
    activeAttributesTemplate?.id || 0
  );

  // Auto-select template images when active template data is loaded
  useEffect(() => {
    const newImages: number[] = [];

    // Check if active details template has images
    if (
      activeDetailsTemplateData?.data?.images &&
      activeDetailsTemplateData.data.images.length > 0
    ) {
      newImages.push(...activeDetailsTemplateData.data.images);
    }

    // Check if active attributes template has images
    if (
      activeAttributesTemplateData?.data?.images &&
      activeAttributesTemplateData.data.images.length > 0
    ) {
      newImages.push(...activeAttributesTemplateData.data.images);
    }

    // Auto-select images that aren't already selected
    if (newImages.length > 0) {
      const currentImages = new Set(productState.selectedImages);
      const imagesToAdd = newImages.filter(
        (imgId) => !currentImages.has(imgId)
      );

      if (imagesToAdd.length > 0) {
        console.log(
          `🖼️ Auto-selecting ${imagesToAdd.length} images from templates:`,
          imagesToAdd
        );
        dispatch(
          setSelectedImages([...productState.selectedImages, ...imagesToAdd])
        );
      }
    }
  }, [
    activeDetailsTemplateData?.data?.images,
    activeAttributesTemplateData?.data?.images,
    // Removed productState.selectedImages from deps to avoid infinite loop
    // We check it inside the effect instead
    dispatch,
  ]);

  // Log when templates change for debugging
  useEffect(() => {
    if (activeDetailsTemplate) {
      console.log(
        `📋 Active details template changed to: ${activeDetailsTemplate.title} (ID: ${activeDetailsTemplate.id})`
      );
    }
  }, [activeDetailsTemplate?.id, activeDetailsTemplate?.title]);

  useEffect(() => {
    if (activeAttributesTemplate) {
      console.log(
        `🏷️ Active attributes template changed to: ${activeAttributesTemplate.title} (ID: ${activeAttributesTemplate.id})`
      );
    }
  }, [activeAttributesTemplate?.id, activeAttributesTemplate?.title]);

  // Validation hooks for product creation
  const activeDetailsValidation = useProductDetailsValidation(
    activeDetailsTemplateData?.data?.data_json as any,
    activeDetailsTemplate?.formData || {}
  );

  // Get validation errors for all templates
  const allAttributesValidationErrors = useMemo(() => {
    const allErrors = getAttributesTemplatesValidationErrors(
      productState.selectedAttributesTemplates
    );

    // Flatten errors for the active template
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeAttributesTemplate?.id
    );

    return activeTemplateErrors?.errors || {};
  }, [productState.selectedAttributesTemplates, activeAttributesTemplate?.id]);

  const productInfoValidation = useProductInfoValidation(
    productState.productTitle,
    productState.productDescription
  );

  // Fetch selected images data to validate product images
  const { data: selectedImagesData } = useSelectedImages(
    productState.selectedImages
  );

  // Reset state on component mount
  useEffect(() => {
    dispatch(resetProduct());
  }, [dispatch]);

  // Update validation errors in store when validation results change
  useEffect(() => {
    // Only show validation error if user has visited the step but hasn't selected any templates
    // or if templates are selected but not properly filled
    let hasDetailsErrors = false;

    if (productState.selectedDetailsTemplates.length === 0) {
      // Only consider it an error if user has passed through details selection step
      const currentStepIndex = Object.values(FormStep).indexOf(
        productState.currentStep
      );
      const detailsFormStepIndex = Object.values(FormStep).indexOf(
        FormStep.DETAILS_FORM
      );
      hasDetailsErrors = currentStepIndex > detailsFormStepIndex;
    } else {
      // If templates are selected, validate them
      hasDetailsErrors = !validateAllDetailsTemplates(
        productState.selectedDetailsTemplates
      );
    }

    dispatch(
      setStepValidationError({
        step: FormStep.DETAILS_FORM,
        hasError: hasDetailsErrors,
      })
    );
  }, [
    productState.selectedDetailsTemplates,
    productState.currentStep,
    dispatch,
  ]);

  useEffect(() => {
    // Only show validation error if user has visited the step but hasn't selected any templates
    // or if templates are selected but not properly filled
    let hasAttributesErrors = false;

    if (productState.selectedAttributesTemplates.length === 0) {
      // Only consider it an error if user has passed through attributes selection step
      const currentStepIndex = Object.values(FormStep).indexOf(
        productState.currentStep
      );
      const attributesFormStepIndex = Object.values(FormStep).indexOf(
        FormStep.ATTRIBUTES_FORM
      );
      hasAttributesErrors = currentStepIndex > attributesFormStepIndex;
    } else {
      // If templates are selected, validate them
      hasAttributesErrors = !validateAllAttributesTemplates(
        productState.selectedAttributesTemplates
      );
    }

    dispatch(
      setStepValidationError({
        step: FormStep.ATTRIBUTES_FORM,
        hasError: hasAttributesErrors,
      })
    );
  }, [
    productState.selectedAttributesTemplates,
    productState.currentStep,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(
      setStepValidationError({
        step: FormStep.PRODUCT_INFO,
        hasError: !productInfoValidation.isValid,
      })
    );
  }, [productInfoValidation.isValid, dispatch]);

  // Image selection validation - at least one product image is required
  useEffect(() => {
    const hasImages = productState.selectedImages.length > 0;
    const hasProductImage =
      selectedImagesData?.data?.list?.some((img) => img.product === true) ||
      false;

    const hasError = !hasImages || !hasProductImage;

    dispatch(
      setStepValidationError({
        step: FormStep.IMAGE_SELECTION,
        hasError,
      })
    );
  }, [productState.selectedImages, selectedImagesData, dispatch]);

  // Load template data when activeDetailsTemplate changes
  useEffect(() => {
    if (
      activeDetailsTemplate &&
      (!activeDetailsTemplate.data ||
        Object.keys(activeDetailsTemplate.data).length === 0)
    ) {
      // Load the template data if it's not already loaded
      console.log(
        "Loading details template data for:",
        activeDetailsTemplate.id
      );
    }
  }, [activeDetailsTemplate]);

  // Load template data when activeAttributesTemplate changes
  useEffect(() => {
    if (
      activeAttributesTemplate &&
      (!activeAttributesTemplate.data ||
        Object.keys(activeAttributesTemplate.data).length === 0)
    ) {
      // Load the template data if it's not already loaded
      console.log(
        "Loading attributes template data for:",
        activeAttributesTemplate.id
      );
    }
  }, [activeAttributesTemplate]);

  // Update template data when query data is available
  useEffect(() => {
    if (
      activeDetailsTemplateData?.data &&
      activeDetailsTemplate &&
      (!activeDetailsTemplate.data ||
        Object.keys(activeDetailsTemplate.data).length === 0)
    ) {
      dispatch(
        updateSelectedTemplateData({
          templateId: activeDetailsTemplate.id,
          data: activeDetailsTemplateData.data.data_json,
          type: "details",
        })
      );
    }
  }, [activeDetailsTemplateData?.data, activeDetailsTemplate?.id, dispatch]);

  // Update attributes template data when query data is available
  useEffect(() => {
    if (
      activeAttributesTemplateData?.data &&
      activeAttributesTemplate &&
      (!activeAttributesTemplate.data ||
        Object.keys(activeAttributesTemplate.data).length === 0)
    ) {
      dispatch(
        updateSelectedTemplateData({
          templateId: activeAttributesTemplate.id,
          data: activeAttributesTemplateData.data.data_json,
          type: "attributes",
        })
      );
    }
  }, [
    activeAttributesTemplateData?.data,
    activeAttributesTemplate?.id,
    dispatch,
  ]);

  // Handle category selection
  const handleCategorySelect = async (category: ICategoryList | null) => {
    setSelectedCategoryLocal(category);

    if (category) {
      dispatch(setSelectedCategory(category.id));
      dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));

      // Load details templates for this category
      try {
        const detailsResult = await detailsMutation.mutateAsync({
          categoryId: category.id,
          skip: 0,
          limit: 100,
        });

        if (detailsResult.status === "true" && detailsResult.data?.list) {
          dispatch(setAvailableDetailsTemplates(detailsResult.data.list));
        }
      } catch (error) {
        console.error("Error loading details templates:", error);
      }
    }
  };

  // Handle details template selection
  const handleDetailsTemplateToggle = async (template: ITemplateList) => {
    const isSelected = productState.selectedDetailsTemplates.some(
      (t) => t.id === template.id
    );

    if (isSelected) {
      dispatch(removeDetailsTemplate(template.id));
    } else {
      // Load template data using the existing hook
      try {
        // We'll use a simpler approach and fetch template data when needed
        // For now, add template with empty data and load it when the form is displayed
        dispatch(
          addDetailsTemplate({
            template,
            data: {} as any, // This will be populated when the template is selected in the form
          })
        );
      } catch (error) {
        console.error("Error loading template data:", error);
      }
    }
  };

  // Handle attributes template selection
  const handleAttributesTemplateToggle = async (template: ITemplateList) => {
    const isSelected = productState.selectedAttributesTemplates.some(
      (t) => t.id === template.id
    );

    if (isSelected) {
      dispatch(removeAttributesTemplate(template.id));
    } else {
      // Load template data using the existing hook
      try {
        // We'll use a simpler approach and fetch template data when needed
        // For now, add template with empty data and load it when the form is displayed
        dispatch(
          addAttributesTemplate({
            template,
            data: {} as any, // This will be populated when the template is selected in the form
          })
        );
      } catch (error) {
        console.error("Error loading template data:", error);
      }
    }
  };

  // Handle step navigation
  const handleNextFromDetailsSelection = async () => {
    // Always allow going to next step, regardless of selection
    if (productState.selectedDetailsTemplates.length > 0) {
      dispatch(setCurrentStep(FormStep.DETAILS_FORM));
    } else {
      // Skip to attributes selection if no details templates selected
      // Load attributes templates for the category first
      if (productState.selectedCategoryId) {
        try {
          const attributesResult = await attributesMutation.mutateAsync({
            categoryId: productState.selectedCategoryId,
            skip: 0,
            limit: 100,
          });

          if (
            attributesResult.status === "true" &&
            attributesResult.data?.list
          ) {
            dispatch(
              setAvailableAttributesTemplates(attributesResult.data.list)
            );
          }
        } catch (error) {
          console.error("Error loading attributes templates:", error);
        }
      }
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
    }
  };

  const handleNextFromDetailsForm = async () => {
    // Load attributes templates for the category
    if (productState.selectedCategoryId) {
      try {
        const attributesResult = await attributesMutation.mutateAsync({
          categoryId: productState.selectedCategoryId,
          skip: 0,
          limit: 100,
        });

        if (attributesResult.status === "true" && attributesResult.data?.list) {
          dispatch(setAvailableAttributesTemplates(attributesResult.data.list));
          dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
        }
      } catch (error) {
        console.error("Error loading attributes templates:", error);
      }
    }
  };

  const handleNextFromAttributesSelection = () => {
    // Always allow going to next step, regardless of selection
    // If no templates selected, the form step will be skipped to image selection
    if (productState.selectedAttributesTemplates.length > 0) {
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_FORM));
    } else {
      // Skip to image selection if no attributes templates selected
      dispatch(setCurrentStep(FormStep.IMAGE_SELECTION));
    }
  };

  const handleNextFromAttributesForm = () => {
    dispatch(setCurrentStep(FormStep.IMAGE_SELECTION));
  };

  const handleNextFromImageSelection = () => {
    dispatch(setCurrentStep(FormStep.PRODUCT_INFO));
  };

  const handleBackToDetailsSelection = () => {
    dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));
  };

  const handleBackToDetailsForm = () => {
    dispatch(setCurrentStep(FormStep.DETAILS_FORM));
  };

  const handleBackToAttributesSelection = () => {
    dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
  };

  const handleBackToAttributesForm = () => {
    dispatch(setCurrentStep(FormStep.ATTRIBUTES_FORM));
  };

  const handleBackToImageSelection = () => {
    dispatch(setCurrentStep(FormStep.IMAGE_SELECTION));
  };

  // Handle image selection
  const handleImageSelectionChange = (selectedIds: number[]) => {
    dispatch(setSelectedImages(selectedIds));
  };

  const handleBackFromImageSelection = () => {
    // Go back to the appropriate step
    if (productState.selectedAttributesTemplates.length > 0) {
      // If attributes templates are selected, go back to attributes form
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_FORM));
    } else {
      // If no attributes templates, go back to attributes selection
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
    }
  };

  const handleBackToCategorySelection = () => {
    dispatch(setCurrentStep(FormStep.CATEGORY_SELECTION));
  };

  const handleBackToDetailsSelectionFromAttributes = () => {
    dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));
  };

  // Handle form submissions
  const handleCreateProduct = async () => {
    try {
      setIsSubmitting(true);

      // Build the final product data with form values (not just template data)
      // This mirrors the logic in generateFinalProductData
      const detailsList = productState.selectedDetailsTemplates.map(
        (template) => {
          const finalData = JSON.parse(JSON.stringify(template.data));
          const formData = template.formData;

          // Apply form data to details structure
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

          // Update bind selections - this is critical
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

            // Update text field values (IStringField type fields like brand_model, color_pattern, warranty, etc.)
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

      // Process attributes
      const attributesList = productState.selectedAttributesTemplates.map(
        (template) => {
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

                  // Check if field exists in formData (even if empty string)
                  const hasFormValue = attr.id in formData;

                  if (hasFormValue) {
                    switch (attr.type) {
                      case "input":
                        // Set value even if empty string
                        attr.value =
                          formValue !== null && formValue !== undefined
                            ? formValue.toString()
                            : "";
                        break;
                      case "text":
                        // Set value even if empty string
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
                  // If field not in formData, preserve original template value
                });
              }
            );
          }

          return finalData;
        }
      );

      const finalProductData = {
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

      // Save product to server
      const response = await saveProduct(finalProductData as any);

      // Check both status and ApiStatus.SUCCEEDED
      if (response?.status === "true") {
        enqueueSnackbar("محصول با موفقیت ذخیره شد", {
          variant: "success",
        });
        // Show result page after a short delay
        setTimeout(() => {
          setShowResultPage(true);
          setIsSubmitting(false);
        }, 500);
      } else {
        enqueueSnackbar("خطا در ذخیره محصول", { variant: "error" });
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "خطا در ذخیره محصول";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setIsSubmitting(false);
    }
  };

  // Get all attributes data from selected templates for title builder
  const getAllAttributesData = useMemo(() => {
    return productState.selectedAttributesTemplates
      .filter(
        (template) => template.data && Object.keys(template.data).length > 0
      )
      .map((template) => template.data)
      .filter((data): data is ICategoryAttr => {
        // Type guard to ensure we only get ICategoryAttr types
        return "category_group_attributes" in data;
      });
  }, [productState.selectedAttributesTemplates]);

  // Get all details data from selected templates for title builder
  const getAllDetailsData = useMemo(() => {
    return productState.selectedDetailsTemplates
      .filter(
        (template) => template.data && Object.keys(template.data).length > 0
      )
      .map((template) => template.data)
      .filter((data): data is ICategoryDetails => {
        // Type guard to ensure we only get ICategoryDetails types
        return "bind" in data;
      });
  }, [productState.selectedDetailsTemplates]);

  // Render current step
  const renderCurrentStep = () => {
    const stepContent = (() => {
      switch (productState.currentStep) {
        case FormStep.CATEGORY_SELECTION:
          return (
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              loadingCategories={categoriesLoading}
              onCategoryChange={handleCategorySelect}
              onSearchChange={setCategorySearch}
              suggestedCategories={suggestedCategories}
              loadingSuggestions={categoriesLoading}
            />
          );

        case FormStep.DETAILS_SELECTION:
          return (
            <TemplateSelection
              title="انتخاب قالب‌های اطلاعات"
              availableTemplates={productState.availableDetailsTemplates}
              selectedTemplateIds={productState.selectedDetailsTemplates.map(
                (t) => t.id
              )}
              onTemplateToggle={handleDetailsTemplateToggle}
              onNext={handleNextFromDetailsSelection}
              onBack={handleBackToCategorySelection}
              isLoading={detailsMutation.isPending || isSubmitting}
            />
          );

        case FormStep.DETAILS_FORM:
          return (
            <TemplateForms
              title="تکمیل فرم‌های اطلاعات"
              selectedTemplates={productState.selectedDetailsTemplates}
              activeTemplateIndex={productState.activeDetailsTemplateIndex}
              onTabChange={(index) =>
                dispatch(setActiveDetailsTemplateIndex(index))
              }
              onRemoveTemplate={(id) => dispatch(removeDetailsTemplate(id))}
              onNext={handleNextFromDetailsForm}
              onBack={handleBackToDetailsSelection}
            >
              {activeDetailsTemplate && activeDetailsTemplateData?.data && (
                <Grid container spacing={2}>
                  <ProductDetailsForm
                    data={activeDetailsTemplateData.data.data_json}
                    formData={activeDetailsTemplate.formData}
                    onFormDataChange={(fieldName: string, value: any) =>
                      dispatch(
                        updateDetailsTemplateFormData({
                          templateIndex:
                            productState.activeDetailsTemplateIndex,
                          fieldName,
                          value,
                        })
                      )
                    }
                    validationErrors={activeDetailsValidation.errors}
                  />
                </Grid>
              )}
            </TemplateForms>
          );

        case FormStep.ATTRIBUTES_SELECTION:
          return (
            <TemplateSelection
              title="انتخاب قالب‌های ویژگی"
              availableTemplates={productState.availableAttributesTemplates}
              selectedTemplateIds={productState.selectedAttributesTemplates.map(
                (t) => t.id
              )}
              onTemplateToggle={handleAttributesTemplateToggle}
              onNext={handleNextFromAttributesSelection}
              onBack={handleBackToDetailsSelectionFromAttributes}
              isLoading={attributesMutation.isPending || isSubmitting}
            />
          );

        case FormStep.ATTRIBUTES_FORM:
          return (
            <TemplateForms
              title="تکمیل فرم‌های ویژگی"
              selectedTemplates={productState.selectedAttributesTemplates}
              activeTemplateIndex={productState.activeAttributesTemplateIndex}
              onTabChange={(index) =>
                dispatch(setActiveAttributesTemplateIndex(index))
              }
              onRemoveTemplate={(id) => dispatch(removeAttributesTemplate(id))}
              onNext={handleNextFromAttributesForm}
              onBack={handleBackToAttributesSelection}
            >
              {activeAttributesTemplate &&
                activeAttributesTemplateData?.data && (
                  <ProductAttributesForm
                    data={activeAttributesTemplateData.data.data_json}
                    formData={activeAttributesTemplate.formData}
                    onFormDataChange={(fieldId: number | string, value: any) =>
                      dispatch(
                        updateAttributesTemplateFormData({
                          templateIndex:
                            productState.activeAttributesTemplateIndex,
                          fieldId:
                            typeof fieldId === "string"
                              ? fieldId
                              : fieldId.toString(),
                          value,
                        })
                      )
                    }
                    validationErrors={allAttributesValidationErrors}
                  />
                )}
            </TemplateForms>
          );

        case FormStep.IMAGE_SELECTION:
          return (
            <ProductImageSelection
              selectedImages={productState.selectedImages}
              onImageSelectionChange={handleImageSelectionChange}
              onNext={handleNextFromImageSelection}
              onBack={handleBackFromImageSelection}
            />
          );

        case FormStep.PRODUCT_INFO:
          return (
            <ProductInfoForm
              title={productState.productTitle}
              description={productState.productDescription}
              onTitleChange={(title) => dispatch(setProductTitle(title))}
              onDescriptionChange={(description) =>
                dispatch(setProductDescription(description))
              }
              onSubmit={handleCreateProduct}
              onBack={handleBackToImageSelection}
              hasValidationErrors={!productInfoValidation.isValid}
              isSubmitting={isSubmitting}
              stepValidationErrors={productState.stepValidationErrors}
              attributesData={getAllAttributesData}
              detailsData={getAllDetailsData}
            />
          );

        default:
          return null;
      }
    })();

    // Wrap content with a disabled overlay if submitting
    return (
      <Box
        sx={{
          opacity: isSubmitting ? 0.5 : 1,
          pointerEvents: isSubmitting ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        {stepContent}
      </Box>
    );
  };

  return (
    <Layout title="افزودن محصول جدید">
      <Container maxWidth="lg">
        <Box sx={{ p: 3 }}>
          {showResultPage ? (
            <ResultPage />
          ) : (
            <>
              <TitleCard
                title="ایجاد محصول جدید"
                description="محصول جدید را بر اساس قالب‌های انتخاب شده ایجاد کنید."
              />
              <FormSteps
                currentStep={productState.currentStep}
                stepValidationErrors={productState.stepValidationErrors}
              />

              {renderCurrentStep()}

              {productState.finalProductData && !isSubmitting && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    محصول با موفقیت ایجاد شد! داده‌های نهایی در کنسول مرورگر
                    قابل مشاهده است.
                  </Typography>
                </Alert>
              )}

              {/* Backdrop overlay when submitting */}
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isSubmitting}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      در حال ذخیره محصول...
                    </Typography>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        border: "4px solid rgba(0, 0, 0, 0.1)",
                        borderTop: "4px solid #1976d2",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  </Paper>
                </Box>
              </Backdrop>
              <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            </>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default NewProductPage;
