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
import { categoriesApi, useCategoriesList, useCategory } from "~/api/categories.api";
import type { GetCategoriesOptions } from "~/api/categories.api";

import AppLayout from "~/components/layout/AppLayout";
import { ApiStatus } from "~/types";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setAttributesData,
  setLoading as setAttributesLoading,
  resetAttributes,
  getFinalAttributesObject,
} from "~/store/slices/attributesSlice";
import {
  setDetailsData,
  setLoading as setDetailsLoading,
  resetDetails,
  saveDetails,
} from "~/store/slices/detailsSlice";
import { processAndConvertToJSON } from "~/utils/dataProcessor";
import { useAddAttribute } from "~/api/attributes.api";
import { useAddDetail } from "~/api/details.api";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import CategorySelector from "~/components/templates/CategorySelector";
import ActionButtons from "~/components/templates/ActionButtons";
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";

export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

export default function NewProductTemplate() {
  const dispatch = useAppDispatch();
  const attributesStore = useAppSelector((state) => state.attributes);
  const detailsStore = useAppSelector((state) => state.details);

  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for ویژگی ها، 1 for اطلاعات
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryQueryOptions, setCategoryQueryOptions] = useState<GetCategoriesOptions>({
    attributes: false,
    details: false
  });

  // React Query hooks
  const {
    data: categoriesResponse,
    error,
    isLoading: loadingCategories,
  } = useCategoriesList(searchTerm, 1, 50);

  // Mutations
  const addAttributeMutation = useAddAttribute();
  const addDetailMutation = useAddDetail();

  // Category details query
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError
  } = useCategory(
    selectedCategory?.id || 0,
    categoryQueryOptions,
    !!(selectedCategory?.id && (categoryQueryOptions.attributes || categoryQueryOptions.details))
  );

  // استخراج categories از response
  const categories = categoriesResponse?.data?.items || [];

  // تابع برای جستجو در categories
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  // Update store when category data changes
  useEffect(() => {
    if (categoryData?.status === ApiStatus.SUCCEEDED && categoryData.data && selectedCategory) {
      const data = categoryData.data;

      // اگر attributes درخواست شده باشد
      if (categoryQueryOptions.attributes && data.item.attributes?.category_group_attributes) {
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
    const tabName = activeTab === 0 ? "ویژگی‌ها" : "اطلاعات";
    console.log(`✅ ذخیره قالب ${tabName} کلیک شد!`);

    if (activeTab === 0) {
      // تب ویژگی‌ها
      const finalAttributesData = getFinalAttributesObject({
        attributes: attributesStore,
      });

      if (!finalAttributesData) {
        console.error(
          "داده‌های attributes موجود نیست. ابتدا یک دسته‌بندی انتخاب کنید."
        );
        alert("ابتدا یک دسته‌بندی انتخاب کنید.");
        return;
      }

      // بررسی title
      if (!attributesStore.title.trim()) {
        alert("لطفاً عنوان قالب را وارد کنید.");
        return;
      }

      // استخراج formData از store (نه از attr.value)
      const formData: { [key: string]: any } = attributesStore.formData || {};

      console.log("📤 داده‌های پردازش شده ویژگی‌ها (کل ICategoryAttr):");
      console.log("FormData از store:", formData);

      // پردازش داده‌ها
      const processedJSON = processAndConvertToJSON(
        finalAttributesData,
        formData
      );
      console.log(processedJSON);

      // آماده‌سازی داده برای API
      const apiData = {
        title: attributesStore.title,
        description: attributesStore.description || undefined, // اختیاری
        category_id: attributesStore.currentCategoryId!,
        data_json: JSON.parse(processedJSON),
        images: [], // فعلاً خالی
        source: "app" as const,
      };

      try {
        console.log("🚀 ارسال به API...", apiData);
        const result = await addAttributeMutation.mutateAsync(apiData);

        if (result.status === "true" && result.data) {
          alert(`قالب با موفقیت اضافه شد! شناسه: ${result.data.data.id}`);
          console.log("✅ قالب با موفقیت ذخیره شد:", result);
          // Reset form after successful submission
          dispatch(resetAttributes());
          setSelectedCategory(null);
          setActiveTab(0);
        } else {
          alert(
            "خطا در ذخیره قالب: " +
              (result.error || result.message || "خطای نامشخص")
          );
          console.error("❌ خطا در ذخیره:", result);
        }
      } catch (error) {
        console.error("❌ خطا در ارسال به API:", error);
        alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
      }
    } else {
      // تب اطلاعات
      const detailsFormData = detailsStore.formData || {};

      if (Object.keys(detailsFormData).length === 0) {
        console.error("داده‌های اطلاعات موجود نیست.");
        alert("ابتدا اطلاعات محصول را تکمیل کنید.");
        return;
      }

      // بررسی title برای اطلاعات
      if (!detailsFormData.title?.trim()) {
        alert("لطفاً عنوان قالب اطلاعات را وارد کنید.");
        return;
      }

      if (!selectedCategory?.id) {
        alert("دسته‌بندی انتخاب نشده است.");
        return;
      }

      try {
        console.log("� ذخیره اطلاعات...");
        await dispatch(saveDetails(selectedCategory.id, []));
        console.log("✅ قالب اطلاعات با موفقیت ذخیره شد");
      } catch (error) {
        console.error("❌ خطا در ذخیره اطلاعات:", error);
        // خطا توسط saveDetails نمایش داده می‌شود
      }
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
                        {activeTab === 0 && <AttributesTab />}
                        {activeTab === 1 && <DetailsTab />}
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
                loading={
                  activeTab === 0
                    ? categoryLoading || addAttributeMutation.isPending
                    : categoryLoading || addDetailMutation.isPending || (detailsStore as any).saving || detailsStore.loading
                }
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
