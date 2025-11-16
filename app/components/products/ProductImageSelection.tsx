import React from "react";
import { Card, CardContent, Grid, Button } from "@mui/material";
import ImageSelector from "../../components/templates/ImageSelector";
import { MediaType } from "../../components/MediaManager/FileUpload";
import { useSelectedImages } from "../../api/gallery.api";

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
  const { data: selectedImagesData } = useSelectedImages(selectedImages);

  const hasProductImage =
    selectedImagesData?.data?.list?.some((img) => img.product === true) ||
    false;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <ImageSelector
          selectedImages={selectedImages}
          onImagesChange={onImageSelectionChange}
        />
        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            مرحله قبل
          </Button>
          <Button
            variant="contained"
            onClick={onNext}
            disabled={selectedImages.length === 0 || !hasProductImage}
          >
            مرحله بعد
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductImageSelection;