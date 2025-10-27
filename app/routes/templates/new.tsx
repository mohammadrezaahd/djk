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
import { categoriesApi } from "~/api/categories.api";

import AppLayout from "~/components/AppLayout";
import { ApiStatus } from "~/types";
import {
  AttributeType,
  type IAttr,
} from "~/types/interfaces/attributes.interface";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import {
  CategorySelector,
  AttributesTab,
  InformationTab,
  ActionButtons,
} from "../../components/templates";
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
} from "~/store/slices/detailsSlice";

export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

export default function NewProductTemplate() {
  const dispatch = useAppDispatch();
  const attributesStore = useAppSelector(state => state.attributes);
  const detailsStore = useAppSelector(state => state.details);
  
  const [categories, setCategories] = useState<ICategoryList[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for ویژگی ها، 1 for اطلاعات

  // لود کردن لیست دسته‌بندی‌ها
  const loadCategories = async (search: string = "") => {
    setLoadingCategories(true);
    try {
      const res = await categoriesApi.getCategoriesList(search, 1, 50);
      if (res.status === ApiStatus.SUCCEEDED && res.data) {
        setCategories(res.data.items);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // بارگذاری اولیه دسته‌بندی‌ها
  useEffect(() => {
    loadCategories();
  }, []);

  const fetcher = async (
    categoryId: number,
    includeOptions?: { attributes?: boolean; details?: boolean }
  ) => {
    if (!categoryId) {
      return;
    }

    const defaultOptions = { attributes: true, details: false };
    const options = includeOptions || defaultOptions;

    try {
      // بررسی کنیم که آیا این categoryId در store موجود است یا نه
      const shouldFetchAttributes = options.attributes && 
        (attributesStore as any).currentCategoryId !== categoryId;
      
      const shouldFetchDetails = options.details && 
        (detailsStore as any).currentCategoryId !== categoryId;

      // اگر هیچ کدام نیازی به fetch ندارند، return کن
      if (!shouldFetchAttributes && !shouldFetchDetails) {
        return;
      }

      if (shouldFetchAttributes) {
        dispatch(setAttributesLoading(true));
      }
      
      if (shouldFetchDetails) {
        dispatch(setDetailsLoading(true));
      }

      const res = await categoriesApi.getCategories(categoryId, options);
      if (res.status === ApiStatus.SUCCEEDED && res.data) {
        const data = res.data;

        // اگر attributes درخواست شده باشد و نیاز به fetch داشته باشیم
        if (shouldFetchAttributes && data.item.attributes?.category_group_attributes) {
          dispatch(setAttributesData({
            categoryId,
            data: data.item.attributes
          }));
        }

        // اگر details درخواست شده باشد و نیاز به fetch داشته باشیم
        if (shouldFetchDetails && data.item.details) {
          dispatch(setDetailsData({
            categoryId,
            data: data.item.details
          }));
        }
      }
    } catch (error) {
      console.error("Error loading category data:", error);
    } finally {
      if (options.attributes) {
        dispatch(setAttributesLoading(false));
      }
      
      if (options.details) {
        dispatch(setDetailsLoading(false));
      }
    }
  };

  const handleSubmit = async () => {
    console.log("✅ ذخیره قالب ویژگی‌ها کلیک شد!");
    
    // استخراج و لاگ گرفتن آبجکت نهایی از store
    const finalAttributesData = getFinalAttributesObject({ attributes: attributesStore });
    
    if (!finalAttributesData) {
      console.error("داده‌های attributes موجود نیست. ابتدا یک دسته‌بندی انتخاب کنید.");
      alert("ابتدا یک دسته‌بندی انتخاب کنید.");
      return;
    }

    console.log("📤 آبجکت نهایی با تایپ ICategoryAttr:");
    console.log(JSON.stringify(finalAttributesData, null, 2));

    alert("آبجکت نهایی با تایپ ICategoryAttr در کنسول لاگ شد!");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // اگر دسته‌بندی انتخاب شده باشد، بر اساس تب جدید API کال کن
    if (selectedCategory) {
      if (newValue === 0) {
        // تب ویژگی‌ها - attributes: true, details: false
        fetcher(selectedCategory.id, { attributes: true, details: false });
      } else if (newValue === 1) {
        // تب اطلاعات - attributes: false, details: true
        fetcher(selectedCategory.id, { attributes: false, details: true });
      }
    }
  };

  const handleCategoryChange = (category: ICategoryList | null) => {
    setSelectedCategory(category);
    if (category) {
      // پیش‌فرض تب ویژگی‌ها - attributes: true, details: false
      fetcher(category.id, {
        attributes: true,
        details: false,
      });
    } else {
      // ریست کردن store ها
      dispatch(resetAttributes());
      dispatch(resetDetails());
    }
  };

  const handleReset = () => {
    // ریست کردن store ها
    dispatch(resetAttributes());
    dispatch(resetDetails());
    setSelectedCategory(null);
    setActiveTab(0);
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
              onSearchChange={loadCategories}
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
                        {activeTab === 1 && <InformationTab />}
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
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
