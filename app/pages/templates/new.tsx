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
import { useCategoriesList } from "../../api/categories.api";
import AppLayout from "../../components/layout/AppLayout";
import { useAppDispatch } from "../../store/hooks";
import { resetAttributes } from "../../store/slices/attributesSlice";
import { resetDetails } from "../../store/slices/detailsSlice";
import type { ICategoryList } from "../../types/interfaces/categories.interface";
import CategorySelector from "../../components/templates/CategorySelector";
import { TitleCard } from "../../components/common";
import DetailsFormWrapper from "../../components/templates/DetailsFormWrapper";
import AttributesFormWrapper from "../../components/templates/AttributesFormWrapper";

export function meta() {
  return [
    { title: "افزودن قالب جدید" },
    { name: "description", content: "صفحه افزودن قالب جدید به فروشگاه" },
  ];
}

const NewTemplatePage = () => {
  const dispatch = useAppDispatch();

  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
  } = useCategoriesList(searchTerm, 1, 50);

  const categories = categoriesResponse?.data?.items || [];

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCategoryChange = (category: ICategoryList | null) => {
    setSelectedCategory(category);
    // Reset stores when category changes to avoid stale data
    dispatch(resetAttributes());
    dispatch(resetDetails());
    setActiveTab(0); // Default to details tab
  };

  const handleSuccess = () => {
    // maybe navigate to list page or show a success message
    setSelectedCategory(null);
    dispatch(resetAttributes());
    dispatch(resetDetails());
  }

  return (
    <AppLayout title="افزودن قالب جدید">
      <TitleCard
        title="افزودن قالب جدید"
        description="ابتدا دسته بندی مورد نظر را انتخاب کنید سپس قالب ویژگی و اطلاعات خود را بسازید"
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
                  {activeTab === 0 && (
                    <DetailsFormWrapper categoryId={selectedCategory.id} onSuccess={handleSuccess}/>
                  )}
                  {activeTab === 1 && (
                    <AttributesFormWrapper categoryId={selectedCategory.id} onSuccess={handleSuccess} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </AppLayout>
  );
};

export default NewTemplatePage;