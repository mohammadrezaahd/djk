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
  FormControlLabel,
  Switch,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { CloudUploadIcon } from "../icons/IconComponents";
import { useSnackbar } from "notistack";
import { useAddImage, useEditImage, useImage } from "~/api/gallery.api";
import { ApiStatus } from "~/types";
import { useGalleryValidation, convertGalleryFormToApi } from "~/validation";
import { fixImageUrl } from "~/utils/imageUtils";

export enum MediaType {
  PACKAGING = "packaging",
  PRODUCT = "product",
  NONE = "none",
}

const MEDIA_FILTER_TYPES = [
  {
    value: MediaType.PACKAGING,
    label: "عکس بسته‌بندی",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  {
    value: MediaType.PRODUCT,
    label: "عکس محصول",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  {
    value: MediaType.NONE,
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
  allowMultiple?: boolean; // New prop for enabling multiple file upload
  defaultType?: MediaType; // New prop for default type value (makes field readonly)
}

const FileUpload: React.FC<FileUploadProps> = ({
  allowedType = MediaType.NONE,
  onUploadSuccess,
  onUploadError,
  editImageId = null,
  onEditComplete,
  allowMultiple = false,
  defaultType, // New prop for default type value
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // For multiple files
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

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
  const form = useGalleryValidation(
    defaultType || allowedType,
    isEditMode,
    false
  ); // Use defaultType if provided
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
  } = form;

  // Watch form values
  const selectedFile = watch("file");
  const title = watch("title");
  const currentAllowedType = watch("type");
  const isMultipleUpload = watch("multipleUpload") || false;

  // Effect to handle edit mode
  useEffect(() => {
    if (editImageId && editImageData?.data && !isEditMode) {
      const imageData = editImageData.data;
      setIsEditMode(true);

      // Set form values from edit data
      setValue("title", imageData.title);

      // Set type based on packaging/product flags
      if (imageData.packaging) {
        setValue("type", "packaging");
      } else if (imageData.product) {
        setValue("type", "product");
      } else {
        setValue("type", "none");
      }

      // Set preview URL from existing image
      setPreviewUrl(fixImageUrl(imageData.image_url));

      // In edit mode, file is not required, so we set it to null but preview remains
      setValue("file", null);
    } else if (!editImageId && isEditMode) {
      setIsEditMode(false);
      // Reset form to default values
      const defaultValues = {
        title: "",
        type:
          defaultType ||
          ((allowedType !== "none" ? allowedType : "none") as any),
        file: null,
      };
      reset(defaultValues);
      setPreviewUrl("");
    }
  }, [editImageId, editImageData?.data, isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isMultipleUpload) {
        // Multiple file selection
        const filesArray = Array.from(e.target.files);
        processFiles(filesArray);
      } else {
        // Single file selection
        const file = e.target.files[0];
        processFile(file);
      }
    } else if (!isEditMode) {
      // Only clear preview if not in edit mode
      setPreviewUrl("");
      setPreviewUrls([]);
      setValue("file", null);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
    ];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      enqueueSnackbar("فرمت فایل پشتیبانی نمی‌شود", { variant: "error" });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      enqueueSnackbar("حجم فایل نباید بیشتر از 10 مگابایت باشد", {
        variant: "error",
      });
      return;
    }

    setValue("file", file);
    setValue("multipleUpload", false);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
        setPreviewUrls([]); // Clear multiple previews
      }
    };
    reader.readAsDataURL(file);
  };

  const processFiles = (files: File[]) => {
    // Validate file count
    if (files.length > 10) {
      enqueueSnackbar("حداکثر 10 فایل مجاز است", { variant: "error" });
      return;
    }

    // Validate each file
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        enqueueSnackbar(`فرمت فایل ${file.name} پشتیبانی نمی‌شود`, {
          variant: "error",
        });
        return;
      }

      if (file.size > maxSize) {
        enqueueSnackbar(
          `حجم فایل ${file.name} نباید بیشتر از 10 مگابایت باشد`,
          { variant: "error" }
        );
        return;
      }
    }

    setValue("file", files);
    setValue("multipleUpload", true);
    setValue("title", ""); // Clear title for multiple upload

    // Create preview URLs
    const readers = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((urls) => {
      setPreviewUrls(urls);
      setPreviewUrl(""); // Clear single preview
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      !isDragOver &&
      !addImageMutation.isPending &&
      !editImageMutation.isPending &&
      !isLoadingEditData
    ) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (
      addImageMutation.isPending ||
      editImageMutation.isPending ||
      isLoadingEditData
    ) {
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (isMultipleUpload && files.length > 1) {
        // Multiple files dropped
        const filesArray = Array.from(files);
        processFiles(filesArray);
      } else {
        // Single file dropped
        const file = files[0];
        processFile(file);
      }
    }
  };

  // Global drag and drop handlers for the entire component
  const handleGlobalDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      !isDragOver &&
      !addImageMutation.isPending &&
      !editImageMutation.isPending &&
      !isLoadingEditData
    ) {
      setIsDragOver(true);
    }
  };

  const handleGlobalDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if we're leaving the paper container entirely
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleGlobalDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (
      addImageMutation.isPending ||
      editImageMutation.isPending ||
      isLoadingEditData
    ) {
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (isMultipleUpload && files.length > 1) {
        // Multiple files dropped
        const filesArray = Array.from(files);
        processFiles(filesArray);
      } else {
        // Single file dropped
        const file = files[0];
        processFile(file);
      }
    }
  };

  const handleUpload = handleSubmit(async (formData) => {
    try {
      if (isEditMode && editImageId) {
        // Edit mode: call edit API
        const editData = {
          title: formData.title.trim(),
          packaging: formData.type === "packaging",
          product: formData.type === "product",
          source: "app" as any,
          tag: "edit",
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
            title: "",
            type:
              defaultType ||
              ((allowedType !== "none" ? allowedType : "none") as any),
            file: null,
            multipleUpload: false, // Reset to single mode
          };
          reset(defaultValues);
          setPreviewUrl("");
          setPreviewUrls([]);

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
      const errorMsg =
        error.message ||
        (isEditMode ? "ویرایش ناموفق بود" : "آپلود ناموفق بود");

      // نمایش snackbar خطا
      enqueueSnackbar(errorMsg, { variant: "error" });

      if (onUploadError) onUploadError(errorMsg);
    }
  });

  const handleAllowedTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as "packaging" | "product" | "none";
    setValue("type", newType);
  };

  // Check if type field should be disabled (when defaultType is provided)
  const isTypeFieldDisabled =
    !!defaultType ||
    addImageMutation.isPending ||
    editImageMutation.isPending ||
    isLoadingEditData;

  // Check if form is valid - in edit mode, file is optional
  const isFormValidForSubmit = isEditMode
    ? title && title.trim().length >= 3 // In edit mode, only title is required
    : isMultipleUpload
      ? !!selectedFile // In multiple mode, only files are required
      : isValid; // In single mode, all fields including title and file are required

  const isSubmitDisabled =
    !isFormValidForSubmit ||
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
    <Paper
      elevation={isDragOver ? 4 : 1}
      sx={{
        p: 3,
        mb: 3,
        border: isDragOver ? "2px solid" : "1px solid transparent",
        borderColor: isDragOver ? "primary.main" : "transparent",
        bgcolor: isDragOver ? "primary.50" : "background.paper",
        transition: "all 0.2s ease-in-out",
        position: "relative",
      }}
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "primary.main",
            opacity: 0.1,
            borderRadius: 1,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

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
        {/* Multi-upload toggle switch */}
        {!isEditMode && (
          <FormControlLabel
            control={
              <Switch
                checked={isMultipleUpload}
                onChange={(e) => {
                  const isMultiple = e.target.checked;
                  setValue("multipleUpload", isMultiple, {
                    shouldValidate: true,
                  });

                  // Clear form when switching modes
                  if (isMultiple) {
                    // Switching to multiple mode
                    setValue("title", "");
                    setValue("file", null);
                    setPreviewUrl("");
                    setPreviewUrls([]);
                  } else {
                    // Switching to single mode
                    setValue("file", null);
                    setPreviewUrl("");
                    setPreviewUrls([]);
                  }
                }}
                disabled={
                  addImageMutation.isPending || editImageMutation.isPending
                }
              />
            }
            label="آپلود چندتایی"
            sx={{ mb: 1 }}
          />
        )}

        {/* ردیف بالا: مربع آپلود + نوع تصویر + عنوان تصویر */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "auto auto",
              md: "auto 1fr 1fr",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* مربع انتخاب فایل */}
          <Box
            sx={{
              position: "relative",
              gridRow: { xs: "1", sm: "1 / 3", md: "1" },
            }}
          >
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={
                addImageMutation.isPending ||
                editImageMutation.isPending ||
                isLoadingEditData
              }
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
              multiple={isMultipleUpload}
            />
            <label htmlFor="file-upload">
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  border: "2px dashed",
                  borderColor: isDragOver
                    ? "primary.main"
                    : selectedFile
                      ? errors.file
                        ? "error.main"
                        : "primary.main"
                      : errors.file
                        ? "error.main"
                        : "grey.400",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    addImageMutation.isPending ||
                    editImageMutation.isPending ||
                    isLoadingEditData
                      ? "not-allowed"
                      : "pointer",
                  bgcolor: isDragOver
                    ? "primary.100"
                    : selectedFile
                      ? errors.file
                        ? "error.50"
                        : "primary.50"
                      : errors.file
                        ? "error.50"
                        : "grey.50",
                  transition: "all 0.2s ease-in-out",
                  position: "relative",
                  overflow: "hidden",
                  transform: isDragOver ? "scale(1.02)" : "scale(1)",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.50",
                  },
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewUrl || previewUrls.length > 0 ? (
                  <Box
                    sx={{ width: "100%", height: "100%", position: "relative" }}
                  >
                    {previewUrls.length > 0 ? (
                      // Multiple files preview
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            previewUrls.length === 1 ? "1fr" : "1fr 1fr",
                          gap: 0.5,
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {previewUrls.slice(0, 4).map((url, index) => (
                          <Box
                            key={index}
                            component="img"
                            src={url}
                            alt={`Preview ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                        ))}
                        {previewUrls.length > 4 && (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              backgroundColor: "rgba(0,0,0,0.7)",
                              color: "white",
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              fontSize: "0.75rem",
                            }}
                          >
                            +{previewUrls.length - 4}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      // Single file preview
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
                    )}
                  </Box>
                ) : (
                  <>
                    <CloudUploadIcon
                      style={{
                        fontSize: isDragOver ? 48 : 40,
                        color: isDragOver
                          ? "primary.main"
                          : selectedFile
                            ? "primary.main"
                            : "grey.500",
                        transition: "all 0.2s ease-in-out",
                      }}
                    />
                    <Typography
                      variant="body2"
                      color={
                        isDragOver
                          ? "primary.main"
                          : selectedFile
                            ? "primary.main"
                            : "text.secondary"
                      }
                      textAlign="center"
                      sx={{ px: 1 }}
                    >
                      {isDragOver
                        ? isMultipleUpload
                          ? "فایل‌ها را اینجا رها کنید"
                          : "فایل را اینجا رها کنید"
                        : selectedFile
                          ? Array.isArray(selectedFile)
                            ? `${selectedFile.length} فایل انتخاب شده`
                            : "فایل انتخاب شده"
                          : isEditMode
                            ? "انتخاب فایل جدید (اختیاری)"
                            : isMultipleUpload
                              ? "کلیک کنید یا فایل‌ها را بکشید"
                              : "کلیک کنید یا فایل را بکشید"}
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
              {defaultType && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1, fontStyle: "italic" }}
                >
                  (ثابت)
                </Typography>
              )}
            </Typography>
            <FormControl
              variant="outlined"
              size="small"
              fullWidth
              error={!!errors.type}
            >
              <InputLabel>نوع تصویر</InputLabel>
              <Select
                value={currentAllowedType}
                onChange={handleAllowedTypeChange}
                label="نوع تصویر"
                disabled={isTypeFieldDisabled}
                MenuProps={{
                  disablePortal: true,
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      maxHeight: 240,
                      overflow: "auto",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  slotProps: {
                    backdrop: {
                      sx: {
                        backgroundColor: "transparent",
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
              {defaultType && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  نوع تصویر به صورت پیش‌فرض تنظیم شده است
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
              onChange={(e) =>
                setValue("title", e.target.value, { shouldValidate: true })
              }
              variant="outlined"
              size="small"
              disabled={addImageMutation.isPending || isMultipleUpload}
              required={!isMultipleUpload}
              placeholder={
                isMultipleUpload
                  ? "عنوان در حالت چندتایی غیرفعال است"
                  : "عنوان تصویر را وارد کنید"
              }
              fullWidth
              error={!!errors.title}
              helperText={
                isMultipleUpload
                  ? "در حالت آپلود چندتایی، عنوان خودکار تنظیم می‌شود"
                  : errors.title?.message
              }
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
              Array.isArray(selectedFile) ? (
                // Multiple files info
                <>
                  <Typography variant="caption" display="block">
                    تعداد فایل‌ها: {selectedFile.length}
                  </Typography>
                  <Typography variant="caption" display="block">
                    مجموع حجم:{" "}
                    {formatFileSize(
                      selectedFile.reduce((total, file) => total + file.size, 0)
                    )}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    فایل‌های انتخاب شده:
                  </Typography>
                  {selectedFile.slice(0, 3).map((file, index) => (
                    <Typography
                      key={index}
                      variant="caption"
                      display="block"
                      sx={{ ml: 1 }}
                    >
                      • {file.name} ({formatFileSize(file.size)})
                    </Typography>
                  ))}
                  {selectedFile.length > 3 && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ ml: 1 }}
                    >
                      • و {selectedFile.length - 3} فایل دیگر...
                    </Typography>
                  )}
                </>
              ) : (
                // Single file info
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
              )
            ) : (
              <Typography variant="caption" color="text.secondary">
                هیچ فایلی انتخاب نشده است.
                <br />
                برای انتخاب فایل، روی مربع بالا کلیک کنید یا فایل را بکشید و رها
                کنید.
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
          {addImageMutation.isPending || editImageMutation.isPending ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={24} color="inherit" />
              {isEditMode
                ? "در حال ویرایش..."
                : isMultipleUpload
                  ? "در حال آپلود فایل‌ها..."
                  : "در حال آپلود..."}
            </Box>
          ) : isEditMode ? (
            "ویرایش تصویر"
          ) : isMultipleUpload ? (
            "آپلود فایل‌ها"
          ) : (
            "آپلود تصویر"
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
