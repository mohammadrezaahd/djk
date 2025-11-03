import React, { useState, useEffect } from "react";
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
  updateSelectedTemplateData,
  generateFinalProductData,
  resetProduct,
} from "~/store/slices/productSlice";
import { useCategoriesList } from "~/api/categories.api";
import { useDetails, useDetail } from "~/api/details.api";
import { useAttrs, useAttr } from "~/api/attributes.api";
import Layout from "~/components/layout/Layout";
import CategorySelector from "~/components/templates/CategorySelector";
import {
  FormSteps,
  TemplateSelection,
  TemplateForms,
  ProductInfoForm,
  ProductDetailsForm,
  ProductAttributesForm,
} from "~/components/products";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { ITemplateList } from "~/types/interfaces/templates.interface";

const NewProductPage = () => {
  const dispatch = useDispatch();
  const productState = useSelector((state: RootState) => state.product);
  
  // Local state for category management
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategoryLocal] = useState<ICategoryList | null>(null);
  
  // Category queries
  const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesList(
    categorySearch,
    1,
    50
  );
  
  // Details and attributes mutations
  const detailsMutation = useDetails();
  const attributesMutation = useAttrs();
  
  // Template data hooks
  const activeDetailsTemplate = productState.selectedDetailsTemplates[productState.activeDetailsTemplateIndex];
  const activeAttributesTemplate = productState.selectedAttributesTemplates[productState.activeAttributesTemplateIndex];
  
  const { data: activeDetailsTemplateData } = useDetail(
    activeDetailsTemplate?.id || 0
  );
  
  const { data: activeAttributesTemplateData } = useAttr(
    activeAttributesTemplate?.id || 0
  );

  // Reset state on component mount
  useEffect(() => {
    dispatch(resetProduct());
  }, [dispatch]);

  // Load template data when activeDetailsTemplate changes
  useEffect(() => {
    if (activeDetailsTemplate && (!activeDetailsTemplate.data || Object.keys(activeDetailsTemplate.data).length === 0)) {
      // Load the template data if it's not already loaded
      console.log("Loading details template data for:", activeDetailsTemplate.id);
    }
  }, [activeDetailsTemplate]);

  // Load template data when activeAttributesTemplate changes
  useEffect(() => {
    if (activeAttributesTemplate && (!activeAttributesTemplate.data || Object.keys(activeAttributesTemplate.data).length === 0)) {
      // Load the template data if it's not already loaded
      console.log("Loading attributes template data for:", activeAttributesTemplate.id);
    }
  }, [activeAttributesTemplate]);

  // Update template data when query data is available
  useEffect(() => {
    if (activeDetailsTemplateData?.data && activeDetailsTemplate && 
        (!activeDetailsTemplate.data || Object.keys(activeDetailsTemplate.data).length === 0)) {
      dispatch(updateSelectedTemplateData({
        templateId: activeDetailsTemplate.id,
        data: activeDetailsTemplateData.data.data_json,
        type: 'details'
      }));
    }
  }, [activeDetailsTemplateData?.data, activeDetailsTemplate?.id, dispatch]);

  // Update attributes template data when query data is available
  useEffect(() => {
    if (activeAttributesTemplateData?.data && activeAttributesTemplate &&
        (!activeAttributesTemplate.data || Object.keys(activeAttributesTemplate.data).length === 0)) {
      dispatch(updateSelectedTemplateData({
        templateId: activeAttributesTemplate.id,
        data: activeAttributesTemplateData.data.data_json,
        type: 'attributes'
      }));
    }
  }, [activeAttributesTemplateData?.data, activeAttributesTemplate?.id, dispatch]);

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
    const isSelected = productState.selectedDetailsTemplates.some(t => t.id === template.id);
    
    if (isSelected) {
      dispatch(removeDetailsTemplate(template.id));
    } else {
      // Load template data using the existing hook
      try {
        // We'll use a simpler approach and fetch template data when needed
        // For now, add template with empty data and load it when the form is displayed
        dispatch(addDetailsTemplate({
          template,
          data: {} as any // This will be populated when the template is selected in the form
        }));
      } catch (error) {
        console.error("Error loading template data:", error);
      }
    }
  };

  // Handle attributes template selection
  const handleAttributesTemplateToggle = async (template: ITemplateList) => {
    const isSelected = productState.selectedAttributesTemplates.some(t => t.id === template.id);
    
    if (isSelected) {
      dispatch(removeAttributesTemplate(template.id));
    } else {
      // Load template data using the existing hook
      try {
        // We'll use a simpler approach and fetch template data when needed
        // For now, add template with empty data and load it when the form is displayed
        dispatch(addAttributesTemplate({
          template,
          data: {} as any // This will be populated when the template is selected in the form
        }));
      } catch (error) {
        console.error("Error loading template data:", error);
      }
    }
  };

  // Handle step navigation
  const handleNextFromDetailsSelection = () => {
    if (productState.selectedDetailsTemplates.length > 0) {
      dispatch(setCurrentStep(FormStep.DETAILS_FORM));
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
    if (productState.selectedAttributesTemplates.length > 0) {
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_FORM));
    }
  };

  const handleNextFromAttributesForm = () => {
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

  // Handle form submissions
  const handleCreateProduct = () => {
    dispatch(generateFinalProductData());
    
    if (productState.finalProductData) {
      console.log("🎉 Product created successfully!");
      console.log("📋 Final product data:", JSON.stringify(productState.finalProductData, null, 2));
    }
  };

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
            selectedTemplateIds={productState.selectedDetailsTemplates.map(t => t.id)}
            onTemplateToggle={handleDetailsTemplateToggle}
            onNext={handleNextFromDetailsSelection}
            isLoading={detailsMutation.isPending}
          />
        );

      case FormStep.DETAILS_FORM:
        return (
          <TemplateForms
            title="تکمیل فرم‌های اطلاعات"
            selectedTemplates={productState.selectedDetailsTemplates}
            activeTemplateIndex={productState.activeDetailsTemplateIndex}
            onTabChange={(index) => dispatch(setActiveDetailsTemplateIndex(index))}
            onRemoveTemplate={(id) => dispatch(removeDetailsTemplate(id))}
            onNext={handleNextFromDetailsForm}
            onBack={handleBackToDetailsSelection}
          >
            {activeDetailsTemplate && activeDetailsTemplateData?.data && (
              <ProductDetailsForm
                data={activeDetailsTemplateData.data.data_json}
                formData={activeDetailsTemplate.formData}
                onFormDataChange={(fieldName: string, value: any) =>
                  dispatch(updateDetailsTemplateFormData({
                    templateIndex: productState.activeDetailsTemplateIndex,
                    fieldName,
                    value
                  }))
                }
              />
            )}
          </TemplateForms>
        );

      case FormStep.ATTRIBUTES_SELECTION:
        return (
          <TemplateSelection
            title="انتخاب قالب‌های ویژگی"
            availableTemplates={productState.availableAttributesTemplates}
            selectedTemplateIds={productState.selectedAttributesTemplates.map(t => t.id)}
            onTemplateToggle={handleAttributesTemplateToggle}
            onNext={handleNextFromAttributesSelection}
            isLoading={attributesMutation.isPending}
          />
        );

      case FormStep.ATTRIBUTES_FORM:
        return (
          <TemplateForms
            title="تکمیل فرم‌های ویژگی"
            selectedTemplates={productState.selectedAttributesTemplates}
            activeTemplateIndex={productState.activeAttributesTemplateIndex}
            onTabChange={(index) => dispatch(setActiveAttributesTemplateIndex(index))}
            onRemoveTemplate={(id) => dispatch(removeAttributesTemplate(id))}
            onNext={handleNextFromAttributesForm}
            onBack={handleBackToAttributesSelection}
          >
            {activeAttributesTemplate && activeAttributesTemplateData?.data && (
              <ProductAttributesForm
                data={activeAttributesTemplateData.data.data_json}
                formData={activeAttributesTemplate.formData}
                onFormDataChange={(fieldId: number, value: any) =>
                  dispatch(updateAttributesTemplateFormData({
                    templateIndex: productState.activeAttributesTemplateIndex,
                    fieldId: fieldId.toString(),
                    value
                  }))
                }
              />
            )}
          </TemplateForms>
        );

      case FormStep.PRODUCT_INFO:
        return (
          <ProductInfoForm
            title={productState.productTitle}
            description={productState.productDescription}
            onTitleChange={(title) => dispatch(setProductTitle(title))}
            onDescriptionChange={(description) => dispatch(setProductDescription(description))}
            onSubmit={handleCreateProduct}
            onBack={handleBackToAttributesForm}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout title="افزودن محصول جدید">
      <Box sx={{ p: 3 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            ایجاد محصول جدید
          </Typography>
          <Typography variant="body1" color="text.secondary">
            محصول جدید را بر اساس قالب‌های انتخاب شده ایجاد کنید.
          </Typography>
        </Paper>

        <FormSteps currentStep={productState.currentStep} />

        {renderCurrentStep()}

        {productState.finalProductData && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="body2">
              محصول با موفقیت ایجاد شد! داده‌های نهایی در کنسول مرورگر قابل مشاهده است.
            </Typography>
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default NewProductPage;
