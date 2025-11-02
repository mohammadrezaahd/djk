import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Alert, 
  Box, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useSnackbar } from "notistack";
import AppLayout from "~/components/layout/AppLayout";
import { MediaManager, FileUpload } from "~/components/MediaManager";
import { SearchInput } from "~/components/common";
import { useImages, useRemoveImage } from "~/api/gallery.api";
import { ApiStatus } from "~/types";
import type { IGallery } from "~/types/interfaces/gallery.interface";

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

const GalleryPage = () => {
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [apiSearchValue, setApiSearchValue] = useState<string>(""); // فقط مقدار برای API

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
    title: string;
  }>({
    open: false,
    id: null,
    title: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  const skip = (page - 1) * pageSize;

  const {
    data: imagesData,
    isLoading,
    error: apiError,
    refetch,
  } = useImages({
    skip,
    limit: pageSize,
    search_title: apiSearchValue,
  });

  // Delete mutation
  const {
    mutateAsync: removeImage,
    isPending: isRemovingImage,
  } = useRemoveImage();

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

  const handleUploadSuccess = () => {
    refetch();
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSearchChange = (searchValue: string) => {
    setApiSearchValue(searchValue);
    setPage(1); // Reset to first page when searching
  };

  const handleEdit = (id: string) => {
    console.log("Edit image with id:", id);
  };

  const handleDelete = (id: string) => {
    const item = galleryData.find(img => img.id.toString() === id);
    
    setDeleteDialog({
      open: true,
      id,
      title: item?.title || "تصویر انتخاب شده",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      await removeImage(parseInt(deleteDialog.id));
      enqueueSnackbar("تصویر با موفقیت حذف شد", { variant: "success" });
      // Refresh the images list
      await refetch();
    } catch (error: any) {
      enqueueSnackbar(`خطا در حذف تصویر: ${error.message}`, { variant: "error" });
    } finally {
      setDeleteDialog({ open: false, id: null, title: "" });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, id: null, title: "" });
  };

  const galleryData = imagesData?.data?.list || [];
  
  // بررسی خطا در دریافت لیست عکس‌ها
  const hasImagesFetchError = imagesData?.status !== ApiStatus.SUCCEEDED && imagesData?.status !== undefined;
  
  const mediaFiles: IMediaFile[] = galleryData.map((item: IGallery) => ({
    _id: item.id.toString(),
    filename: item.title,
    filepath: item.image_url,
    size: 0,
    mimetype: "image/jpeg",
    createdAt: new Date().toISOString(),
    packaging: item.packaging,
    product: item.product,
  }));

  const totalItems = mediaFiles.length;

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          مدیریت رسانه
        </Typography>

        {(error || hasImagesFetchError) && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error || (hasImagesFetchError && imagesData?.message) || "خطا در بارگیری داده‌ها"}
          </Alert>
        )}

        {/* File Upload */}
        <FileUpload
          allowedType="none"
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        {/* Search Filter */}
        <SearchInput
          onSearchChange={handleSearchChange}
          label="جستجو در عناوین"
          placeholder="عنوان تصویر را جستجو کنید..."
          sx={{ mb: 2, maxWidth: 300 }}
        />

        {!isLoading && (
          <MediaManager
            media={mediaFiles}
            onDelete={handleDelete}
            onEdit={handleEdit}
            loading={isLoading}
            currentPage={page}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showUpload={false}
          />
        )}

        {isLoading && (
          <MediaManager
            media={[]}
            onDelete={handleDelete}
            onEdit={handleEdit}
            loading={isLoading}
            currentPage={page}
            totalItems={0}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showUpload={false}
          />
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          تایید حذف تصویر
        </DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف "{deleteDialog.title}" اطمینان دارید؟
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            این عمل قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            لغو
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isRemovingImage}
          >
            {isRemovingImage ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default GalleryPage;
