import React, { useMemo } from "react";
import { Typography, Box, Paper, Alert, Backdrop } from "@mui/material";
import { useProductForm } from "~/hooks/useProductForm";
import { FormStep } from "~/store/slices/productSlice";
import Layout from "~/components/layout/Layout";
import { TitleCard } from "~/components/common";
import { FormSteps } from "~/components/products";
import ResultPage from "~/components/products/ResultPage";
import CategorySelectionStep from "~/components/products/new/CategorySelectionStep";
import DetailsSelectionStep from "~/components/products/new/DetailsSelectionStep";
import DetailsFormStep from "~/components/products/new/DetailsFormStep";
import AttributesSelectionStep from "~/components/products/new/AttributesSelectionStep";
import AttributesFormStep from "~/components/products/new/AttributesFormStep";
import ImageSelectionStep from "~/components/products/new/ImageSelectionStep";
import ProductInfoStep from "~/components/products/new/ProductInfoStep";
import { generateFinalProductData } from "~/utils/productDataService";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import {
  setProductTitle,
  setProductDescription,
  updateDetailsTemplateFormData,
  setActiveDetailsTemplateIndex,
  removeDetailsTemplate,
  removeAttributesTemplate,
  setActiveAttributesTemplateIndex,
  updateAttributesTemplateFormData,
} from "~/store/slices/productSlice";

export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

const NewProductPage = () => {
  const {
    productState,
    isSubmitting,
    showResultPage,
    categorySearch,
    selectedCategory,
    categoriesData,
    categoriesLoading,
    detailsMutation,
    attributesMutation,
    activeDetailsTemplate,
    activeDetailsTemplateData,
    activeAttributesTemplate,
    activeAttributesTemplateData,
    activeDetailsValidation,
    allAttributesValidationErrors,
    productInfoValidation,
    setCategorySearch,
    handleCategorySelect,
    handleDetailsTemplateToggle,
    handleAttributesTemplateToggle,
    handleNextFromDetailsSelection,
    handleNextFromDetailsForm,
    handleNextFromAttributesSelection,
    handleNextFromAttributesForm,
    handleNextFromImageSelection,
    handleImageSelectionChange,
    handleBackToCategorySelection,
    handleBackToDetailsSelection,
    handleBackToDetailsForm,
    handleBackToAttributesSelection,
    handleBackToAttributesForm,
    handleBackToImageSelection,
    handleBackFromImageSelection,
    handleBackToDetailsSelectionFromAttributes,
    handleCreateProduct,
    dispatch,
  } = useProductForm();

  const getAllAttributesData = useMemo(() => {
    return productState.selectedAttributesTemplates
      .filter(
        (template) => template.data && Object.keys(template.data).length > 0
      )
      .map((template) => template.data)
      .filter((data): data is ICategoryAttr => {
        return "category_group_attributes" in data;
      });
  }, [productState.selectedAttributesTemplates]);

  const getAllDetailsData = useMemo(() => {
    return productState.selectedDetailsTemplates
      .filter(
        (template) => template.data && Object.keys(template.data).length > 0
      )
      .map((template) => template.data)
      .filter((data): data is ICategoryDetails => {
        return "bind" in data;
      });
  }, [productState.selectedDetailsTemplates]);

  const handleSubmit = () => {
    const finalData = generateFinalProductData(productState);
    handleCreateProduct(finalData);
  };

  const renderCurrentStep = () => {
    switch (productState.currentStep) {
      case FormStep.CATEGORY_SELECTION:
        return (
          <CategorySelectionStep
            categories={categoriesData?.data?.items || []}
            selectedCategory={selectedCategory}
            loadingCategories={categoriesLoading}
            onCategoryChange={handleCategorySelect}
            onSearchChange={setCategorySearch}
          />
        );
      case FormStep.DETAILS_SELECTION:
        return (
          <DetailsSelectionStep
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
          <DetailsFormStep
            selectedTemplates={productState.selectedDetailsTemplates}
            activeTemplateIndex={productState.activeDetailsTemplateIndex}
            onTabChange={(index) =>
              dispatch(setActiveDetailsTemplateIndex(index))
            }
            onRemoveTemplate={(id) => dispatch(removeDetailsTemplate(id))}
            onNext={handleNextFromDetailsForm}
            onBack={handleBackToDetailsSelection}
            activeDetailsTemplateData={activeDetailsTemplateData}
            activeDetailsTemplate={activeDetailsTemplate}
            updateDetailsTemplateFormData={(payload) =>
              dispatch(updateDetailsTemplateFormData(payload))
            }
            validationErrors={activeDetailsValidation.errors}
            productState={productState}
          />
        );
      case FormStep.ATTRIBUTES_SELECTION:
        return (
          <AttributesSelectionStep
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
          <AttributesFormStep
            selectedTemplates={productState.selectedAttributesTemplates}
            activeTemplateIndex={productState.activeAttributesTemplateIndex}
            onTabChange={(index) =>
              dispatch(setActiveAttributesTemplateIndex(index))
            }
            onRemoveTemplate={(id) => dispatch(removeAttributesTemplate(id))}
            onNext={handleNextFromAttributesForm}
            onBack={handleBackToAttributesSelection}
            activeAttributesTemplateData={activeAttributesTemplateData}
            activeAttributesTemplate={activeAttributesTemplate}
            updateAttributesTemplateFormData={(payload) =>
              dispatch(updateAttributesTemplateFormData(payload))
            }
            validationErrors={allAttributesValidationErrors}
            productState={productState}
          />
        );
      case FormStep.IMAGE_SELECTION:
        return (
          <ImageSelectionStep
            selectedImages={productState.selectedImages}
            onImageSelectionChange={handleImageSelectionChange}
            onNext={handleNextFromImageSelection}
            onBack={handleBackFromImageSelection}
          />
        );
      case FormStep.PRODUCT_INFO:
        return (
          <ProductInfoStep
            title={productState.productTitle}
            description={productState.productDescription}
            onTitleChange={(title) => dispatch(setProductTitle(title))}
            onDescriptionChange={(description) =>
              dispatch(setProductDescription(description))
            }
            onSubmit={handleSubmit}
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
  };

  return (
    <Layout title="افزودن محصول جدید">
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
            <Box
              sx={{
                opacity: isSubmitting ? 0.5 : 1,
                pointerEvents: isSubmitting ? "none" : "auto",
                transition: "opacity 0.3s ease",
              }}
            >
              {renderCurrentStep()}
            </Box>
            {productState.finalProductData && !isSubmitting && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  محصول با موفقیت ایجاد شد! داده‌های نهایی در کنسول مرورگر قابل
                  مشاهده است.
                </Typography>
              </Alert>
            )}
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
    </Layout>
  );
};

export default NewProductPage;
