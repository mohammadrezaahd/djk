import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardActions,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PageSizeSelector, PaginationControls } from "../../components/common";
import type { IGallery } from "../../types/interfaces/gallery.interface";

interface MediaGridProps {
  images: IGallery[];
  selectedImages: number[];
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isSelectorMode?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  images,
  selectedImages,
  onSelect,
  onEdit,
  onDelete,
  isSelectorMode = false,
}) => {
  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((image) => (
          <Grid item key={image.id} xs={6} sm={4} md={3}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image.url}
                alt={image.alt}
              />
              <CardActions>
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onChange={() => onSelect(image.id)}
                />
                {!isSelectorMode && (
                  <>
                    <Tooltip title="ویرایش">
                      <IconButton onClick={() => onEdit(image.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <IconButton onClick={() => onDelete(image.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Typography variant="body2" noWrap>
                  {image.name}
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <PaginationControls
        count={10} // Dummy data
        page={1}
        onPageChange={() => {}}
      />
      <PageSizeSelector
        pageSize={10}
        onPageSizeChange={() => {}}
        totalItems={100}
      />
    </>
  );
};

export default MediaGrid;