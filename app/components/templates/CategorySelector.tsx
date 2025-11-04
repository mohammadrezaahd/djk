import {
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import type { ICategoryList } from "~/types/interfaces/categories.interface";

const SectionCard = ({ title, children, ...props }: any) => (
  <Card sx={{ p: 2, ...props.sx }} {...props}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

interface CategorySelectorProps {
  categories: ICategoryList[];
  selectedCategory: ICategoryList | null;
  loadingCategories: boolean;
  onCategoryChange: (category: ICategoryList | null) => void;
  onSearchChange: (search: string) => void;
}

const CategorySelector = ({
  categories,
  selectedCategory,
  loadingCategories,
  onCategoryChange,
  onSearchChange,
}: CategorySelectorProps) => {
  return (
    <Grid size={{ xs: 12 }}>
      <SectionCard title="دسته‌بندی قالب">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              fullWidth
              options={categories}
              getOptionLabel={(option) => option.title}
              value={selectedCategory}
              onChange={(_, newValue) => onCategoryChange(newValue)}
              onInputChange={(_, newInputValue) =>
                onSearchChange(newInputValue)
              }
              loading={loadingCategories}
              noOptionsText="قالب‌ای یافت نشد"
              loadingText="در حال جستجو..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="قالب اطلاعاتی محصول"
                  placeholder="جستجو در قالب‌ها..."
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>
    </Grid>
  );
};

export default CategorySelector;
