import { Box, Typography, Card, CardContent, Grid, TextField } from "@mui/material";
import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { setImages, updateFormField } from "~/store/slices/detailsSlice";
import type { RootState } from "~/store";
import { DetailsForm } from "~/components/forms";
import ImageSelector from "../ImageSelector";
import { MediaType } from "~/components/MediaManager/FileUpload";
import type { z } from "zod";

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
  onSubmit: (data: any) => void;
  validationSchema: z.ZodObject<any, any>;
  isLoading: boolean;
  formRef: React.Ref<any>;
}

const DetailsTab = ({ onSubmit, validationSchema, isLoading, formRef }: DetailsTabProps) => {
  const dispatch = useAppDispatch();
  const { detailsData, formData, images } = useAppSelector(state => state.details);

  const handleImagesChange = (selectedImages: number[]) => {
    dispatch(setImages(selectedImages));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateFormField({ fieldName: 'title', value: event.target.value }));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateFormField({ fieldName: 'description', value: event.target.value }));
  };

  if (!detailsData || !detailsData.bind) {
    return (
      <Grid item xs={12}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            {isLoading ? "در حال بارگیری اطلاعات..." : "اطلاعات محصول در دسترس نیست"}
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <SectionCard title="عنوان قالب اطلاعات">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField fullWidth label="عنوان قالب اطلاعات" placeholder="عنوان قالب را وارد کنید..." value={formData.title || ""} onChange={handleTitleChange} required helperText="این عنوان برای شناسایی قالب اطلاعات استفاده خواهد شد" />
                    <TextField fullWidth multiline rows={3} label="سایر توضیحات" placeholder="توضیحات اضافی درباره قالب..." value={formData.description || ""} onChange={handleDescriptionChange} helperText="توضیحات اختیاری درباره قالب و نحوه استفاده از آن" />
                </Box>
            </SectionCard>
        </Grid>
      <Grid item xs={12}>
        <DetailsForm
          ref={formRef}
          detailsData={detailsData}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          defaultValues={formData}
        />
      </Grid>

      <Grid item xs={12}>
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
