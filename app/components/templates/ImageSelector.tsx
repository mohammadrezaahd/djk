import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardActions,
  Checkbox,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { useImages } from "../../api/gallery.api";
import { MediaManager, MediaGrid } from "../../components/MediaManager";
import { SearchInput } from "../../components/common";
import type { IGallery } from "../../types/interfaces/gallery.interface";
import { fixImageUrl } from "../../utils/imageUtils";

interface ImageSelectorProps {
  selectedImages: number[];
  onImagesChange: (selectedIds: number[]) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImages,
  onImagesChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelect = (id: number) => {
    const newSelection = selectedImages.includes(id)
      ? selectedImages.filter((imgId) => imgId !== id)
      : [...selectedImages, id];
    onImagesChange(newSelection);
  };

  const { data: imagesData } = useImages({
    skip: 0,
    limit: 1000, // Fetch all selected images
    ids: selectedImages,
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        تصاویر انتخاب شده
      </Typography>
      <Grid container spacing={2}>
        {imagesData?.data?.list?.map((image) => (
          <Grid item key={image.id} xs={6} sm={4} md={3}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={fixImageUrl(image.url)}
                alt={image.alt}
              />
              <CardActions>
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onChange={() => handleSelect(image.id)}
                />
                <Typography variant="body2" noWrap>
                  {image.name}
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="outlined" onClick={handleOpen} sx={{ mt: 2 }}>
        انتخاب / مدیریت تصاویر
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>مدیریت رسانه</DialogTitle>
        <DialogContent>
          <MediaManager
            selectedImages={selectedImages}
            onSelectionChange={onImagesChange}
            isSelectorMode={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>بستن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageSelector;