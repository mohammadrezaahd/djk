import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useRef } from "react";
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
  updateFormField as updateAttributeFormField,
} from "~/store/slices/attributesSlice";
import {
  setDetailsData,
  resetDetails,
  getFinalDetailsObject,
  updateFormField as updateDetailFormField,
} from "~/store/slices/detailsSlice";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import CategorySelector from "~/components/templates/CategorySelector";
import ActionButtons from "~/components/templates/ActionButtons";
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";
import { useSnackbar } from "notistack";
import { ApiStatus } from "~/types";
import { TitleCard } from "~/components/common";
import {
  createDetailsSchema,
  createAttributesSchema,
} from "~/validation/schemas/productSchema";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";

export function meta() {
  return [
    { title: "افزودن قالب جدید" },
    { name: "description", content: "صفحه افزودن قالب جدید به فروشگاه" },
  ];
}

const NewTemplatePage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef<any>(null);

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
    !!(
      selectedCategory?.id &&
      (categoryQueryOptions.attributes || categoryQueryOptions.details)
    )
  );

  const { mutateAsync: saveAttributes, isPending: isAttributesSaving } = useAddAttribute();
  const { mutateAsync: saveDetails, isPending: isDetailsSaving } = useAddDetail();

  const categories = categoriesResponse?.data?.items || [];

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  useEffect(() => {
    if (
      categoryData?.status === ApiStatus.SUCCEEDED &&
      categoryData.data &&
      selectedCategory
    ) {
      const data = categoryData.data;

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

  const detailsSchema = useMemo(() => {
    return createDetailsSchema(detailsStore.detailsData as ICategoryDetails);
  }, [detailsStore.detailsData]);

  const attributesSchema = useMemo(() => {
    return createAttributesSchema(attributesStore.attributesData as ICategoryAttr);
  }, [attributesStore.attributesData]);

  const handleDetailsSubmit = async (data: any) => {
    Object.entries(data).forEach(([fieldName, value]) => {
        dispatch(updateDetailFormField({ fieldName, value }));
    });

    if (!detailsStore.formData.title || detailsStore.formData.title.trim() === "") {
        enqueueSnackbar("عنوان قالب الزامی است", { variant: "error" });
        return;
    }

    const postData = getFinalDetailsObject({ details: detailsStore });
    if (!postData) {
        enqueueSnackbar("اطلاعات قالب در دسترس نیست", { variant: "error" });
        return;
    }

    try {
        await saveDetails(postData);
        enqueueSnackbar("قالب اطلاعات با موفقیت ذخیره شد", { variant: "success" });
    } catch(e: any) {
        enqueueSnackbar(`خطا: ${e.message}`, { variant: "error" });
    }
  };

  const handleAttributesSubmit = async (data: any) => {
    Object.entries(data).forEach(([fieldId, value]) => {
        dispatch(updateAttributeFormField({ fieldId, value }));
    });

    if (!attributesStore.title || attributesStore.title.trim() === "") {
      enqueueSnackbar("عنوان قالب الزامی است", { variant: "error" });
      return;
    }

    const postData = getFinalAttributesObject({ attributes: attributesStore });
    if (!postData) {
      enqueueSnackbar("اطلاعات قالب در دسترس نیست", { variant: "error" });
      return;
    }

    try {
        await saveAttributes(postData);
        enqueueSnackbar("قالب ویژگی با موفقیت ذخیره شد", { variant: "success" });
    } catch(e: any) {
        enqueueSnackbar(`خطا: ${e.message}`, { variant: "error" });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (selectedCategory) {
      if (newValue === 0) {
        setCategoryQueryOptions({ attributes: false, details: true });
      } else if (newValue === 1) {
        setCategoryQueryOptions({ attributes: true, details: false });
      }
    }
  };

  const handleCategoryChange = (category: ICategoryList | null) => {
    setSelectedCategory(category);
    if (category) {
      setCategoryQueryOptions({ attributes: false, details: true });
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
    setActiveTab(0);
    setCategoryQueryOptions({ attributes: false, details: false });
  };

  const triggerSubmit = () => {
      if(formRef.current) {
          formRef.current.submit();
      }
  }

  return (
    <AppLayout title="افزودن قالب جدید">
      <TitleCard
        title="افزودن قالب جدید"
        description="ابتدا دسته بندی مورد نظر را انتخال کنید سپس قالب ویژگی و اطلاعات خود را بسازید"
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              loadingCategories={loadingCategories}
              onCategoryChange={handleCategoryChange}
              onSearchChange={handleSearchChange}
            />

            {selectedCategory && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="product template tabs"
                      >
                        <Tab label="اطلاعات" />
                        <Tab label="ویژگی ها" />
                      </Tabs>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={3}>
                        {activeTab === 0 && (
                          <DetailsTab
                            formRef={formRef}
                            onSubmit={handleDetailsSubmit}
                            validationSchema={detailsSchema}
                            isLoading={categoryLoading}
                          />
                        )}
                        {activeTab === 1 && (
                          <AttributesTab
                            formRef={formRef}
                            onSubmit={handleAttributesSubmit}
                            validationSchema={attributesSchema}
                            isLoading={categoryLoading}
                          />
                        )}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {selectedCategory && (
              <ActionButtons
                onSubmit={triggerSubmit}
                onReset={handleReset}
                isFormValid={true} // Validation is handled inside forms
                loading={activeTab === 0 ? isDetailsSaving : isAttributesSaving}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default NewTemplatePage;
