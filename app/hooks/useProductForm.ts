import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
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
  resetProduct,
  setStepValidationError,
} from "~/store/slices/productSlice";
import { useCategoriesList } from "~/api/categories.api";
import { useDetails, useDetail } from "~/api/details.api";
import { useAttrs, useAttr } from "~/api/attributes.api";
import { useSelectedImages } from "~/api/gallery.api";
import {
  useProductDetailsValidation,
  validateAllDetailsTemplates,
  validateAllAttributesTemplates,
  getAttributesTemplatesValidationErrors,
  useProductInfoValidation,
} from "~/validation";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import { useAddProduct } from "~/api/product.api";

export const useProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const productState = useSelector((state: RootState) => state.product);

  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategoryLocal] =
    useState<ICategoryList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesList(categorySearch, 1, 50);
  const { mutateAsync: saveProduct } = useAddProduct();
  const detailsMutation = useDetails();
  const attributesMutation = useAttrs();

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

  const activeDetailsValidation = useProductDetailsValidation(
    activeDetailsTemplateData?.data?.data_json as any,
    activeDetailsTemplate?.formData || {}
  );

  const allAttributesValidationErrors = useMemo(() => {
    const allErrors = getAttributesTemplatesValidationErrors(
      productState.selectedAttributesTemplates
    );
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeAttributesTemplate?.id
    );
    return activeTemplateErrors?.errors || {};
  }, [productState.selectedAttributesTemplates, activeAttributesTemplate?.id]);

  const productInfoValidation = useProductInfoValidation(
    productState.productTitle,
    productState.productDescription
  );

  const { data: selectedImagesData } = useSelectedImages(
    productState.selectedImages
  );

  useEffect(() => {
    dispatch(resetProduct());
  }, [dispatch]);

  useEffect(() => {
    let hasDetailsErrors = false;
    if (productState.selectedDetailsTemplates.length === 0) {
      const currentStepIndex = Object.values(FormStep).indexOf(
        productState.currentStep
      );
      const detailsFormStepIndex = Object.values(FormStep).indexOf(
        FormStep.DETAILS_FORM
      );
      hasDetailsErrors = currentStepIndex > detailsFormStepIndex;
    } else {
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
    let hasAttributesErrors = false;
    if (productState.selectedAttributesTemplates.length === 0) {
      const currentStepIndex = Object.values(FormStep).indexOf(
        productState.currentStep
      );
      const attributesFormStepIndex = Object.values(FormStep).indexOf(
        FormStep.ATTRIBUTES_FORM
      );
      hasAttributesErrors = currentStepIndex > attributesFormStepIndex;
    } else {
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

  const handleCategorySelect = async (category: ICategoryList | null) => {
    setSelectedCategoryLocal(category);
    if (category) {
      dispatch(setSelectedCategory(category.id));
      dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));
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

  const handleDetailsTemplateToggle = (template: ITemplateList) => {
    const isSelected = productState.selectedDetailsTemplates.some(
      (t) => t.id === template.id
    );
    if (isSelected) {
      dispatch(removeDetailsTemplate(template.id));
    } else {
      dispatch(
        addDetailsTemplate({
          template,
          data: {} as any,
        })
      );
    }
  };

  const handleAttributesTemplateToggle = (template: ITemplateList) => {
    const isSelected = productState.selectedAttributesTemplates.some(
      (t) => t.id === template.id
    );
    if (isSelected) {
      dispatch(removeAttributesTemplate(template.id));
    } else {
      dispatch(
        addAttributesTemplate({
          template,
          data: {} as any,
        })
      );
    }
  };

  const handleNextFromDetailsSelection = async () => {
    if (productState.selectedDetailsTemplates.length > 0) {
      dispatch(setCurrentStep(FormStep.DETAILS_FORM));
    } else {
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
    } else {
      dispatch(setCurrentStep(FormStep.IMAGE_SELECTION));
    }
  };

  const handleNextFromAttributesForm = () => {
    dispatch(setCurrentStep(FormStep.IMAGE_SELECTION));
  };

  const handleNextFromImageSelection = () => {
    dispatch(setCurrentStep(FormStep.PRODUCT_INFO));
  };

  const handleImageSelectionChange = (selectedIds: number[]) => {
    dispatch(setSelectedImages(selectedIds));
  };

  const handleBackToCategorySelection = () => {
    dispatch(setCurrentStep(FormStep.CATEGORY_SELECTION));
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

  const handleBackFromImageSelection = () => {
    if (productState.selectedAttributesTemplates.length > 0) {
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_FORM));
    } else {
      dispatch(setCurrentStep(FormStep.ATTRIBUTES_SELECTION));
    }
  };

  const handleBackToDetailsSelectionFromAttributes = () => {
    dispatch(setCurrentStep(FormStep.DETAILS_SELECTION));
  };

  const handleCreateProduct = async (finalProductData: any) => {
    try {
      setIsSubmitting(true);
      const response = await saveProduct(finalProductData);
      if (response?.status === "true") {
        enqueueSnackbar("محصول با موفقیت ذخیره شد", {
          variant: "success",
        });
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

  return {
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
  };
};
