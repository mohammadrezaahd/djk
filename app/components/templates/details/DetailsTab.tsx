import React, { useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { updateFormField, setImages } from "../../../store/slices/detailsSlice";
import type { RootState } from "../../../store";
import DetailsFormFields from "./DetailsFormFields";
import ImageSelector from "../ImageSelector";
import { useDetailsValidation } from "../../../validation";
import { MediaType } from "../../../components/MediaManager/FileUpload";

interface DetailsTabProps {
  onValidationChange: (isValid: boolean) => void;
  isLoading: boolean;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  onValidationChange,
  isLoading,
}) => {
  const dispatch = useAppDispatch();
  const detailsData = useAppSelector((state: RootState) => state.details.data);
  const formData = useAppSelector((state: RootState) => state.details.formData);
  const images = useAppSelector((state: RootState) => state.details.images);

  const { isValid, errors } = useDetailsValidation(detailsData, formData);

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  const handleFieldChange = (fieldName: string, value: any) => {
    dispatch(updateFormField({ fieldName, value }));
  };

  const handleImagesChange = (selectedImages: number[]) => {
    dispatch(setImages(selectedImages));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="عنوان قالب اطلاعات"
          value={formData.title || ""}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          required
        />
      </Grid>
      <DetailsFormFields
        detailsData={detailsData}
        formData={formData}
        onFieldChange={handleFieldChange}
        errors={errors}
      />
      <Grid item xs={12}>
        <ImageSelector
          selectedImages={images}
          onImagesChange={handleImagesChange}
        />
      </Grid>
    </Grid>
  );
};

export default DetailsTab;