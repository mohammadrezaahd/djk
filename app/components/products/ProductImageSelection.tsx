import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelectedImages } from "~/api/gallery.api";
import { MediaGrid } from "~/components/MediaManager";
import type { IGallery } from "~/types/interfaces/gallery.interface";

interface ProductImageSelectionProps {
  imageOptions: number[];
  selectedImages: number[];
  onImageSelectionChange: (selectedIds: number[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProductImageSelection: React.FC<ProductImageSelectionProps> = ({
  imageOptions,
  selectedImages,
  onImageSelectionChange,
  onNext,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Fetch images data using useSelectedImages
  const {
    data: imagesData,
    isLoading,
    error,
  } = useSelectedImages(imageOptions);

  const images: IGallery[] = imagesData?.data?.list || [];

  // Convert IGallery to IMediaFile format for MediaGrid compatibility
  const mediaFiles = images.map((image) => ({
    _id: image.id.toString(),
    filename: image.title || `Image ${image.id}`,
    filepath: image.image_url,
    size: 0, // Not available in IGallery interface
    mimetype: "image/jpeg", // Default mimetype
    createdAt: new Date().toISOString(), // Default date since not available in IGallery
    packaging: image.packaging || false,
    product: image.product || false,
  }));

  // Pagination logic (client-side since we have all images)
  const totalItems = mediaFiles.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMedia = mediaFiles.slice(startIndex, endIndex);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handlePageSizeChange = (event: any) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    // Convert string IDs back to numbers
    const numericIds = selectedIds.map((id) => parseInt(id, 10));
    onImageSelectionChange(numericIds);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          خطا در بارگذاری تصاویر
        </Typography>
        <Typography variant="body2" color="text.secondary">
          لطفاً دوباره تلاش کنید.
        </Typography>
      </Paper>
    );
  }

  if (imageOptions.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          انتخاب تصاویر محصول
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          هیچ تصویری از قالب‌های انتخاب شده یافت نشد.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
          >
            بازگشت
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={onNext}
          >
            ادامه
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        انتخاب تصاویر محصول
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        تصاویر مناسب برای محصول خود را انتخاب کنید. این تصاویر از قالب‌های
        انتخاب شده شما استخراج شده‌اند.
      </Typography>

      {mediaFiles.length > 0 ? (
        <MediaGrid
          media={paginatedMedia}
          loading={isLoading}
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[12, 24, 48]}
          selectionMode={true}
          selectedItems={selectedImages.map((id) => id.toString())}
          onSelectionChange={handleSelectionChange}
        />
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            تصاویری برای نمایش یافت نشد.
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          مرحله قبل
        </Button>
        <Button variant="contained" onClick={onNext}>
          مرحله بعد
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductImageSelection;
