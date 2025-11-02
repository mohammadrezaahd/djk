import React from "react";
import { Box } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import MediaGrid from "./MediaGrid";

// Media file interface
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

interface MediaManagerProps {
  media: IMediaFile[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  loading?: boolean;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onPageSizeChange: (event: SelectChangeEvent<number>) => void;
  pageSizeOptions?: number[];
  showUpload?: boolean;
  title?: string;
  // Selection props
  selectionMode?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const MediaManager: React.FC<MediaManagerProps> = ({
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
  showUpload = true,
  title = "مدیریت رسانه",
  selectionMode = false,
  selectedItems = [],
  onSelectionChange,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MediaGrid
        media={media}
        onDelete={onDelete}
        onEdit={onEdit}
        loading={loading}
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={pageSizeOptions}
        selectionMode={selectionMode}
        selectedItems={selectedItems}
        onSelectionChange={onSelectionChange}
      />
    </Box>
  );
};

export default MediaManager;
