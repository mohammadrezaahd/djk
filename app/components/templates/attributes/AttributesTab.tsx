import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import type { IAttr } from "../../../types/interfaces/attributes.interface";
import { StaticCategoryIds } from "../../../types/interfaces/attributes.interface";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  updateFormField,
  setImages,
} from "../../../store/slices/attributesSlice";
import AttributesFormFields from "./AttributesFormFields";
import TitleField from "../TitleField";
import ImageSelector from "../ImageSelector";
import { useAttributesValidation } from "../../../validation";
import { MediaType } from "../../../components/MediaManager/FileUpload";

interface AttributesTabProps {
  onValidationChange: (isValid: boolean) => void;
  isLoading: boolean;
}

const AttributesTab: React.FC<AttributesTabProps> = ({
  onValidationChange,
  isLoading,
}) => {
  const dispatch = useAppDispatch();
  const attributesData = useAppSelector(
    (state) => state.attributes.data?.category_group_attributes
  );
  const formData = useAppSelector((state) => state.attributes.formData);
  const images = useAppSelector((state) => state.attributes.images);

  const { isValid, errors } = useAttributesValidation(
    attributesData,
    formData
  );

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  const handleFieldChange = (fieldId: number | string, value: any) => {
    dispatch(updateFormField({ fieldId: fieldId.toString(), value }));
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
        <TitleField
          onChange={(value) => handleFieldChange("title", value)}
          error={!!errors.title}
          helperText={errors.title}
        />
      </Grid>
      <AttributesFormFields
        attributesData={attributesData}
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

export default AttributesTab;