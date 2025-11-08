import React, { useState, useEffect, useMemo } from "react";
import { Typography, Box, Paper, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
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
  generateFinalProductData,
  resetProduct,
  setStepValidationError,
} from "~/store/slices/productSlice";
import { useCategoriesList } from "~/api/categories.api";
import { useDetails, useDetail } from "~/api/details.api";
import { useAttrs, useAttr } from "~/api/attributes.api";
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

const NewProductPage = () => {
  const dispatch = useDispatch();
  const productState = useSelector((state: RootState) => state.product);

  // Local state for category management
  const [categorySearch, setCategorySearch] = useState("");
  const [imageOptions, setImageOptions] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategoryLocal] =
    useState<ICategoryList | null>(null);

  // Category queries
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesList(categorySearch, 1, 50);

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

    // Debug logging
    console.log("🔍 All attributes validation errors:", allErrors);

    // Flatten errors for the active template
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeAttributesTemplate?.id
    );

    console.log("🔍 Active template errors:", activeTemplateErrors);

    return activeTemplateErrors?.errors || {};
  }, [productState.selectedAttributesTemplates, activeAttributesTemplate?.id]);

  const productInfoValidation = useProductInfoValidation(
    productState.productTitle,
    productState.productDescription
  );

  // Set image options
  useEffect(() => {
    if (
      activeAttributesTemplateData?.data?.images ||
      activeDetailsTemplateData?.data?.images
    ) {
      const allImages = [
        ...(activeAttributesTemplateData?.data?.images || []),
        ...(activeDetailsTemplateData?.data?.images || []),
      ];
      setImageOptions((prev) => {
        const newImages = allImages.filter((image) => !prev.includes(image));
        return [...prev, ...newImages];
      });
    }
  }, [activeAttributesTemplateData, activeDetailsTemplateData]);

  // Update validation errors in store when validation results change
  // Reset state on component mount
  useEffect(() => {
    dispatch(resetProduct());
    setImageOptions([]); // Reset local image options
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

  // Image selection validation
  useEffect(() => {
    // Image selection is optional, so no validation required
    dispatch(
      setStepValidationError({
        step: FormStep.IMAGE_SELECTION,
        hasError: false,
      })
    );
  }, [dispatch]);

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
      // Reset image options when category changes
      setImageOptions([]);

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
  const handleCreateProduct = () => {
    dispatch(generateFinalProductData());

    if (productState.finalProductData) {
      console.log("🎉 Product created successfully!");
      console.log(
        "📋 Final product data:",
        JSON.stringify(productState.finalProductData, null, 2)
      );
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
    switch (productState.currentStep) {
      case FormStep.CATEGORY_SELECTION:
        return (
          <CategorySelector
            categories={categoriesData?.data?.items || []}
            selectedCategory={selectedCategory}
            loadingCategories={categoriesLoading}
            onCategoryChange={handleCategorySelect}
            onSearchChange={setCategorySearch}
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
            isLoading={detailsMutation.isPending}
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
              <ProductDetailsForm
                data={activeDetailsTemplateData.data.data_json}
                formData={activeDetailsTemplate.formData}
                onFormDataChange={(fieldName: string, value: any) =>
                  dispatch(
                    updateDetailsTemplateFormData({
                      templateIndex: productState.activeDetailsTemplateIndex,
                      fieldName,
                      value,
                    })
                  )
                }
                validationErrors={activeDetailsValidation.errors}
              />
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
            isLoading={attributesMutation.isPending}
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
            {activeAttributesTemplate && activeAttributesTemplateData?.data && (
              <ProductAttributesForm
                data={activeAttributesTemplateData.data.data_json}
                formData={activeAttributesTemplate.formData}
                onFormDataChange={(fieldId: number, value: any) =>
                  dispatch(
                    updateAttributesTemplateFormData({
                      templateIndex: productState.activeAttributesTemplateIndex,
                      fieldId: fieldId.toString(),
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
            imageOptions={imageOptions}
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
            stepValidationErrors={productState.stepValidationErrors}
            attributesData={getAllAttributesData}
            detailsData={getAllDetailsData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout title="افزودن محصول جدید">
      <Box sx={{ p: 3 }}>
        <TitleCard
          title="ایجاد محصول جدید"
          description="محصول جدید را بر اساس قالب‌های انتخاب شده ایجاد کنید."
        />
        <FormSteps
          currentStep={productState.currentStep}
          stepValidationErrors={productState.stepValidationErrors}
        />

        {renderCurrentStep()}

        {productState.finalProductData && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="body2">
              محصول با موفقیت ایجاد شد! داده‌های نهایی در کنسول مرورگر قابل
              مشاهده است.
            </Typography>
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default NewProductPage;
