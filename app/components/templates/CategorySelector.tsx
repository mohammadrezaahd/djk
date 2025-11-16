import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import type { ICategoryList } from "../../../types/interfaces/categories.interface";

interface CategorySelectorProps {
  categories: ICategoryList[];
  selectedCategory: ICategoryList | null;
  loadingCategories: boolean;
  onCategoryChange: (category: ICategoryList | null) => void;
  onSearchChange: (search: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  loadingCategories,
  onCategoryChange,
  onSearchChange,
}) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.title}
            value={selectedCategory}
            onChange={(event, newValue) => onCategoryChange(newValue)}
            onInputChange={(event, newInputValue) =>
              onSearchChange(newInputValue)
            }
            loading={loadingCategories}
            renderInput={(params) => (
              <TextField
                {...params}
                label="انتخاب دسته‌بندی"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingCategories ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategorySelector;