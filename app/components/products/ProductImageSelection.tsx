import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelectedImages } from "~/api/gallery.api";
import { MediaManager } from "~/components/MediaManager";
import { MediaType } from "~/components/MediaManager/FileUpload";
import type { IGallery } from "~/types/interfaces/gallery.interface";

export enum MediaTypeCategory {
  PACKAGING = "packaging",
  PRODUCT = "product",
  NONE = "none",
}

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
    refetch,
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

  // Categorize media
  const packagingMedia = mediaFiles.filter((m) => !!m.packaging);
  const productMedia = mediaFiles.filter((m) => !!m.product);
  const noneMedia = mediaFiles.filter((m) => !m.packaging && !m.product);

  const [activeTab, setActiveTab] = useState<
    "all" | "packaging" | "product" | "none"
  >("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDefaultType, setUploadDefaultType] = useState<
    MediaType | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as any);
    setCurrentPage(1);
  };

  const filteredMedia = useMemo(() => {
    switch (activeTab) {
      case "packaging":
        return packagingMedia;
      case "product":
        return productMedia;
      case "none":
        return noneMedia;
      default:
        return mediaFiles;
    }
  }, [activeTab, mediaFiles]);

  const totalFilteredItems = filteredMedia.length;
  const paginatedFilteredMedia = filteredMedia.slice(startIndex, endIndex);

  // Helper to map selected numeric ids to media objects
  const selectedMediaObjects = useMemo(() => {
    const ids = new Set(selectedImages.map((id) => id.toString()));
    return mediaFiles.filter((m) => ids.has(m._id));
  }, [selectedImages, mediaFiles]);

  // Validation + next handler
  const handleNext = () => {
    setErrorMessage(null);

    // 1) Ensure at least one image is selected
    if (!selectedImages || selectedImages.length === 0) {
      setErrorMessage("لطفاً حداقل یک تصویر انتخاب کنید.");
      return;
    }

    // 2) Ensure among selected images there's at least one product image
    const hasProductInSelection = selectedMediaObjects.some((m) => !!m.product);
    if (!hasProductInSelection) {
      // If there are no product images at all in the fetched media, open upload with product default
      const hasAnyProduct = productMedia.length > 0;
      if (!hasAnyProduct) {
        setErrorMessage(
          "تصویر محصول وجود ندارد. لطفاً یک تصویر محصول آپلود کنید."
        );
        setUploadDefaultType(MediaType.PRODUCT);
        setShowUpload(true);
        setActiveTab("product");
        return;
      }

      // If there are product images but not selected, instruct user to select at least one product image
      setErrorMessage(
        "لطفاً حداقل یک تصویر محصول را نیز از تصاویر انتخاب‌شده وارد کنید."
      );
      setActiveTab("product");
      return;
    }

    // All validations passed
    onNext();
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

      <Stack spacing={2} sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`همه (${mediaFiles.length})`} value="all" />
          <Tab label={`محصول (${productMedia.length})`} value="product" />
          <Tab
            label={`بسته‌بندی (${packagingMedia.length})`}
            value="packaging"
          />
        </Tabs>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>

      {totalFilteredItems > 0 ? (
        <MediaManager
          media={paginatedFilteredMedia}
          loading={isLoading}
          currentPage={currentPage}
          totalItems={totalFilteredItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[12, 24, 48]}
          selectionMode={true}
          selectedItems={selectedImages.map((id) => id.toString())}
          onSelectionChange={handleSelectionChange}
          showUpload={showUpload}
          defaultType={uploadDefaultType}
          onUploadSuccess={() => {
            // Refresh images and clear upload panel / errors
            if (refetch) refetch();
            setShowUpload(false);
            setUploadDefaultType(undefined);
            setErrorMessage(null);
          }}
          onUploadError={(err: any) => {
            setErrorMessage(typeof err === "string" ? err : "خطا در آپلود");
          }}
        />
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            تصاویری برای نمایش یافت نشد.
          </Typography>
          {/* If no images at all, show upload area */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setUploadDefaultType(MediaType.PRODUCT);
                setShowUpload(true);
              }}
            >
              آپلود تصویر
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          مرحله قبل
        </Button>
        <Button variant="contained" onClick={handleNext}>
          مرحله بعد
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductImageSelection;
