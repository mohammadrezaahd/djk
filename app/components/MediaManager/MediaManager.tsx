import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import FileUpload from "./FileUpload";
import MediaGrid from "./MediaGrid";
import { SearchInput } from "../../components/common";
import { useGallery, useDeleteFile, useUpdateFile } from "../../api/gallery.api";

interface MediaManagerProps {
  selectedImages?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
  isSelectorMode?: boolean;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  selectedImages = [],
  onSelectionChange = () => {},
  isSelectorMode = false,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [editImageId, setEditImageId] = useState<number | null>(null);

  const {
    data: galleryData,
    isLoading,
    error,
  } = useGallery({
    skip: (page - 1) * limit,
    limit,
    search,
  });

  const deleteFileMutation = useDeleteFile();
  const updateFileMutation = useUpdateFile();

  const handleUploadSuccess = () => {
    //
  };

  const handleEdit = (id: number) => {
    setEditImageId(id);
  };

  const handleDelete = (id: number) => {
    deleteFileMutation.mutate(id);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box>
      {!isSelectorMode && (
        <>
          <Typography variant="h5" gutterBottom>
            آپلود رسانه جدید
          </Typography>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            editImageId={editImageId}
            onCancelEdit={() => setEditImageId(null)}
          />
        </>
      )}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        کتابخانه رسانه
      </Typography>
      <SearchInput onSearch={setSearch} />
      <MediaGrid
        images={galleryData?.data.list ?? []}
        selectedImages={selectedImages}
        onSelect={onSelectionChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSelectorMode={isSelectorMode}
      />
    </Box>
  );
};

export default MediaManager;