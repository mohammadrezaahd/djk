import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import type { IMediaFile, IMediaQueryParams } from "~/types";
import { ApiStatus } from "~/types";
import { useAddImage } from "~/api/gallery.api";
import MediaFilters from "./MediaFilters";
import MediaGrid from "./MediaGrid";

// Inline FileUpload Component
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

  const addImageMutation = useAddImage();

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
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      const errorMsg = "لطفاً فایل و عنوان را وارد کنید";
      setError(errorMsg);
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
        file: selectedFile, // Send File object directly
      };

      await addImageMutation.mutateAsync(uploadData);

      setSelectedFile(null);
      setTitle("");
      setError("");

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      const errorMsg = error.message || "آپلود ناموفق بود";
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
    }
  };

  const handleAllowedTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value as "packaging" | "product" | "none";
    setCurrentAllowedType(newType);
    setSelectedFile(null);
    setTitle("");
    setError("");

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const getAcceptAttribute = (): string => {
    return ".jpg,.jpeg,.png,.gif,.webp,.svg";
  };

  const getSelectedFilterType = () => {
    return MEDIA_FILTER_TYPES.find((ft) => ft.value === currentAllowedType);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        آپلود تصویر
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl variant="outlined" size="small" sx={{ maxWidth: 300 }}>
          <Typography variant="body2" gutterBottom>
            نوع تصویر
          </Typography>
          <Select value={currentAllowedType} onChange={handleAllowedTypeChange}>
            {MEDIA_FILTER_TYPES.map((filterType) => (
              <MenuItem key={filterType.value} value={filterType.value}>
                {filterType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="عنوان تصویر"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ maxWidth: 300 }}
          disabled={addImageMutation.isPending}
          required
          helperText="عنوان تصویر را وارد کنید"
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "start",
            flexWrap: "wrap",
          }}
        >
          <TextField
            type="file"
            onChange={handleFileChange}
            sx={{ minWidth: 250 }}
            size="small"
            disabled={addImageMutation.isPending}
            helperText={
              getSelectedFilterType()
                ? `فرمت‌های پشتیبانی شده: ${getSelectedFilterType()?.extensions.join(", ")}`
                : ""
            }
            inputProps={{
              accept: getAcceptAttribute(),
            }}
          />

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={
              !selectedFile || !title.trim() || addImageMutation.isPending
            }
            startIcon={<CloudUploadIcon />}
          >
            {addImageMutation.isPending ? "در حال آپلود..." : "آپلود تصویر"}
          </Button>
        </Box>

        {selectedFile && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              فایل انتخاب شده: {selectedFile.name}(
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

interface MediaManagerProps {
  // Modal mode props
  open?: boolean;
  onClose?: () => void;
  onSelect?: (selectedMedia: IMediaFile[]) => void;
  multiple?: boolean;
  mediaType?: "packaging" | "product" | "none";
  title?: string;

  // Page mode props
  allowedType?: "packaging" | "product" | "none";
  showUpload?: boolean;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  // Modal mode
  open,
  onClose,
  onSelect,
  multiple = false,
  mediaType = "none",
  title = "مدیریت رسانه",

  // Page mode
  allowedType,
  showUpload = true,
}) => {
  // Determine if we're in modal mode or page mode
  const isModalMode = open !== undefined;
  const finalMediaType = isModalMode ? mediaType : allowedType || "none";

  const [media, setMedia] = useState<IMediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<IMediaFile[]>([]);
  const [filters, setFilters] = useState<IMediaQueryParams>({
    page: 1,
    limit: 12,
    search: "",
    type: finalMediaType,
  });

  // Update filters when mediaType changes
  useEffect(() => {
    setFilters((prev: IMediaQueryParams) => ({
      ...prev,
      type: finalMediaType,
      page: 1, // Reset to first page when type changes
    }));
  }, [finalMediaType]);

  // Clear selected media when modal opens/closes or target changes
  useEffect(() => {
    setSelectedMedia([]);
  }, [open, mediaType]);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 12,
  });

  const fetchMedia = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Mock data for now - این باید به gallery API متصل شود
      setMedia([]);
      setPagination({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 12,
      });
    } catch {
      setError("خطا در بارگیری رسانه‌ها");
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFiltersChange = (newFilters: IMediaQueryParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: IMediaQueryParams) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (event: SelectChangeEvent<string>) => {
    const itemsPerPage = parseInt(event.target.value);
    setFilters((prev: IMediaQueryParams) => ({
      ...prev,
      limit: itemsPerPage,
      page: 1,
    }));
  };

  const handleUploadSuccess = () => {
    fetchMedia();
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این فایل را حذف کنید؟")) return;

    try {
      // Mock delete for now - این باید به gallery API متصل شود
      fetchMedia();
    } catch {
      setError("خطا در حذف فایل");
    }
  };

  const handleMediaClick = (mediaFile: IMediaFile) => {
    if (isModalMode && onSelect) {
      if (multiple) {
        const isSelected = selectedMedia.some(
          (item) => item._id === mediaFile._id
        );
        if (isSelected) {
          setSelectedMedia((prev) =>
            prev.filter((item) => item._id !== mediaFile._id)
          );
        } else {
          setSelectedMedia((prev) => [...prev, mediaFile]);
        }
      } else {
        onSelect([mediaFile]);
        onClose?.();
      }
    }
  };

  const handleSelectButtonClick = () => {
    if (isModalMode && onSelect) {
      onSelect(selectedMedia);
      onClose?.();
    }
  };

  // Inline pagination component
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    return (
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            تعداد آیتم در صفحه:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={filters.limit?.toString() || "12"}
              onChange={handleItemsPerPageChange}
              variant="outlined"
            >
              <MenuItem value="12">12</MenuItem>
              <MenuItem value="24">24</MenuItem>
              <MenuItem value="48">48</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            صفحه {pagination.currentPage} از {pagination.totalPages}(
            {pagination.totalItems} آیتم)
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(_, page) => handlePageChange(page)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    );
  };

  const renderContent = () => (
    <>
      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* File Upload */}
      {showUpload && (
        <FileUpload
          allowedType={finalMediaType === "none" ? undefined : finalMediaType}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      )}

      {/* Filters */}
      <Box sx={{ mb: 2 }}>
        <MediaFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalItems={pagination.totalItems}
        />
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Media Grid */}
      {!loading && (
        <MediaGrid
          media={media}
          onDelete={isModalMode ? undefined : handleDelete}
          onSelect={handleMediaClick}
          loading={loading}
          selectedMedia={isModalMode ? selectedMedia : undefined}
        />
      )}

      {/* Pagination */}
      {!loading && renderPagination()}
    </>
  );

  // Modal Mode
  if (isModalMode) {
    return (
      <Dialog open={open || false} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>{renderContent()}</DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
          <Box>
            {multiple && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedMedia.length === media.length && media.length > 0
                    }
                    indeterminate={
                      selectedMedia.length > 0 &&
                      selectedMedia.length < media.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMedia([...media]);
                      } else {
                        setSelectedMedia([]);
                      }
                    }}
                  />
                }
                label={`انتخاب همه (${selectedMedia.length} انتخاب شده)`}
              />
            )}
          </Box>

          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              لغو
            </Button>
            <Button
              variant="contained"
              onClick={handleSelectButtonClick}
              disabled={selectedMedia.length === 0}
            >
              انتخاب{" "}
              {multiple && selectedMedia.length > 0
                ? `(${selectedMedia.length})`
                : ""}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }

  // Page Mode
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {renderContent()}
    </Container>
  );
};

export default MediaManager;
