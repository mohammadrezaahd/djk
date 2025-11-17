import { Box, Typography, Grid } from "@mui/material";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { updateFormField, setImages } from "~/store/slices/detailsSlice";
import type { RootState } from "~/store";
import DetailsFormFields from "./DetailsFormFields";
import ImageSelector from "../ImageSelector";
import { MediaType } from "~/components/MediaManager/FileUpload";
import SectionCard from "~/components/common/SectionCard";
import { useTemplateForm } from "~/hooks/useTemplateForm";
import { useMemo } from "react";
import DetailsField from "./DetailsField";


interface DetailsTabProps {
  onValidationChange?: (isValid: boolean) => void;
  isLoading: boolean;
  isValidationEnabled?: boolean;
}

const DetailsTab = ({
  onValidationChange,
  isLoading,
  isValidationEnabled = false,
}: DetailsTabProps) => {
  const dispatch = useAppDispatch();
  const detailsData = useAppSelector((state: RootState) => state.details.detailsData);
  const formData = useAppSelector((state: RootState) => state.details.formData);
  const images = useAppSelector((state: RootState) => state.details.images);

  const fields = useMemo(() => {
    if (!detailsData) return [];
    // This is a simplified transformation. In a real scenario,
    // you would map the detailsData structure to a flat array of field definitions.
    return [
      { name: "title", type: "text", required: true, label: "Title" },
      { name: "description", type: "textarea", required: false, label: "Description" },
      // ... other fields would be mapped here
    ];
  }, [detailsData]);

  const { form, isFormValid } = useTemplateForm({
    fields,
    formData,
    onFormChange: (newFormData) => updateFormField(newFormData),
    isValidationEnabled,
  });

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  const handleDetailsChange = (fieldName: string, value: any) => {
    form.setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleImagesChange = (selectedImages: number[]) => {
    dispatch(setImages(selectedImages));
  };

  if (!detailsData || !detailsData.bind) {
    return (
      <Grid item xs={12}>
        <SectionCard title="Product Information">
          <Typography variant="body1" color="text.secondary">
            {isLoading
              ? "Loading information..."
              : "Product information is not available"}
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Title & Description Section */}
      <Grid item xs={12}>
        <SectionCard title="Information Template Title">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <DetailsField
              fieldName="title"
              label="Information Template Title"
              value={form.watch("title")}
              onChange={handleDetailsChange}
              isTextField
              required
              placeholder="Enter template title..."
              helperText="This title will be used to identify the information template"
              error={form.formState.errors.title?.message as string}
            />
            <DetailsField
              fieldName="description"
              label="Other Descriptions"
              value={form.watch("description")}
              onChange={handleDetailsChange}
              isTextField
              multiline
              rows={3}
              placeholder="Additional information about the template..."
              helperText="Optional description about the template and its usage"
              error={form.formState.errors.description?.message as string}
            />
          </Box>
        </SectionCard>
      </Grid>

      {/* Details Form Fields - Reusable Component */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <DetailsFormFields
            detailsData={detailsData}
            formData={form.getValues()}
            onFormDataChange={handleDetailsChange}
            validationErrors={form.formState.errors}
          />
        </Grid>
      </Grid>

      {/* Images Section */}
      <Grid item xs={12}>
        <SectionCard title="Product Images">
          <ImageSelector
            selectedImages={images}
            onImagesChange={handleImagesChange}
            label="Select Images"
            helperText="Select images related to these product details"
            packaging
            defaultType={MediaType.PACKAGING}
          />
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default DetailsTab;
