import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Skeleton,
  Checkbox,
} from "@mui/material";

import { DeleteIcon, EditIcon } from "../icons/IconComponents";

import { useTheme, alpha } from "@mui/material/styles";
import { PageSizeSelector, PaginationControls } from "~/components/common";
import type { SelectChangeEvent } from "@mui/material";

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

interface MediaGridProps {
  media: IMediaFile[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  loading?: boolean;
  // Pagination props
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onPageSizeChange: (event: SelectChangeEvent<number>) => void;
  pageSizeOptions?: number[];
  // Selection props
  selectionMode?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  onDelete,
  onEdit,
  loading = false,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48],
  selectionMode = false,
  selectedItems = [],
  onSelectionChange,
}) => {
  const theme = useTheme();
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getImageTypeInfo = (media: IMediaFile) => {
    if (media.packaging) {
      return {
        label: "عکس دسته‌بندی",
        color: "secondary" as const,
      };
    } else if (media.product) {
      return {
        label: "عکس محصول",
        color: "secondary" as const,
      };
    } else {
      return {
        label: "عکس عمومی",
        color: "default" as const,
      };
    }
  };

  const handleEdit = (media: IMediaFile) => {
    if (onEdit) {
      onEdit(media._id);
    }
  };

  const handleSelectionToggle = (id: string) => {
    if (!selectionMode || !onSelectionChange) return;

    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];

    onSelectionChange(newSelection);
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(pageSize)].map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Image Skeleton */}
            <Box
              sx={{
                position: "relative",
                paddingTop: "66.67%",
                bgcolor: "grey.100",
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
              {/* Badge Skeleton */}
              <Skeleton
                variant="rectangular"
                width={80}
                height={24}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  borderRadius: "12px",
                }}
              />
            </Box>

            {/* Content Skeleton */}
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                sx={{ mb: 0.5 }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={14}
                sx={{ mb: 0.5 }}
              />
              <Skeleton variant="text" width="60%" height={14} />
            </CardContent>

            {/* Actions Skeleton */}
            <CardActions sx={{ pt: 0, justifyContent: "space-between" }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        {/* Page Size Selector Skeleton */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
          <Skeleton variant="text" width={100} height={20} />
        </Box>

        <LoadingSkeleton />
      </Box>
    );
  }

  if (media.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          هیچ فایلی یافت نشد
        </Typography>
        <Typography variant="body2" color="text.secondary">
          برای شروع چند فایل آپلود کنید
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Page Size Selector and Total Items Display */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            تعداد آیتم در صفحه:
          </Typography>
          <PageSizeSelector
            value={pageSize}
            onChange={onPageSizeChange}
            options={pageSizeOptions}
            disabled={loading}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          مجموع: {totalItems} آیتم
        </Typography>
      </Box>

      {/* Media Grid */}
      <Grid container spacing={3}>
        {media.map((item) => {
          const imageTypeInfo = getImageTypeInfo(item);

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: selectionMode ? "pointer" : "default",
                  border: selectionMode && isSelected(item._id) ? 2 : 1,
                  borderColor:
                    selectionMode && isSelected(item._id)
                      ? "primary.main"
                      : "divider",
                  "&:hover": selectionMode
                    ? {
                        borderColor: "primary.main",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease-in-out",
                      }
                    : {},
                }}
                onClick={
                  selectionMode
                    ? () => handleSelectionToggle(item._id)
                    : undefined
                }
              >
                {/* Media Preview */}
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "66.67%",
                    bgcolor: "grey.100",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.filepath}
                    alt={item.filename}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: ${theme.palette.grey[100]};">
                            <svg style="width: 48px; height: 48px; color: ${theme.palette.grey[500]};" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M19,19H5V5H19V19Z"/>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />

                  {/* Image Type Badge */}
                  <Chip
                    label={imageTypeInfo.label}
                    size="small"
                    color={imageTypeInfo.color}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontWeight: "bold",
                    }}
                  />

                  {/* Selection Checkbox */}
                  {selectionMode && (
                    <Checkbox
                      checked={isSelected(item._id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                        "&:hover": {
                          bgcolor: theme.palette.background.paper,
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectionToggle(item._id);
                      }}
                    />
                  )}
                </Box>

                {/* Content */}
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Tooltip title={item.filename}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "medium",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.filename}
                    </Typography>
                  </Tooltip>
                  {item.size > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {formatFileSize(item.size)}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                  </Typography>
                </CardContent>

                {/* Actions */}
                {!selectionMode && (
                  <CardActions sx={{ pt: 0, justifyContent: "space-between" }}>
                    {onEdit && (
                      <Box>
                        <Tooltip title="ویرایش">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          >
                            <EditIcon size={"small"} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    {onDelete && (
                      <Tooltip title="حذف">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item._id);
                          }}
                        >
                          <DeleteIcon size={"small"} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </CardActions>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
          disabled={loading}
        />
      )}
    </Box>
  );
};

export default MediaGrid;
