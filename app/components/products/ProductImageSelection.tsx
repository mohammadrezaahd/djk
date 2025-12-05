import React, { useMemo } from "react";
import { Box, Paper, Typography, Button, Stack, Alert } from "@mui/material";

import ImageSelector from "~/components/templates/ImageSelector";
import { MediaType } from "~/components/MediaManager/FileUpload";
import { useSelectedImages } from "~/api/gallery.api";

interface ProductImageSelectionProps {
  selectedImages: number[];
  onImageSelectionChange: (selectedIds: number[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProductImageSelection: React.FC<ProductImageSelectionProps> = ({
  selectedImages,
  onImageSelectionChange,
  onNext,
  onBack,
}) => {
  // Fetch selected images data to check if any is a product image
  const { data: selectedImagesData } = useSelectedImages(selectedImages);

  // Check if at least one selected image is a product image
  const hasProductImage = useMemo(() => {
    if (!selectedImagesData?.data?.list) return false;
    return selectedImagesData.data.list.some((img) => img.product === true);
  }, [selectedImagesData]);

  const isValid = selectedImages.length > 0 && hasProductImage;

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          انتخاب تصاویر محصول
        </Typography>
        <Typography variant="body2" color="text.secondary">
          حداقل یک تصویر برای محصول انتخاب کنید.
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {selectedImages.length === 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            لطفاً حداقل یک تصویر انتخاب کنید
          </Alert>
        )}

        {selectedImages.length > 0 && !hasProductImage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            حداقل یکی از تصاویر انتخاب شده باید عکس محصول (product) باشد
          </Alert>
        )}

        <ImageSelector
          selectedImages={selectedImages}
          onImagesChange={onImageSelectionChange}
          defaultType={MediaType.PRODUCT}
        />
      </Box>

      <Box
        sx={{
          p: 3,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="outlined" onClick={onBack}>
          مرحله قبل
        </Button>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {selectedImages.length > 0 && hasProductImage && " ✓"}
          </Typography>
          <Button variant="contained" onClick={handleNext} disabled={!isValid}>
            مرحله بعد
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProductImageSelection;
