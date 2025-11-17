import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCategoriesList, useCategory } from "~/api/categories.api";
import type { GetCategoriesOptions } from "~/api/categories.api";
import { useAddAttribute } from "~/api/attributes.api";
import { useAddDetail } from "~/api/details.api";

import AppLayout from "~/components/layout/AppLayout";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setAttributesData,
  resetAttributes,
  getFinalAttributesObject,
} from "~/store/slices/attributesSlice";
import {
  setDetailsData,
  resetDetails,
  getFinalDetailsObject,
} from "~/store/slices/detailsSlice";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import CategorySelector from "~/components/templates/CategorySelector";
import ActionButtons from "~/components/templates/ActionButtons";
import TemplateForm from "~/components/templates/TemplateForm"; // Import the new form component
import { useSnackbar } from "notistack";
import { ApiStatus } from "~/types";
import { TitleCard } from "~/components/common";

export function meta() {
  return [
    { title: "Add New Template" },
    { name: "description", content: "Page for adding a new template to the store" },
  ];
}

const NewTemplatePage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const attributesStore = useAppSelector((state) => state.attributes);
  const detailsStore = useAppSelector((state) => state.details);

  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);
  const [activeTabForSubmit, setActiveTabForSubmit] = useState(0); // To know which form to submit
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryQueryOptions, setCategoryQueryOptions] =
    useState<GetCategoriesOptions>({
      attributes: false,
      details: false,
    });

  const [isFormValid, setIsFormValid] = useState(false);

  // React Query hooks
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
  } = useCategoriesList(searchTerm, 1, 50);

  const {
    data: categoryData,
    isLoading: categoryLoading,
  } = useCategory(
    selectedCategory?.id || 0,
    categoryQueryOptions,
    !!(selectedCategory?.id && (categoryQueryOptions.attributes || categoryQueryOptions.details))
  );

  // React Query mutations
  const { mutateAsync: saveAttributes, isPending: isAttributesSaving } = useAddAttribute();
  const { mutateAsync: saveDetails, isPending: isDetailsSaving } = useAddDetail();

  const categories = categoriesResponse?.data?.items || [];

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  useEffect(() => {
    if (categoryData?.status === ApiStatus.SUCCEEDED && categoryData.data && selectedCategory) {
      const data = categoryData.data;
      if (categoryQueryOptions.attributes && data.item.attributes?.category_group_attributes) {
        dispatch(setAttributesData({ categoryId: selectedCategory.id, data: data.item.attributes }));
      }
      if (categoryQueryOptions.details && data.item.details) {
        dispatch(setDetailsData({ categoryId: selectedCategory.id, data: data.item.details }));
      }
    }
  }, [categoryData, selectedCategory, categoryQueryOptions, dispatch]);

  const handleSubmit = async () => {
    if (!selectedCategory) {
      enqueueSnackbar("Category is not selected", { variant: "error" });
      return;
    }

    try {
      if (activeTabForSubmit === 0) { // Submitting Details
        const postData = getFinalDetailsObject({ details: detailsStore });
        if (!postData) {
          enqueueSnackbar("Template information is not available", { variant: "error" });
          return;
        }
        await saveDetails(postData);
        enqueueSnackbar("Information template saved successfully", { variant: "success" });
      } else { // Submitting Attributes
        const postData = getFinalAttributesObject({ attributes: attributesStore });
        if (!postData) {
          enqueueSnackbar("Template information is not available", { variant: "error" });
          return;
        }
        await saveAttributes(postData);
        enqueueSnackbar("Attribute template saved successfully", { variant: "success" });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Error saving template";
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: "error" });
    }
  };

  const handleCategoryChange = (category: ICategoryList | null) => {
    setSelectedCategory(category);
    if (category) {
      setCategoryQueryOptions({ attributes: false, details: true });
      setActiveTabForSubmit(0);
    } else {
      dispatch(resetAttributes());
      dispatch(resetDetails());
      setCategoryQueryOptions({ attributes: false, details: false });
    }
  };

  const handleReset = () => {
    dispatch(resetAttributes());
    dispatch(resetDetails());
    setSelectedCategory(null);
    setActiveTabForSubmit(0);
    setCategoryQueryOptions({ attributes: false, details: false });
  };

  return (
    <AppLayout title="Add New Template">
      <TitleCard
        title="Add New Template"
        description="First, select the desired category, then create your attribute and information templates."
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            loadingCategories={loadingCategories}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
          />
        </Grid>

        {selectedCategory && (
          <Grid item xs={12}>
            <TemplateForm
              isLoading={categoryLoading}
              isValidationEnabled={false} // Validation is disabled for creating templates
              onValidationChange={setIsFormValid}
              // We need to know which tab is active to submit the correct data
              onTabChange={setActiveTabForSubmit}
            />
          </Grid>
        )}

        {selectedCategory && (
          <ActionButtons
            onSubmit={handleSubmit}
            onReset={handleReset}
            isFormValid={true} // In template creation, form is always considered valid
            loading={isDetailsSaving || isAttributesSaving}
          />
        )}
      </Grid>
    </AppLayout>
  );
};

export default NewTemplatePage;
