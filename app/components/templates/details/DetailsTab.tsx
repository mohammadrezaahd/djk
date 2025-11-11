import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { updateFormField, setImages } from "~/store/slices/detailsSlice";
import type { RootState } from "~/store";
import { useDetailsValidation } from "~/validation";
import DetailsField from "./DetailsField";
import DetailsFormFields from "./DetailsFormFields";
import ImageSelector from "../ImageSelector";
import { MediaType } from "~/components/MediaManager/FileUpload";

const SectionCard = ({ title, children, ...props }: any) => (
  <Card sx={{ p: 2, ...props.sx }} {...props}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

interface DetailsTabProps {
  onValidationChange?: (isValid: boolean) => void;
  isLoading: boolean;
}

const DetailsTab = ({ onValidationChange, isLoading }: DetailsTabProps) => {
  const dispatch = useAppDispatch();
  const detailsData = useAppSelector(
    (state: RootState) => (state.details as any)?.detailsData
  );
  const detailsFormData = useAppSelector(
    (state: RootState) => (state.details as any)?.formData || {}
  );
  const images = useAppSelector(
    (state: RootState) => (state.details as any)?.images || []
  );

  // Use validation hook only when form data is ready
  const form = useDetailsValidation(detailsData, detailsFormData);

  // Notify parent component about validation state changes
  useEffect(() => {
    onValidationChange?.(form.isFormValid);
  }, [form.isFormValid, onValidationChange]);

  // Update store when form values change
  useEffect(() => {
    const subscription = form.watch((value: any, { name }: any) => {
      if (name) {
        dispatch(updateFormField({ fieldName: name, value: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, dispatch]);

  const handleDetailsChange = (fieldName: string, value: any) => {
    form.setValue(fieldName as any, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    dispatch(updateFormField({ fieldName, value }));
  };

  const handleImagesChange = (selectedImages: number[]) => {
    dispatch(setImages(selectedImages));
  };

  const isFakeProduct = form.watch("is_fake_product") === true;
  const bind = detailsData?.bind;

  useEffect(() => {
    if (isFakeProduct && bind?.brands) {
      const miscBrand = bind.brands.find((brand: any) => brand.id === "719");
      if (miscBrand) {
        handleDetailsChange("brand", "719");
      }
    }
  }, [isFakeProduct, bind?.brands]);

  useEffect(() => {
    const currentIdType = form.watch("id_type");

    if (!currentIdType) {
      handleDetailsChange("id_type", "general");
      // Clear both fields when setting default
      handleDetailsChange("general_mefa_id", "");
      handleDetailsChange("custom_id", "");
    }
  }, [form.watch("id_type")]);

  const isGeneralId = form.watch("id_type") === "general";

  // Convert form errors to validation errors object
  const validationErrors = useMemo(() => {
    const errors: { [key: string]: string } = {};
    Object.keys(form.formState.errors).forEach((key) => {
      const error =
        form.formState.errors[key as keyof typeof form.formState.errors];
      if (error && "message" in error) {
        errors[key] = error.message as string;
      }
    });
    return errors;
  }, [form.formState.errors]);

  // Convert form.watch values to formData object
  const currentFormData = useMemo(() => {
    const watchedValues = form.watch();
    return watchedValues as { [key: string]: any };
  }, [form.watch()]);

  if (!detailsData || !detailsData.bind) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            {isLoading
              ? "در حال بارگیری اطلاعات..."
              : "اطلاعات محصول در دسترس نیست"}
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Title & Description Section */}
      <Grid size={{ xs: 12 }}>
        <SectionCard title="عنوان قالب اطلاعات">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <DetailsField
              fieldName="title"
              label="عنوان قالب اطلاعات"
              value={form.watch("title")}
              onChange={handleDetailsChange}
              isTextField
              required
              placeholder="عنوان قالب را وارد کنید..."
              helperText="این عنوان برای شناسایی قالب اطلاعات استفاده خواهد شد"
              error={form.formState.errors.title?.message as string}
            />
            <DetailsField
              fieldName="description"
              label="سایر توضیحات"
              value={form.watch("description")}
              onChange={handleDetailsChange}
              isTextField
              multiline
              rows={3}
              placeholder="توضیحات اضافی درباره قالب..."
              helperText="توضیحات اختیاری درباره قالب و نحوه استفاده از آن"
              error={form.formState.errors.description?.message as string}
            />
          </Box>
        </SectionCard>
      </Grid>

      {/* Details Form Fields - Reusable Component */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={2}>
          <DetailsFormFields
            detailsData={detailsData}
            formData={currentFormData}
            onFormDataChange={handleDetailsChange}
            validationErrors={validationErrors}
          />
        </Grid>
      </Grid>

      {/* Images Section */}
      <Grid size={{ xs: 12 }}>
        <SectionCard title="تصاویر محصول">
          <ImageSelector
            selectedImages={images}
            onImagesChange={handleImagesChange}
            label="انتخاب تصاویر"
            helperText="تصاویر مرتبط با این جزئیات محصول را انتخاب کنید"
            packaging
            defaultType={MediaType.PACKAGING}
          />
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default DetailsTab;
