import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import { useImages } from "~/api/gallery.api";
import { MediaManager } from "~/components/MediaManager";
import { SearchInput } from "~/components/common";
import type { SelectChangeEvent } from "@mui/material";
import type { IGallery } from "~/types/interfaces/gallery.interface";
import { fixImageUrl } from "~/utils/imageUtils";

interface ImageSelectorProps {
  selectedImages: number[];
  onImagesChange: (images: number[]) => void;
  label?: string;
  helperText?: string;
}

// Media file interface matching MediaManager
interface IMediaFile {
  _id: string;
  filename: string;
  filepath: string;
  size: number;
  mimetype: string;
  createdAt: string;
  packaging?: boolean;
  product?: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImages,
  onImagesChange,
  label = "تصاویر",
  helperText = "تصاویر مورد نظر را انتخاب کنید",
}) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchValue, setSearchValue] = useState<string>("");
  const [tempSelectedImages, setTempSelectedImages] = useState<string[]>([]);

  const skip = (page - 1) * pageSize;

  const {
    data: imagesData,
    isLoading,
    error: apiError,
  } = useImages({
    skip,
    limit: pageSize,
    search_title: searchValue,
  });

  const galleryData = imagesData?.data?.list || [];

  // Convert gallery data to media files format
  const mediaFiles: IMediaFile[] = galleryData.map((item: IGallery) => ({
    _id: item.id.toString(),
    filename: item.title,
    filepath: fixImageUrl(item.image_url),
    size: 0,
    mimetype: "image/jpeg",
    createdAt: new Date().toISOString(),
    packaging: item.packaging,
    product: item.product,
  }));

  const totalItems = mediaFiles.length;

  // Initialize temp selection when dialog opens
  useEffect(() => {
    if (open) {
      setTempSelectedImages(selectedImages.map((id) => id.toString()));
    }
  }, [open, selectedImages]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = event.target.value as number;
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
    setPage(1);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setTempSelectedImages(selectedIds);
  };

  const handleConfirm = () => {
    const numericIds = tempSelectedImages.map((id) => parseInt(id));
    onImagesChange(numericIds);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedImages(selectedImages.map((id) => id.toString()));
    setOpen(false);
  };

  const handleRemoveImage = (imageId: number) => {
    const newImages = selectedImages.filter((id) => id !== imageId);
    onImagesChange(newImages);
  };

  // Get selected image details for preview
  const selectedImageDetails = selectedImages
    .map((id) => {
      const item = galleryData.find((img: IGallery) => img.id === id);
      return item
        ? {
            id: item.id,
            title: item.title,
            image_url: fixImageUrl(item.image_url),
            packaging: item.packaging,
            product: item.product,
          }
        : null;
    })
    .filter(Boolean);

  return (
    <Box>
      {/* Main selector button */}
      <Button
        variant="outlined"
        startIcon={<PhotoLibraryIcon />}
        onClick={() => setOpen(true)}
        fullWidth
        sx={{ mb: 2, py: 1.5 }}
      >
        {selectedImages.length > 0
          ? `${selectedImages.length} تصویر انتخاب شده`
          : label}
      </Button>

      {/* Selected images preview */}
      {selectedImages.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            تصاویر انتخاب شده:
          </Typography>
          <Grid container spacing={2}>
            {selectedImageDetails.map(
              (image) =>
                image && (
                  <Grid key={image.id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Card sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={image.image_url}
                        alt={image.title}
                        sx={{ objectFit: "cover" }}
                      />

                      {/* Image type badge */}
                      <Chip
                        label={
                          image.packaging
                            ? "عکس دسته‌بندی"
                            : image.product
                              ? "عکس محصول"
                              : "عکس عمومی"
                        }
                        size="small"
                        color={
                          image.packaging
                            ? "secondary"
                            : image.product
                              ? "primary"
                              : "default"
                        }
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          fontSize: "0.6rem",
                        }}
                      />

                      {/* Remove button */}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveImage(image.id)}
                        sx={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 1)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                      <Box sx={{ p: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {image.title}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                )
            )}
          </Grid>
        </Box>
      )}

      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}

      {/* Selection dialog */}
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { height: "80vh" } }}
        disableScrollLock={true}
      >
        <DialogTitle>انتخاب تصاویر</DialogTitle>

        <DialogContent sx={{ scrollbarWidth: "none" }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              خطا در بارگیری تصاویر
            </Alert>
          )}

          {/* Search */}
          <SearchInput
            onSearchChange={handleSearchChange}
            label="جستجو در عناوین"
            placeholder="عنوان تصویر را جستجو کنید..."
            sx={{ mb: 2, maxWidth: 300 }}
          />

          {/* Selected count */}
          {tempSelectedImages.length > 0 && (
            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
              {tempSelectedImages.length} تصویر انتخاب شده
            </Typography>
          )}

          {/* Media grid */}
          <MediaManager
            media={mediaFiles}
            loading={isLoading}
            currentPage={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showUpload={false}
            selectionMode={true}
            selectedItems={tempSelectedImages}
            onSelectionChange={handleSelectionChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            لغو
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            تایید ({tempSelectedImages.length} تصویر)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageSelector;
