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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleEdit = (media: IMediaFile) => {
    if (onEdit) {
      onEdit(media._id);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography>در حال بارگیری...</Typography>
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
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
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
                          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5;">
                            <svg style="width: 48px; height: 48px; color: #999;" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M19,19H5V5H19V19Z"/>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />

                  {/* File Type Badge */}
                  <Chip
                    label="تصویر"
                    size="small"
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontWeight: "bold",
                    }}
                  />
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
                <CardActions sx={{ pt: 0, justifyContent: "space-between" }}>
                  <Box>
                    <Tooltip title="ویرایش">
                      <IconButton
                        size="small"
                        disabled={true} // Disabled as requested
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {onDelete && (
                    <Tooltip title="حذف">
                      <IconButton
                        size="small"
                        color="error"
                        disabled={true} // Disabled as requested
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item._id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
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
