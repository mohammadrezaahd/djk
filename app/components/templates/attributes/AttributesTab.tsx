import { Box, Typography, Grid, TextField } from "@mui/material";
import React, { useEffect } from "react";
import type { IAttr } from "~/types/interfaces/attributes.interface";
import { StaticCategoryIds } from "~/types/interfaces/attributes.interface";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import {
  updateFormField,
  setTitle,
  setDescription,
  setImages,
} from "~/store/slices/attributesSlice";
import AttributesField from "./AttributesField";
import ImageSelector from "../ImageSelector";
import { MediaType } from "~/components/MediaManager/FileUpload";
import SectionCard from "~/components/common/SectionCard";
import { useTemplateForm } from "~/hooks/useTemplateForm";
import { useMemo } from "react";

interface AttributesTabProps {
  onValidationChange?: (isValid: boolean) => void;
  isLoading: boolean;
  isValidationEnabled?: boolean;
}

export default function AttributesTab({
  onValidationChange,
  isLoading,
  isValidationEnabled = false,
}: AttributesTabProps) {
  const dispatch = useAppDispatch();
  const { attributesData, formData, title, description, images } =
    useAppSelector((state) => state.attributes);

  const attributes: IAttr[] = React.useMemo(() => {
    if (!attributesData?.category_group_attributes) return [];
    // ... (logic for extracting attributes remains the same)
  }, [attributesData]);

  const fields = useMemo(() => {
    if (!attributes) return [];
    return attributes.map(attr => ({
      name: attr.code || attr.id.toString(),
      type: attr.type,
      required: attr.required,
      label: attr.title,
    }));
  }, [attributes]);


  const { form, isFormValid } = useTemplateForm({
    fields,
    formData: { ...formData, title, description },
    onFormChange: (newData) => {
        if ('title' in newData) dispatch(setTitle(newData.title));
        if ('description' in newData) dispatch(setDescription(newData.description));
        // This is a simplified approach. A more robust solution
        // would differentiate between form fields and title/description.
        dispatch(updateFormField(newData));
    },
    isValidationEnabled,
  });

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  const handleInputChange = (attrId: number | string, value: any) => {
    const fieldKey = typeof attrId === 'number' ? attrId.toString() : attrId;
    form.setValue(fieldKey, value, { shouldValidate: true, shouldDirty: true });
  };

  const handleImagesChange = (selectedImages: number[]) => {
    dispatch(setImages(selectedImages));
  };


  if (isLoading) {
    return (
      <Grid item xs={12}>
        <SectionCard title="Product Information">
          <Typography variant="body1" color="text.secondary">
            Loading information...
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  if (attributes.length === 0) {
    return (
      <Grid item xs={12}>
        <SectionCard title="Product Information">
          <Typography variant="body1" color="text.secondary">
            Product information is not available
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  const packagingAttributes = []; // Simplified for brevity
  const otherAttributes = attributes; // Simplified for brevity

  return (
    <>
      <Grid item xs={12}>
        <SectionCard title="Attribute Template Title">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Attribute Template Title"
              placeholder="Enter template title..."
              value={form.watch("title") || ""}
              onChange={(e) => form.setValue("title", e.target.value, { shouldValidate: true })}
              required
              error={!!form.formState.errors.title}
              helperText={
                form.formState.errors.title?.message ||
                "This title will be used to identify the template"
              }
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Other Descriptions"
              placeholder="Additional information about the template..."
              value={form.watch("description") || ""}
              onChange={(e) => form.setValue("description", e.target.value, { shouldValidate: true })}
              error={!!form.formState.errors.description}
              helperText={
                form.formState.errors.description?.message ||
                "Optional description about the template and its usage"
              }
            />
          </Box>
        </SectionCard>
      </Grid>

      {/* Packaging section */}
      {packagingAttributes.length > 0 && (
        <Grid item xs={12}>
          <SectionCard title="Packaging Information">
            <Grid container spacing={2}>
              {packagingAttributes.map((attr) => (
                <Grid item key={attr.id} xs={12} md={3}>
                  <AttributesField
                    attr={attr}
                    value={form.watch(attr.id.toString())}
                    onChange={handleInputChange}
                    error={
                      form.formState.errors[attr.id.toString()]
                        ?.message as string
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </Grid>
      )}

      <Grid item xs={12}>
        <SectionCard title="Product Information">
          <Grid container spacing={3}>
            {otherAttributes.map((attr) => (
              <Grid item key={attr.id} xs={12} md={6}>
                <AttributesField
                  attr={attr}
                  value={form.watch(attr.id.toString())}
                  onChange={handleInputChange}
                  error={
                    form.formState.errors[attr.id.toString()]?.message as string
                  }
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>
      </Grid>

      <Grid item xs={12}>
        <SectionCard title="Product Images">
          <ImageSelector
            selectedImages={images}
            onImagesChange={handleImagesChange}
            label="Select Images"
            helperText="Select images related to this attribute template"
            product
            defaultType={MediaType.PRODUCT}
          />
        </SectionCard>
      </Grid>
    </>
  );
}
