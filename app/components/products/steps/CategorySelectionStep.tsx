import React from "react";
import CategorySelector from "~/components/templates/CategorySelector";
import type { ICategoryList } from "~/types/interfaces/categories.interface";

interface CategorySelectionStepProps {
  categories: ICategoryList[];
  selectedCategory: ICategoryList | null;
  loadingCategories: boolean;
  onCategoryChange: (category: ICategoryList | null) => void;
  onSearchChange: (search: string) => void;
}

const CategorySelectionStep: React.FC<CategorySelectionStepProps> = ({
  categories,
  selectedCategory,
  loadingCategories,
  onCategoryChange,
  onSearchChange,
}) => {
  return (
    <CategorySelector
      categories={categories}
      selectedCategory={selectedCategory}
      loadingCategories={loadingCategories}
      onCategoryChange={onCategoryChange}
      onSearchChange={onSearchChange}
    />
  );
};

export default CategorySelectionStep;
