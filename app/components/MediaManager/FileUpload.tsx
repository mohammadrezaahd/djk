import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSnackbar } from "notistack";
import { useAddImage, useEditImage, useImage } from "~/api/gallery.api";
import { ApiStatus } from "~/types";
import { useGalleryValidation, convertGalleryFormToApi } from "~/validation";
import type { IGallery } from "~/types/interfaces/gallery.interface";
import { fixImageUrl } from "~/utils/imageUtils";

const MEDIA_FILTER_TYPES = [
  {
    value: "packaging",
    label: "عکس بسته‌بندی",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  {
    value: "product",
    label: "عکس محصول",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  {
    value: "none",
    label: "هیچکدام",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
];

interface FileUploadProps {
  allowedType?: "packaging" | "product" | "none";
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
  editImageId?: number | null;
  onEditComplete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  allowedType = "none",
  onUploadSuccess,
  onUploadError,
  editImageId = null,
  onEditComplete,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const addImageMutation = useAddImage();
  const editImageMutation = useEditImage();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch image data for editing
  const {
    data: editImageData,
    isLoading: isLoadingEditData,
    error: editDataError,
  } = useImage(editImageId || 0);

  // Use validation hook
  const form = useGalleryValidation(allowedType, isEditMode);
  const { handleSubmit, setValue, watch, formState: { errors, isValid }, reset } = form;

  // Watch form values
  const selectedFile = watch('file');
  const title = watch('title');
  const currentAllowedType = watch('type');

  // Effect to handle edit mode
  useEffect(() => {
    if (editImageId && editImageData?.data && !isEditMode) {
      const imageData = editImageData.data;
      setIsEditMode(true);
      
      // Set form values from edit data
      setValue('title', imageData.title);
      
      // Set type based on packaging/product flags
      if (imageData.packaging) {
        setValue('type', 'packaging');
      } else if (imageData.product) {
        setValue('type', 'product');
      } else {
        setValue('type', 'none');
      }
      
      // Set preview URL from existing image
      setPreviewUrl(fixImageUrl(imageData.image_url));
      
      // In edit mode, file is not required, so we set it to null but preview remains
      setValue('file', null);
    } else if (!editImageId && isEditMode) {
      setIsEditMode(false);
      // Reset form to default values
      const defaultValues = {
        title: '',
        type: allowedType !== 'none' ? allowedType : 'none' as any,
        file: null
      };
      reset(defaultValues);
      setPreviewUrl("");
    }
  }, [editImageId, editImageData?.data, isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setValue('file', file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else if (!isEditMode) {
      // Only clear preview if not in edit mode
      setPreviewUrl("");
      setValue('file', null);
    }
  };

  const handleUpload = handleSubmit(async (formData) => {
    try {
      if (isEditMode && editImageId) {
        // Edit mode: call edit API
        const editData = {
          title: formData.title.trim(),
          packaging: formData.type === 'packaging',
          product: formData.type === 'product',
          source: 'app' as any,
          tag: 'edit',
          file: formData.file as File, // file can be null in edit mode if not changing
        };

        const result = await editImageMutation.mutateAsync({
          id: editImageId,
          data: editData,
        });

        // بررسی موفقیت با ApiStatus
        if (result.status === ApiStatus.SUCCEEDED) {
          enqueueSnackbar("تصویر با موفقیت ویرایش شد!", { variant: "success" });
          if (onEditComplete) onEditComplete();
        } else {
          throw new Error(result.message || "ویرایش ناموفق بود");
        }
      } else {
        // Add mode: call add API
        const uploadData = convertGalleryFormToApi(formData);
        const result = await addImageMutation.mutateAsync(uploadData);

        // بررسی موفقیت با ApiStatus
        if (result.status === ApiStatus.SUCCEEDED) {
          // Reset form after successful upload
          const defaultValues = {
            title: '',
            type: allowedType !== 'none' ? allowedType : 'none' as any,
            file: null
          };
          reset(defaultValues);
          setPreviewUrl("");

          const fileInput = document.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";

          // نمایش snackbar موفقیت
          enqueueSnackbar("تصویر با موفقیت آپلود شد!", { variant: "success" });

          if (onUploadSuccess) onUploadSuccess();
        } else {
          throw new Error(result.message || "آپلود ناموفق بود");
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || (isEditMode ? "ویرایش ناموفق بود" : "آپلود ناموفق بود");

      // نمایش snackbar خطا
      enqueueSnackbar(errorMsg, { variant: "error" });

      if (onUploadError) onUploadError(errorMsg);
    }
  });

  const handleAllowedTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as "packaging" | "product" | "none";
    setValue('type', newType);
  };

  // Check if form is valid - in edit mode, file is optional
  const isFormValidForSubmit = isEditMode 
    ? (title && title.trim().length >= 3) // In edit mode, only title is required
    : isValid; // In add mode, all fields including file are required

  const isSubmitDisabled = !isFormValidForSubmit || 
    addImageMutation.isPending || 
    editImageMutation.isPending ||
    isLoadingEditData;

  const getSelectedFilterType = () => {
    return MEDIA_FILTER_TYPES.find((ft) => ft.value === currentAllowedType);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditMode ? "ویرایش تصویر" : "آپلود تصویر"}
      </Typography>

      {isLoadingEditData && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 2 }}>در حال بارگیری اطلاعات...</Typography>
        </Box>
      )}

      {editDataError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در بارگیری اطلاعات تصویر
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* ردیف بالا: مربع آپلود + نوع تصویر + عنوان تصویر */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { 
              xs: "1fr", 
              sm: "auto auto", 
              md: "auto 1fr 1fr" 
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* مربع انتخاب فایل */}
          <Box sx={{ position: "relative", gridRow: { xs: "1", sm: "1 / 3", md: "1" } }}>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={addImageMutation.isPending || editImageMutation.isPending || isLoadingEditData}
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            />
            <label htmlFor="file-upload">
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  border: "2px dashed",
                  borderColor: selectedFile 
                    ? (errors.file ? "error.main" : "primary.main") 
                    : (errors.file ? "error.main" : "grey.400"),
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: (addImageMutation.isPending || editImageMutation.isPending || isLoadingEditData) ? "not-allowed" : "pointer",
                  bgcolor: selectedFile 
                    ? (errors.file ? "error.50" : "primary.50") 
                    : (errors.file ? "error.50" : "grey.50"),
                  transition: "all 0.2s ease-in-out",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.50",
                  },
                }}
              >
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                ) : (
                  <>
                    <CloudUploadIcon
                      sx={{
                        fontSize: 40,
                        color: selectedFile ? "primary.main" : "grey.500",
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color={selectedFile ? "primary.main" : "text.secondary"}
                      textAlign="center"
                      sx={{ px: 1 }}
                    >
                      {selectedFile 
                        ? "فایل انتخاب شده" 
                        : isEditMode 
                          ? "انتخاب فایل جدید (اختیاری)" 
                          : "انتخاب فایل"}
                    </Typography>
                  </>
                )}
              </Box>
            </label>
          </Box>

          {/* نوع تصویر */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
              نوع تصویر
            </Typography>
            <FormControl variant="outlined" size="small" fullWidth error={!!errors.type}>
              <InputLabel>نوع تصویر</InputLabel>
              <Select
                value={currentAllowedType}
                onChange={handleAllowedTypeChange}
                label="نوع تصویر"
                disabled={addImageMutation.isPending || editImageMutation.isPending || isLoadingEditData}
                MenuProps={{
                  disablePortal: true,
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      maxHeight: 240,
                      overflow: 'auto',
                    },
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  slotProps: {
                    backdrop: {
                      sx: {
                        backgroundColor: 'transparent',
                      },
                    },
                  },
                }}
              >
                {MEDIA_FILTER_TYPES.map((filterType) => (
                  <MenuItem key={filterType.value} value={filterType.value}>
                    {filterType.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.type.message}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* عنوان تصویر */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
              عنوان تصویر
            </Typography>
            <TextField
              value={title}
              onChange={(e) => setValue('title', e.target.value, { shouldValidate: true })}
              variant="outlined"
              size="small"
              disabled={addImageMutation.isPending}
              required
              placeholder="عنوان تصویر را وارد کنید"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Box>
        </Box>

        {/* ردیف پایین: فرمت‌های پشتیبانی و اطلاعات فایل */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {/* فرمت‌های پشتیبانی شده */}
          {getSelectedFilterType() && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "info.main",
                color: "info.contrastText",
                borderRadius: 1,
                opacity: 0.9,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                فرمت‌های پشتیبانی شده:
              </Typography>
              <Typography variant="caption">
                {getSelectedFilterType()?.extensions.join(", ")}
              </Typography>
            </Box>
          )}

          {/* اطلاعات فایل انتخاب شده */}
          <Box
            sx={{
              p: 2,
              backgroundColor: selectedFile ? "action.hover" : "grey.100",
              borderRadius: 1,
              border: "1px solid",
              borderColor: selectedFile ? "divider" : "grey.300",
              opacity: selectedFile ? 1 : 0.6,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", display: "block", mb: 1 }}
            >
              اطلاعات فایل:
            </Typography>
            {selectedFile ? (
              <>
                <Typography variant="caption" display="block">
                  نام: {selectedFile.name}
                </Typography>
                <Typography variant="caption" display="block">
                  حجم: {formatFileSize(selectedFile.size)}
                </Typography>
                <Typography variant="caption" display="block">
                  نوع: {selectedFile.type}
                </Typography>
                <Typography variant="caption" display="block">
                  آخرین تغییر:{" "}
                  {new Date(selectedFile.lastModified).toLocaleDateString(
                    "fa-IR"
                  )}
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                هیچ فایلی انتخاب نشده است.
                <br />
                برای انتخاب فایل، روی مربع بالا کلیک کنید.
              </Typography>
            )}
          </Box>
        </Box>

        {/* دکمه آپلود در پایین به صورت full width */}
        <Button
          variant="contained"
          size="large"
          onClick={handleUpload}
          disabled={isSubmitDisabled}
          fullWidth
          sx={{
            minHeight: 56,
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: 3,
            mt: 1,
            "&:hover": {
              boxShadow: 6,
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              boxShadow: 1,
            },
          }}
        >
          {(addImageMutation.isPending || editImageMutation.isPending) ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={24} color="inherit" />
              {isEditMode ? "در حال ویرایش..." : "در حال آپلود..."}
            </Box>
          ) : (
            isEditMode ? "ویرایش تصویر" : "آپلود تصویر"
          )}
        </Button>
      </Box>

      {/* Display validation errors */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error?.message}</div>
          ))}
        </Alert>
      )}
    </Paper>
  );
};

export default FileUpload;