import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  TextField,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardMedia,
  Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useSnackbar } from "notistack";
import type { IGallery } from "~/types/interfaces/gallery.interface";
import { useImages, useAddImage } from "~/api/gallery.api";
import MediaGrid from "./MediaGrid";
import { SearchInput } from "~/components/common";
import { ApiStatus } from "~/types";

interface IMediaFile {
  _id: string;
  filename: string;
  filepath: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

interface MediaManagerProps {
  allowedType?: "packaging" | "product" | "none";
  showUpload?: boolean;
  title?: string;
}

// File Upload Component
const FileUpload: React.FC<{
  allowedType?: "packaging" | "product" | "none";
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
}> = ({ allowedType = "none", onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [currentAllowedType, setCurrentAllowedType] = useState<
    "packaging" | "product" | "none"
  >(allowedType);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const addImageMutation = useAddImage();
  const { enqueueSnackbar } = useSnackbar();

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

  const isFileTypeAllowed = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.includes(fileExtension);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setPreviewUrl("");

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!isFileTypeAllowed(file)) {
        const errorMsg =
          "نوع فایل نامعتبر است. فقط فرمت‌های تصویری مجاز هستند: jpg, jpeg, png, gif, webp, svg";
        setError(errorMsg);
        if (onUploadError) onUploadError(errorMsg);
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      const errorMsg = "لطفاً فایل و عنوان را وارد کنید";
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: "error" });
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    try {
      const packaging = currentAllowedType === "packaging";
      const product = currentAllowedType === "product";

      if (packaging && product) {
        throw new Error("نمی‌توان هم‌زمان عکس بسته‌بندی و محصول باشد");
      }

      const uploadData = {
        title: title.trim(),
        packaging,
        product,
        source: "app" as any,
        tag: "test",
        file: selectedFile,
      };

      const result = await addImageMutation.mutateAsync(uploadData);

      // بررسی موفقیت با ApiStatus
      if (result.status === ApiStatus.SUCCEEDED) {
        // Reset form after successful upload
        setSelectedFile(null);
        setTitle("");
        setError("");
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
    } catch (error: any) {
      const errorMsg = error.message || "آپلود ناموفق بود";
      setError(errorMsg);

      // نمایش snackbar خطا
      enqueueSnackbar(errorMsg, { variant: "error" });

      if (onUploadError) onUploadError(errorMsg);
    }
  };

  const handleAllowedTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as "packaging" | "product" | "none";
    setCurrentAllowedType(newType);
    // فقط خطا رو پاک می‌کنیم، بقیه input ها رو دست نمی‌زنیم
    setError("");
  };

  const getSelectedFilterType = () => {
    return MEDIA_FILTER_TYPES.find((ft) => ft.value === currentAllowedType);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        آپلود تصویر
      </Typography>

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
              disabled={addImageMutation.isPending}
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            />
            <label htmlFor="file-upload">
              <Card
                sx={{
                  width: 140,
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: addImageMutation.isPending
                    ? "not-allowed"
                    : "pointer",
                  border: "2px dashed",
                  borderColor: selectedFile ? "primary.main" : "grey.400",
                  backgroundColor: selectedFile ? "action.hover" : "grey.50",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                    transform: "scale(1.02)",
                  },
                }}
              >
                {previewUrl ? (
                  <CardMedia
                    component="img"
                    image={previewUrl}
                    alt="پیش‌نمایش"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      color: "text.secondary",
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      انتخاب فایل
                    </Typography>
                    <Typography variant="caption">کلیک کنید</Typography>
                  </Box>
                )}
              </Card>
            </label>
          </Box>

          {/* نوع تصویر */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
              نوع تصویر
            </Typography>
            <FormControl variant="outlined" size="small" fullWidth>
              <Select
                value={currentAllowedType}
                onChange={handleAllowedTypeChange}
              >
                {MEDIA_FILTER_TYPES.map((filterType) => (
                  <MenuItem key={filterType.value} value={filterType.value}>
                    {filterType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* عنوان تصویر */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
              عنوان تصویر
            </Typography>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              size="small"
              disabled={addImageMutation.isPending}
              required
              placeholder="عنوان تصویر را وارد کنید"
              fullWidth
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
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", display: "block", mb: 1 }}
              >
                فرمت‌های پشتیبانی شده:
              </Typography>
              <Typography variant="body2">
                {getSelectedFilterType()?.extensions.join(" • ")}
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
              {selectedFile ? "فایل انتخاب شده:" : "هیچ فایلی انتخاب نشده"}
            </Typography>
            {selectedFile ? (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    wordBreak: "break-word",
                    mb: 0.5,
                  }}
                >
                  {selectedFile.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  حجم: {(selectedFile.size / 1024 / 1024).toFixed(2)} مگابایت
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                لطفاً فایل را انتخاب کنید
              </Typography>
            )}
          </Box>
        </Box>

        {/* دکمه آپلود در پایین به صورت full width */}
        <Button
          variant="contained"
          size="large"
          onClick={handleUpload}
          disabled={
            !selectedFile || !title.trim() || addImageMutation.isPending
          }
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
          {addImageMutation.isPending ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={24} color="inherit" />
              در حال آپلود...
            </Box>
          ) : (
            "آپلود تصویر"
          )}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

const MediaManager: React.FC<MediaManagerProps> = ({
  allowedType = "none",
  showUpload = true,
  title = "مدیریت رسانه",
}) => {
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [apiSearchValue, setApiSearchValue] = useState<string>(""); // فقط مقدار برای API

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

  useEffect(() => {
    setPage(1);
  }, [allowedType]);

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

  const handleDelete = async (id: string) => {
    console.log("Delete image with id:", id);
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
  }));

  const totalItems = mediaFiles.length;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {(error || hasImagesFetchError) && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error || (hasImagesFetchError && imagesData?.message) || "خطا در بارگیری داده‌ها"}
        </Alert>
      )}

      {/* File Upload */}
      {showUpload && (
        <FileUpload
          allowedType={allowedType === "none" ? undefined : allowedType}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      )}

      {/* Search Filter */}
      <SearchInput
        onSearchChange={handleSearchChange}
        label="جستجو در عناوین"
        placeholder="عنوان تصویر را جستجو کنید..."
        sx={{ mb: 2, maxWidth: 300 }}
      />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && (
        <MediaGrid
          media={mediaFiles}
          onDelete={handleDelete}
          onEdit={handleEdit}
          loading={false}
          currentPage={page}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Container>
  );
};

export default MediaManager;