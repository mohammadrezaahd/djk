import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
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
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";
import { useSnackbar } from "notistack";
import { ApiStatus } from "~/types";

export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

const NewTemplatePage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const attributesStore = useAppSelector((state) => state.attributes);
  const detailsStore = useAppSelector((state) => state.details);

  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryQueryOptions, setCategoryQueryOptions] =
    useState<GetCategoriesOptions>({
      attributes: false,
      details: false,
    });

  // Form validation states
  const [isAttributesValid, setIsAttributesValid] = useState(false);
  const [isDetailsValid, setIsDetailsValid] = useState(false);

  // Current form validity based on active tab
  const isCurrentFormValid =
    activeTab === 0 ? isAttributesValid : isDetailsValid;

  // React Query hooks
  const {
    data: categoriesResponse,
    error,
    isLoading: loadingCategories,
  } = useCategoriesList(searchTerm, 1, 50);

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategory(
    selectedCategory?.id || 0,
    categoryQueryOptions,
    !!(
      selectedCategory?.id &&
      (categoryQueryOptions.attributes || categoryQueryOptions.details)
    )
  );

  // React Query mutations
  const {
    mutateAsync: saveAttributes,
    isPending: isAttributesSaving,
    error: attributesError,
    isSuccess: attributesSuccess,
  } = useAddAttribute();

  const {
    mutateAsync: saveDetails,
    isPending: isDetailsSaving,
    error: detailsError,
    isSuccess: detailsSuccess,
  } = useAddDetail();

  // استخراج categories از response
  const categories = categoriesResponse?.data?.items || [];

  // تابع برای جستجو در categories
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  // Update store when category data changes
  useEffect(() => {
    if (
      categoryData?.status === ApiStatus.SUCCEEDED &&
      categoryData.data &&
      selectedCategory
    ) {
      const data = categoryData.data;

      // اگر attributes درخواست شده باشد
      if (
        categoryQueryOptions.attributes &&
        data.item.attributes?.category_group_attributes
      ) {
        // TARGET
        dispatch(
          setAttributesData({
            categoryId: selectedCategory.id,
            data: data.item.attributes,
          })
        );
      }

      // اگر details درخواست شده باشد
      if (categoryQueryOptions.details && data.item.details) {
        dispatch(
          setDetailsData({
            categoryId: selectedCategory.id,
            data: data.item.details,
          })
        );
      }
    }
  }, [categoryData, selectedCategory, categoryQueryOptions, dispatch]);

  const handleSubmit = async () => {
    if (!selectedCategory) {
      enqueueSnackbar("دسته‌بندی انتخاب نشده است", { variant: "error" });
      return;
    }

    try {
      if (activeTab === 0) {
        // ذخیره ویژگی‌ها
        // Validate required fields
        if (!attributesStore.title || attributesStore.title.trim() === "") {
          enqueueSnackbar("عنوان قالب الزامی است", { variant: "error" });
          return;
        }

        const postData = getFinalAttributesObject({
          attributes: attributesStore,
        });

        if (!postData) {
          enqueueSnackbar("اطلاعات قالب در دسترس نیست", { variant: "error" });
          return;
        }

        await saveAttributes(postData);
        enqueueSnackbar("قالب ویژگی با موفقیت ذخیره شد", {
          variant: "success",
        });
      } else if (activeTab === 1) {
        // ذخیره اطلاعات
        // Validate required fields
        if (
          !detailsStore.formData.title ||
          detailsStore.formData.title.trim() === ""
        ) {
          enqueueSnackbar("عنوان قالب الزامی است", { variant: "error" });
          return;
        }

        const postData = getFinalDetailsObject({ details: detailsStore });

        if (!postData) {
          enqueueSnackbar("اطلاعات قالب در دسترس نیست", { variant: "error" });
          return;
        }

        await saveDetails(postData);
        enqueueSnackbar("قالب اطلاعات با موفقیت ذخیره شد", {
          variant: "success",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        (activeTab === 0 ? "خطا در ذخیره ویژگی‌ها" : "خطا در ذخیره اطلاعات");
      enqueueSnackbar(`خطا: ${errorMessage}`, { variant: "error" });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // اگر دسته‌بندی انتخاب شده باشد، بر اساس تب جدید API کال کن
    if (selectedCategory) {
      if (newValue === 0) {
        // تب ویژگی‌ها - attributes: true, details: false
        setCategoryQueryOptions({ attributes: true, details: false });
      } else if (newValue === 1) {
        // تب اطلاعات - attributes: false, details: true
        setCategoryQueryOptions({ attributes: false, details: true });
      }
    }
  };

  const handleCategoryChange = (category: ICategoryList | null) => {
    setSelectedCategory(category);
    if (category) {
      // پیش‌فرض تب ویژگی‌ها - attributes: true, details: false
      setCategoryQueryOptions({ attributes: true, details: false });
    } else {
      // ریست کردن store ها
      dispatch(resetAttributes());
      dispatch(resetDetails());
      setCategoryQueryOptions({ attributes: false, details: false });
    }
  };

  const handleReset = () => {
    // ریست کردن store ها
    dispatch(resetAttributes());
    dispatch(resetDetails());
    setSelectedCategory(null);
    setActiveTab(0);
    setCategoryQueryOptions({ attributes: false, details: false });
  };

  return (
    <AppLayout>
      <Typography variant="h4" gutterBottom>
        افزودن قالب جدید به فروشگاه
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Grid container spacing={3}>
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              loadingCategories={loadingCategories}
              onCategoryChange={handleCategoryChange}
              onSearchChange={handleSearchChange}
            />

            {/* Tabs Section */}
            {selectedCategory && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="product template tabs"
                      >
                        <Tab label="ویژگی ها" />
                        <Tab label="اطلاعات" />
                      </Tabs>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={3}>
                        {activeTab === 0 && (
                          <AttributesTab
                            onValidationChange={setIsAttributesValid}
                            isLoading={categoryLoading}
                          />
                        )}
                        {activeTab === 1 && (
                          <DetailsTab
                            onValidationChange={setIsDetailsValid}
                            isLoading={categoryLoading}
                          />
                        )}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Action Buttons */}
            {selectedCategory && (
              <ActionButtons
                activeTab={activeTab}
                onSubmit={handleSubmit}
                onReset={handleReset}
                isFormValid={isCurrentFormValid}
                loading={
                  activeTab === 0
                    ? categoryLoading || isAttributesSaving
                    : categoryLoading || isDetailsSaving
                }
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default NewTemplatePage;
