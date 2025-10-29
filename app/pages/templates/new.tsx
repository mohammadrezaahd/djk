import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createAttributesSchema } from "~/validations/attributesSchema";
import { createDetailsSchema } from "~/validations/detailsSchema";
import {
  categoriesApi,
  useCategoriesList,
  useCategory,
} from "~/api/categories.api";
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
  const [categoryQueryOptions, setCategoryQueryOptions] =
    useState<GetCategoriesOptions>({
      attributes: false,
      details: false,
    });

  const attributes = useMemo(() => {
    if (!attributesStore.attributesData?.category_group_attributes) return [];
    const allAttributes: any[] = [];
    Object.values(
      attributesStore.attributesData.category_group_attributes
    ).forEach((categoryData) => {
      Object.values(categoryData.attributes).forEach((attr) => {
        if (attr.id !== 2233) {
          allAttributes.push(attr);
        }
      });
    });
    return allAttributes;
  }, [attributesStore.attributesData]);

  const brands = useMemo(() => {
    return detailsStore.detailsData?.bind?.brands || [];
  }, [detailsStore.detailsData]);

  const attributeMethods = useForm({
    resolver: yupResolver(createAttributesSchema(attributes)),
  });

  const detailMethods = useForm({
    resolver: yupResolver(createDetailsSchema(brands)),
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

  const onAttributesSubmit = async (data: any) => {
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

    const processedJSON = processAndConvertToJSON(finalAttributesData, data);
    const apiData = {
      title: data.title,
      description: data.description || undefined,
      category_id: attributesStore.currentCategoryId!,
      data_json: JSON.parse(processedJSON),
      images: [],
      source: "app" as const,
    };

    try {
      const result = await addAttributeMutation.mutateAsync(apiData);
      if (result.status === "true" && result.data) {
        alert(`قالب با موفقیت اضافه شد! شناسه: ${result.data.data.id}`);
        handleReset();
      } else {
        alert(
          "خطا در ذخیره قالب: " +
            (result.error || result.message || "خطای نامشخص")
        );
      }
    } catch (error) {
      console.error("❌ خطا در ارسال به API:", error);
      alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  const onDetailsSubmit = async (data: any) => {
    if (!selectedCategory?.id) {
      alert("دسته‌بندی انتخاب نشده است.");
      return;
    }

    try {
      await dispatch(saveDetails(selectedCategory.id, data));
      console.log("✅ قالب اطلاعات با موفقیت ذخیره شد");
      handleReset();
    } catch (error) {
      console.error("❌ خطا در ذخیره اطلاعات:", error);
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
    dispatch(resetAttributes());
    dispatch(resetDetails());
    setSelectedCategory(null);
    setActiveTab(0);
    setCategoryQueryOptions({ attributes: false, details: false });
    attributeMethods.reset();
    detailMethods.reset();
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
                          <FormProvider {...attributeMethods}>
                            <AttributesTab />
                          </FormProvider>
                        )}
                        {activeTab === 1 && (
                          <FormProvider {...detailMethods}>
                            <DetailsTab />
                          </FormProvider>
                        )}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {selectedCategory && (
              <ActionButtons
                activeTab={activeTab}
                onSubmit={
                  activeTab === 0
                    ? attributeMethods.handleSubmit(onAttributesSubmit)
                    : detailMethods.handleSubmit(onDetailsSubmit)
                }
                onReset={handleReset}
                loading={
                  activeTab === 0
                    ? categoryLoading || addAttributeMutation.isPending
                    : categoryLoading ||
                      addDetailMutation.isPending ||
                      (detailsStore as any).saving ||
                      detailsStore.loading
                }
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
