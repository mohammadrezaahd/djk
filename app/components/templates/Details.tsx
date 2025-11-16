import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ImageSelector from "./ImageSelector";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateFormField } from "../../store/slices/detailsSlice";
import type { RootState } from "../../store";

const Details = () => {
  const dispatch = useAppDispatch();
  const details = useAppSelector((state: RootState) => state.details);

  const handleFieldChange = (
    fieldName: keyof typeof details.formData,
    value: any
  ) => {
    dispatch(updateFormField({ fieldName, value }));
  };

  return (
    <Box>
      <Typography variant="h6">اطلاعات</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="عنوان"
            value={details.formData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="توضیحات"
            value={details.formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
          />
        </Grid>
        {details.data?.brand && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>برند</InputLabel>
              <Select
                value={details.formData.brand}
                label="برند"
                onChange={(e) => handleFieldChange("brand", e.target.value)}
              >
                {details.data.brand.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12}>
          <ImageSelector
            selectedImages={details.images}
            onImagesChange={(images) => handleFieldChange("images", images)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained">ذخیره</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Details;