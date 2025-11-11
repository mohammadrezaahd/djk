import React, { useState, useEffect, useMemo } from "react";
import { Typography, Box, Paper, Alert, Backdrop } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
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
import { useProductInfoValidation } from "~/validation";
import Layout from "~/components/layout/Layout";
import { FormSteps } from "~/components/products";
import {
  createDetailsSchema,
  createAttributesSchema,
} from "~/validation/schemas/productSchema";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import { TitleCard } from "~/components/common";
import { useAddProduct } from "~/api/product.api";
import ResultPage from "~/components/products/ResultPage";
import CategorySelectionStep from "~/components/products/steps/CategorySelectionStep";
import DetailsSelectionStep from "~/components/products/steps/DetailsSelectionStep";
import DetailsFormStep from "~/components/products/steps/DetailsFormStep";
import AttributesSelectionStep from "~/components/products/steps/AttributesSelectionStep";
import AttributesFormStep from "~/components/products/steps/AttributesFormStep";
import ImageSelectionStep from "~/components/products/steps/ImageSelectionStep";
import ProductInfoStep from "~/components/products/steps/ProductInfoStep";


export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

const NewProductPage = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const productState = useSelector((state: RootState) => state.product);

  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategoryLocal] = useState<ICategoryList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesList(categorySearch, 1, 50);
  const { mutateAsync: saveProduct } = useAddProduct();
  const detailsMutation = useDetails();
  const attributesMutation = useAttrs();

  const activeDetailsTemplate = productState.selectedDetailsTemplates[productState.activeDetailsTemplateIndex];
  const activeAttributesTemplate = productState.selectedAttributesTemplates[productState.activeAttributesTemplateIndex];

  const { data: activeDetailsTemplateData } = useDetail(activeDetailsTemplate?.id || 0);
  const { data: activeAttributesTemplateData } = useAttr(activeAttributesTemplate?.id || 0);

  const productInfoValidation = useProductInfoValidation(productState.productTitle, productState.productDescription);
  const { data: selectedImagesData } = useSelectedImages(productState.selectedImages);

  useEffect(() => {
    dispatch(resetProduct());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setStepValidationError({ step: FormStep.PRODUCT_INFO, hasError: !productInfoValidation.isValid }));
  }, [productInfoValidation.isValid, dispatch]);

  useEffect(() => {
    const hasImages = productState.selectedImages.length > 0;
    const hasProductImage = selectedImagesData?.data?.list?.some((img) => img.product === true) || false;
    dispatch(setStepValidationError({ step: FormStep.IMAGE_SELECTION, hasError: !hasImages || !hasProductImage }));
  }, [productState.selectedImages, selectedImagesData, dispatch]);

  useEffect(() => {
    if (activeDetailsTemplateData?.data && activeDetailsTemplate && (!activeDetailsTemplate.data || Object.keys(activeDetailsTemplate.data).length === 0)) {
      dispatch(updateSelectedTemplateData({ templateId: activeDetailsTemplate.id, data: activeDetailsTemplateData.data.data_json, type: "details" }));
    }
  }, [activeDetailsTemplateData?.data, activeDetailsTemplate?.id, dispatch]);

  useEffect(() => {
    if (activeAttributesTemplateData?.data && activeAttributesTemplate && (!activeAttributesTemplate.data || Object.keys(activeAttributesTemplate.data).length === 0)) {
      dispatch(updateSelectedTemplateData({ templateId: activeAttributesTemplate.id, data: activeAttributesTemplateData.data.data_json, type: "attributes" }));
    }
  }, [activeAttributesTemplateData?.data, activeAttributesTemplate?.id, dispatch]);

  const handleCategorySelect = async (category: ICategoryList | null) => {
    setSelectedCategoryLocal(category);
    if (category) {
      dispatch(setSelectedCategory(category.id));
      dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));
      try {
        const detailsResult = await detailsMutation.mutateAsync({ categoryId: category.id, skip: 0, limit: 100 });
        if (detailsResult.status === "true" && detailsResult.data?.list) {
          dispatch(setAvailableDetailsTemplates(detailsResult.data.list));
        }
      } catch (error) {
        console.error("Error loading details templates:", error);
      }
    }
  };

  const handleDetailsTemplateToggle = async (template: ITemplateList) => {
    const isSelected = productState.selectedDetailsTemplates.some((t) => t.id === template.id);
    if (isSelected) {
      dispatch(removeDetailsTemplate(template.id));
    } else {
      dispatch(addDetailsTemplate({ template, data: {} as any }));
    }
  };

  const handleAttributesTemplateToggle = async (template: ITemplateList) => {
    const isSelected = productState.selectedAttributesTemplates.some((t) => t.id === template.id);
    if (isSelected) {
      dispatch(removeAttributesTemplate(template.id));
    } else {
      dispatch(addAttributesTemplate({ template, data: {} as any }));
    }
  };

  const handleNextFromDetailsSelection = async () => {
    if (productState.selectedDetailsTemplates.length > 0) {
      dispatch(setCurrentStep(FormStep.DETAILS_FORM));
    } else {
      if (productState.selectedCategoryId) {
        try {
          const attributesResult = await attributesMutation.mutateAsync({ categoryId: productState.selectedCategoryId, skip: 0, limit: 100 });
          if (attributesResult.status === "true" && attributesResult.data?.list) {
            dispatch(setAvailableAttributesTemplates(attributesResult.data.list));
          }
        } catch (error) {
          console.error("Error loading attributes templates:", error);
        }
      }
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
    }
  };

  const handleNextFromDetailsForm = async () => {
    if (productState.selectedCategoryId) {
      try {
        const attributesResult = await attributesMutation.mutateAsync({ categoryId: productState.selectedCategoryId, skip: 0, limit: 100 });
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
    if (productState.selectedAttributesTemplates.length > 0) dispatch(setCurrentStep(FormStep.ATTRIBUTES_FORM));
    else dispatch(setCurrentStep(FormStep.IMAGE_SELECTION));
  };

  const handleNextFromAttributesForm = () => dispatch(setCurrentStep(FormStep.IMAGE_SELECTION));
  const handleNextFromImageSelection = () => dispatch(setCurrentStep(FormStep.PRODUCT_INFO));
  const handleBackToDetailsSelection = () => dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));
  const handleBackToAttributesSelection = () => dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
  const handleBackFromImageSelection = () => {
      if (productState.selectedAttributesTemplates.length > 0) dispatch(setCurrentStep(FormStep.ATTRIBUTES_FORM));
      else dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
  }
  const handleBackToCategorySelection = () => dispatch(setCurrentStep(FormStep.CATEGORY_SELECTION));
  const handleBackToDetailsSelectionFromAttributes = () => dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));

  const handleImageSelectionChange = (selectedIds: number[]) => dispatch(setSelectedImages(selectedIds));

  const handleCreateProduct = async () => {
    try {
      setIsSubmitting(true);

      const detailsList = productState.selectedDetailsTemplates.map(
        (template) => {
          const finalData = JSON.parse(JSON.stringify(template.data));
          const formData = template.formData;

          const staticFields = [ "is_fake_product", "brand", "status", "platform", "product_class", "category_product_type", "fake_reason", "theme", "id_type", "general_mefa_id", "custom_id" ];
          staticFields.forEach((field) => {
            if (formData[field] !== undefined && formData[field] !== null && formData[field] !== "") {
              (finalData as any)[field] = formData[field];
            }
          });

          const bind = finalData.bind;
          if (bind) {
            if (bind.brands && formData.brand) bind.brands.forEach((brand: any) => brand.selected = brand.id === formData.brand);
            if (bind.statuses && formData.status) bind.statuses.forEach((status: any) => status.selected = status.value === formData.status);
            if (bind.platforms && formData.platform) bind.platforms.forEach((platform: any) => platform.selected = platform.value === formData.platform);
            if (bind.product_classes && formData.product_class) bind.product_classes.forEach((productClass: any) => productClass.selected = productClass.value === formData.product_class);
            if (bind.category_product_types && formData.category_product_type) bind.category_product_types.forEach((cpt: any) => cpt.selected = cpt.value === formData.category_product_type);
            if (bind.fake_reasons && formData.fake_reason) bind.fake_reasons.forEach((reason: any) => reason.selected = reason.text.toString() === formData.fake_reason);
            if (bind.category_data?.themes && formData.theme) bind.category_data.themes.forEach((theme: any) => theme.selected = theme.value === formData.theme);

            const textFields = [ "brand_model", "color_pattern", "warranty", "size", "weight", "material", "origin_country", "manufacturer", "model_number", "barcode", "package_dimensions", "special_features", "care_instructions" ];
            textFields.forEach((fieldName) => {
              if (bind[fieldName] && formData[fieldName] !== undefined) bind[fieldName].value = formData[fieldName];
            });
          }
          return finalData;
        }
      );

      const attributesList = productState.selectedAttributesTemplates.map(
        (template) => {
          const finalData = JSON.parse(JSON.stringify(template.data));
          const formData = template.formData;
          if (finalData.category_group_attributes) {
            Object.keys(finalData.category_group_attributes).forEach(
              (categoryId) => {
                const categoryData = finalData.category_group_attributes[categoryId];
                Object.keys(categoryData.attributes).forEach((attributeId) => {
                  const attr = categoryData.attributes[attributeId];
                  const formValue = formData[attr.id];
                  if (attr.id in formData) {
                    switch (attr.type) {
                      case "input":
                        attr.value = formValue !== null && formValue !== undefined ? formValue.toString() : "";
                        break;
                      case "text":
                        if (formValue !== null && formValue !== undefined && formValue !== "") {
                          const lines = formValue.toString().split("\n").filter((line: string) => line.trim() !== "");
                          attr.value = { text_lines: lines, original_text: formValue.toString() };
                        } else {
                          attr.value = "";
                        }
                        break;
                      case "select":
                        Object.keys(attr.values).forEach((valueId) => attr.values[valueId].selected = false);
                        if (formValue && attr.values[formValue]) attr.values[formValue].selected = true;
                        break;
                      case "checkbox":
                        Object.keys(attr.values).forEach((valueId) => attr.values[valueId].selected = false);
                        if (Array.isArray(formValue) && formValue.length > 0) {
                          formValue.forEach((valueId: string) => {
                            if (attr.values[valueId]) attr.values[valueId].selected = true;
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

      const response = await saveProduct(finalProductData as any);

      if (response?.status === "true") {
        enqueueSnackbar("محصول با موفقیت ذخیره شد", { variant: "success" });
        setTimeout(() => {
          setShowResultPage(true);
          setIsSubmitting(false);
        }, 500);
      } else {
        enqueueSnackbar("خطا در ذخیره محصول", { variant: "error" });
        setIsSubmitting(false);
      }
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || error?.message || "خطا در ذخیره محصول", { variant: "error" });
      setIsSubmitting(false);
    }
  };

  const getAllAttributesData = useMemo(() => productState.selectedAttributesTemplates.map(t => t.data).filter((d): d is ICategoryAttr => "category_group_attributes" in d), [productState.selectedAttributesTemplates]);
  const getAllDetailsData = useMemo(() => productState.selectedDetailsTemplates.map(t => t.data).filter((d): d is ICategoryDetails => "bind" in d), [productState.selectedDetailsTemplates]);

  const detailsSchema = useMemo(() => activeDetailsTemplateData?.data ? createDetailsSchema(activeDetailsTemplateData.data.data_json) : null, [activeDetailsTemplateData]);
  const attributesSchema = useMemo(() => activeAttributesTemplateData?.data ? createAttributesSchema(activeAttributesTemplateData.data.data_json) : null, [activeAttributesTemplateData]);

  const handleDetailsSubmit = (data: any) => Object.entries(data).forEach(([fieldName, value]) => dispatch(updateDetailsTemplateFormData({ templateIndex: productState.activeDetailsTemplateIndex, fieldName, value })));
  const handleAttributesSubmit = (data: any) => Object.entries(data).forEach(([fieldId, value]) => dispatch(updateAttributesTemplateFormData({ templateIndex: productState.activeAttributesTemplateIndex, fieldId: fieldId.toString(), value })));

  const renderCurrentStep = () => {
    switch (productState.currentStep) {
      case FormStep.CATEGORY_SELECTION:
        return <CategorySelectionStep categories={categoriesData?.data?.items || []} selectedCategory={selectedCategory} loadingCategories={categoriesLoading} onCategoryChange={handleCategorySelect} onSearchChange={setCategorySearch} />;
      case FormStep.DETAILS_SELECTION:
        return <DetailsSelectionStep availableTemplates={productState.availableDetailsTemplates} selectedTemplateIds={productState.selectedDetailsTemplates.map(t => t.id)} onTemplateToggle={handleDetailsTemplateToggle} onNext={handleNextFromDetailsSelection} onBack={handleBackToCategorySelection} isLoading={detailsMutation.isPending || isSubmitting} />;
      case FormStep.DETAILS_FORM:
        return <DetailsFormStep selectedTemplates={productState.selectedDetailsTemplates} activeTemplateIndex={productState.activeDetailsTemplateIndex} onTabChange={(index) => dispatch(setActiveDetailsTemplateIndex(index))} onRemoveTemplate={(id) => dispatch(removeDetailsTemplate(id))} onNext={handleNextFromDetailsForm} onBack={handleBackToDetailsSelection} activeDetailsTemplateData={activeDetailsTemplateData?.data?.data_json} detailsSchema={detailsSchema!} handleDetailsSubmit={handleDetailsSubmit} activeDetailsTemplate={activeDetailsTemplate} />;
      case FormStep.ATTRIBUTES_SELECTION:
          return <AttributesSelectionStep availableTemplates={productState.availableAttributesTemplates} selectedTemplateIds={productState.selectedAttributesTemplates.map(t => t.id)} onTemplateToggle={handleAttributesTemplateToggle} onNext={handleNextFromAttributesSelection} onBack={handleBackToDetailsSelectionFromAttributes} isLoading={attributesMutation.isPending || isSubmitting} />;
      case FormStep.ATTRIBUTES_FORM:
          return <AttributesFormStep selectedTemplates={productState.selectedAttributesTemplates} activeTemplateIndex={productState.activeAttributesTemplateIndex} onTabChange={(index) => dispatch(setActiveAttributesTemplateIndex(index))} onRemoveTemplate={(id) => dispatch(removeAttributesTemplate(id))} onNext={handleNextFromAttributesForm} onBack={handleBackToAttributesSelection} activeAttributesTemplateData={activeAttributesTemplateData?.data?.data_json} attributesSchema={attributesSchema!} handleAttributesSubmit={handleAttributesSubmit} activeAttributesTemplate={activeAttributesTemplate} />;
      case FormStep.IMAGE_SELECTION:
          return <ImageSelectionStep selectedImages={productState.selectedImages} onImageSelectionChange={handleImageSelectionChange} onNext={handleNextFromImageSelection} onBack={handleBackFromImageSelection} />;
      case FormStep.PRODUCT_INFO:
          return <ProductInfoStep title={productState.productTitle} description={productState.productDescription} onTitleChange={(title) => dispatch(setProductTitle(title))} onDescriptionChange={(desc) => dispatch(setProductDescription(desc))} onSubmit={handleCreateProduct} onBack={() => dispatch(setCurrentStep(FormStep.IMAGE_SELECTION))} hasValidationErrors={!productInfoValidation.isValid} isSubmitting={isSubmitting} stepValidationErrors={productState.stepValidationErrors} attributesData={getAllAttributesData} detailsData={getAllDetailsData} />;
      default:
        return null;
    }
  };

  return (
    <Layout title="افزودن محصول جدید">
      <Box sx={{ p: 3 }}>
        {showResultPage ? <ResultPage /> : (
          <>
            <TitleCard title="ایجاد محصول جدید" description="محصول جدید را بر اساس قالب‌های انتخاب شده ایجاد کنید." />
            <FormSteps currentStep={productState.currentStep} stepValidationErrors={productState.stepValidationErrors} />
            <Box sx={{ opacity: isSubmitting ? 0.5 : 1, pointerEvents: isSubmitting ? "none" : "auto", transition: "opacity 0.3s ease" }}>
                {renderCurrentStep()}
            </Box>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSubmitting}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">در حال ذخیره محصول...</Typography>
                    <div style={{ width: 60, height: 60, border: '4px solid rgba(0, 0, 0, 0.1)', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </Paper>
            </Backdrop>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default NewProductPage;
