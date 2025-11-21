import {
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Skeleton,
  Stack,
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
  // اضافه کردن suggest ها
  suggestedCategories?: ICategoryList[];
  loadingSuggestions?: boolean;
}

const CategorySelector = ({
  categories,
  selectedCategory,
  loadingCategories,
  onCategoryChange,
  onSearchChange,
  suggestedCategories,
  loadingSuggestions,
}: CategorySelectorProps) => {
  const handleSuggestionClick = (suggestion: ICategoryList) => {
    onSearchChange(suggestion.title);
  };

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

          {/* Suggested Categories Section */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                پیشنهادات:
              </Typography>
              {loadingSuggestions ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={80}
                      height={32}
                      sx={{ borderRadius: 2 }}
                    />
                  ))}
                </Stack>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {suggestedCategories?.map((suggestion) => (
                    <Chip
                      key={suggestion.id}
                      label={suggestion.title}
                      variant="outlined"
                      clickable
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: "primary.light",
                          borderColor: "primary.main",
                          color: "primary.contrastText",
                        },
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </SectionCard>
    </Grid>
  );
};

export default CategorySelector;
