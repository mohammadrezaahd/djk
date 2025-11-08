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
  Button,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useSnackbar } from "notistack";
import AppLayout from "~/components/layout/AppLayout";
import { MediaManager } from "~/components/MediaManager";
import { useImages, useRemoveImage } from "~/api/gallery.api";
import { ApiStatus } from "~/types";
import type { IGallery } from "~/types/interfaces/gallery.interface";
import { fixImageUrl } from "~/utils/imageUtils";
import TitleCard from "~/components/common/TitleCard";

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
  const [editImageId, setEditImageId] = useState<number | null>(null);

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
  const { mutateAsync: removeImage, isPending: isRemovingImage } =
    useRemoveImage();

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
    setEditImageId(parseInt(id));
  };

  const handleEditComplete = () => {
    setEditImageId(null);
    refetch();
  };

  const handleDelete = (id: string) => {
    const item = galleryData.find((img) => img.id.toString() === id);

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
      enqueueSnackbar(`خطا در حذف تصویر: ${error.message}`, {
        variant: "error",
      });
    } finally {
      setDeleteDialog({ open: false, id: null, title: "" });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, id: null, title: "" });
  };

  const galleryData = imagesData?.data?.list || [];

  // بررسی خطا در دریافت لیست عکس‌ها
  const hasImagesFetchError =
    imagesData?.status !== ApiStatus.SUCCEEDED &&
    imagesData?.status !== undefined;

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

  return (
    <AppLayout title="مدیریت رسانه">
      <Container maxWidth="lg">
        <TitleCard
          title="مدیریت رسانه "
          description="مدیریت و ویرایش رسانه‌های بارگذاری شده و بارگزاری رسانه جدید"
        />

        {(error || hasImagesFetchError) && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error ||
              (hasImagesFetchError && imagesData?.message) ||
              "خطا در بارگیری داده‌ها"}
          </Alert>
        )}

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
            showUpload={true}
            // FileUpload props
            allowedType="none"
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            editImageId={editImageId}
            onEditComplete={handleEditComplete}
            // SearchInput props
            onSearchChange={handleSearchChange}
            searchLabel="جستجو در عناوین"
            searchPlaceholder="عنوان تصویر را جستجو کنید..."
            showSearch={true}
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
            showUpload={true}
            // FileUpload props
            allowedType="none"
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            editImageId={editImageId}
            onEditComplete={handleEditComplete}
            // SearchInput props
            onSearchChange={handleSearchChange}
            searchLabel="جستجو در عناوین"
            searchPlaceholder="عنوان تصویر را جستجو کنید..."
            showSearch={true}
          />
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        disableScrollLock={true}
      >
        <DialogTitle>تایید حذف تصویر</DialogTitle>
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
