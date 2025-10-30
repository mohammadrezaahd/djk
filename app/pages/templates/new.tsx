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

import AppLayout from "~/components/layout/AppLayout";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setAttributesData,
  resetAttributes,
  saveAttributes,
} from "~/store/slices/attributesSlice";
import {
  setDetailsData,
  resetDetails,
  saveDetails,
} from "~/store/slices/detailsSlice";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import CategorySelector from "~/components/templates/CategorySelector";
import ActionButtons from "~/components/templates/ActionButtons";
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";
import { useSnackbar } from "notistack";

export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

export default function NewProductTemplate() {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const attributesStore = useAppSelector((state) => state.attributes);
  const detailsStore = useAppSelector((state) => state.details);

  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for ویژگی ها، 1 for اطلاعات
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

  // Category details query
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

  // استخراج categories از response
  const categories = categoriesResponse?.data?.items || [];

  // تابع برای جستجو در categories
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  // Update store when category data changes
  useEffect(() => {
    if (
      categoryData?.status === 'true' &&
      categoryData.data &&
      selectedCategory
    ) {
      const data = categoryData.data;

      // اگر attributes درخواست شده باشد
      if (
        categoryQueryOptions.attributes &&
        data.item.attributes?.category_group_attributes
      ) {
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
    // Check if form is valid before proceeding
    if (!isCurrentFormValid) {
      enqueueSnackbar("لطفاً ابتدا خطاهای فرم را برطرف کنید.", {
        variant: "error",
      });
      return;
    }

    if (!selectedCategory?.id) {
      enqueueSnackbar("دسته‌بندی انتخاب نشده است.", {
        variant: "error",
      });
      return;
    }

    const tabName = activeTab === 0 ? "ویژگی‌ها" : "اطلاعات";
    console.log(`✅ ذخیره قالب ${tabName} کلیک شد!`);

    try {
      if (activeTab === 0) {
        // تب ویژگی‌ها
        await dispatch(saveAttributes(selectedCategory.id, enqueueSnackbar, []));
        // Reset form after successful submission
        dispatch(resetAttributes());
        setSelectedCategory(null);
        setActiveTab(0);
      } else {
        // تب اطلاعات
        await dispatch(saveDetails(selectedCategory.id, enqueueSnackbar, []));
        // Reset form after successful submission
        dispatch(resetDetails());
        setSelectedCategory(null);
        setActiveTab(0);
      }
    } catch (error) {
      // خطا توسط slice ها نمایش داده می‌شود
      console.error("❌ خطا در ذخیره:", error);
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
                          />
                        )}
                        {activeTab === 1 && (
                          <DetailsTab onValidationChange={setIsDetailsValid} />
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
                    ? categoryLoading || attributesStore.saving || attributesStore.loading
                    : categoryLoading || detailsStore.saving || detailsStore.loading
                }
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
