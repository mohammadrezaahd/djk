import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddImage, useEditImage, useImage } from "../../api/gallery.api";
import { ApiStatus } from "../../types";
import { useGalleryValidation, convertGalleryFormToApi } from "../../validation";
import type { IGallery } from "../../types/interfaces/gallery.interface";
import { fixImageUrl } from "../../utils/imageUtils";

export enum MediaType {
  PRODUCT = "product",
  ATTRIBUTE = "attribute",
  DETAIL = "detail",
  CATEGORY = "category",
  UNCATEGORIZED = "uncategorized",
}

interface FileUploadProps {
  onUploadSuccess: () => void;
  editImageId?: number | null;
  onCancelEdit: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  editImageId,
  onCancelEdit,
}) => {
  const { imageSchema } = useGalleryValidation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      name: "",
      alt: "",
      type: MediaType.UNCATEGORIZED,
      product: false,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const addImageMutation = useAddImage();
  const editImageMutation = useEditImage();
  const { data: imageData, isLoading: isImageLoading } = useImage(
    editImageId ?? 0
  );

  useEffect(() => {
    if (editImageId && imageData) {
      setValue("name", imageData.data.name);
      setValue("alt", imageData.data.alt);
      setValue("type", imageData.data.type);
      setValue("product", imageData.data.product);
      setPreview(fixImageUrl(imageData.data.url));
    } else {
      reset();
      setPreview(null);
    }
  }, [editImageId, imageData, setValue, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    const apiData = convertGalleryFormToApi(data);
    if (editImageId) {
      await editImageMutation.mutateAsync({ id: editImageId, data: apiData });
    } else {
      if (file) {
        await addImageMutation.mutateAsync({ data: apiData, file });
      }
    }
    onUploadSuccess();
    reset();
    setPreview(null);
  };

  if (isImageLoading) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: "1px dashed grey",
              borderRadius: 2,
              padding: 2,
              textAlign: "center",
            }}
          >
            <Button variant="contained" component="label">
              انتخاب فایل
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {preview && (
              <Box mt={2}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 200 }}
                />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="نام فایل"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="alt"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="متن جایگزین (Alt)"
                fullWidth
                margin="normal"
                error={!!errors.alt}
                helperText={errors.alt?.message}
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>نوع رسانه</InputLabel>
                <Select {...field} label="نوع رسانه">
                  {Object.values(MediaType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="product"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="تصویر محصول"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            disabled={
              addImageMutation.isPending || editImageMutation.isPending
            }
          >
            {editImageId ? "ویرایش" : "آپلود"}
          </Button>
          {editImageId && (
            <Button
              onClick={onCancelEdit}
              variant="outlined"
              sx={{ ml: 1 }}
            >
              لغو ویرایش
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default FileUpload;