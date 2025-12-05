import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { GalleryIcon } from "~/components/icons/IconComponents";
import { useImages } from "~/api/gallery.api";
import { MediaManager, MediaGrid } from "~/components/MediaManager";
import { SearchInput } from "~/components/common";
import type { SelectChangeEvent } from "@mui/material";
import type { IGallery } from "~/types/interfaces/gallery.interface";
import { fixImageUrl } from "~/utils/imageUtils";
import { MediaType } from "../MediaManager/FileUpload";

interface ImageSelectorProps {
  selectedImages: number[];
  onImagesChange: (images: number[]) => void;
  label?: string;
  helperText?: string;
  packaging?: boolean;
  product?: boolean;
  defaultType?: MediaType;
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
  packaging = false,
  product = false,
  defaultType,
}) => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchValue, setSearchValue] = useState<string>("");
  const [tempSelectedImages, setTempSelectedImages] = useState<string[]>([]);

  const [previewPage, setPreviewPage] = useState<number>(1);
  const [previewPageSize, setPreviewPageSize] = useState<number>(8);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const skip = (page - 1) * pageSize;

  const {
    data: imagesData,
    isLoading,
    error: apiError,
  } = useImages({
    skip,
    limit: pageSize,
    search_title: searchValue,
    packaging: packaging,
    product: product,
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

  const handleRemoveImage = (imageId: string) => {
    const numericId = parseInt(imageId);
    const newImages = selectedImages.filter((id) => id !== numericId);
    onImagesChange(newImages);

    // Check if current page becomes empty after deletion
    const newTotalItems = newImages.length;
    const totalPages = Math.ceil(newTotalItems / previewPageSize);
    if (previewPage > totalPages && totalPages > 0) {
      setPreviewPage(totalPages);
    }
  };

  const handlePreviewPageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPreviewPage(newPage);
  };

  const handlePreviewPageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = event.target.value as number;
    setPreviewPageSize(newPageSize);
    setPreviewPage(1);
  };

  // Get selected image details for preview - convert to MediaFile format
  const selectedImageFiles: IMediaFile[] = selectedImages
    .map((id) => {
      const item = galleryData.find((img: IGallery) => img.id === id);
      return item
        ? {
            _id: item.id.toString(),
            filename: item.title,
            filepath: fixImageUrl(item.image_url),
            size: 0,
            mimetype: "image/jpeg",
            createdAt: new Date().toISOString(),
            packaging: item.packaging,
            product: item.product,
          }
        : null;
    })
    .filter(Boolean) as IMediaFile[];

  // Slice the media files for current page
  const startIndex = (previewPage - 1) * previewPageSize;
  const endIndex = startIndex + previewPageSize;
  const paginatedSelectedFiles = selectedImageFiles.slice(startIndex, endIndex);

  return (
    <Box>
      {/* Main selector button */}
      <Button
        variant="outlined"
        startIcon={<GalleryIcon />}
        onClick={() => setOpen(true)}
        fullWidth
        sx={{ mb: 2, py: 1.5 }}
      >
        {selectedImages.length > 0 ? `انتخاب تصویر` : label}
      </Button>

      {/* Selected images preview */}
      {selectedImages.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            تصاویر انتخاب شده:
          </Typography>
          <MediaGrid
            media={paginatedSelectedFiles}
            loading={false}
            currentPage={previewPage}
            totalItems={selectedImageFiles.length}
            pageSize={previewPageSize}
            onPageChange={handlePreviewPageChange}
            onPageSizeChange={handlePreviewPageSizeChange}
            pageSizeOptions={[4, 8, 12, 16]}
            onDelete={handleRemoveImage}
            selectionMode={false}
          />
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
          <Box>
            <FormControlLabel
              label="بارگزاری تصویر جدید"
              control={
                <Switch
                  checked={showUpload}
                  onChange={(e) => setShowUpload(e.target.checked)}
                  color="primary"
                  inputProps={{ "aria-label": "Show upload area" }}
                />
              }
            />
          </Box>
          <MediaManager
            media={mediaFiles}
            loading={isLoading}
            currentPage={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showUpload={showUpload}
            selectionMode={true}
            selectedItems={tempSelectedImages}
            onSelectionChange={handleSelectionChange}
            defaultType={defaultType}
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
