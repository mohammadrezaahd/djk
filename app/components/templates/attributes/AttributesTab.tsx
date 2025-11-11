import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import {
  setTitle,
  setDescription,
  setImages,
} from "~/store/slices/attributesSlice";
import { AttributesForm } from "~/components/forms";
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

interface AttributesTabProps {
  onSubmit: (data: any) => void;
  validationSchema: z.ZodObject<any, any>;
  isLoading: boolean;
  formRef: React.Ref<any>;
}

export default function AttributesTab({
  onSubmit,
  validationSchema,
  isLoading,
  formRef,
}: AttributesTabProps) {
  const dispatch = useAppDispatch();
  const { attributesData, formData, title, description, images } =
    useAppSelector((state) => state.attributes);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setDescription(event.target.value));
  };

  const handleImagesChange = (selectedImages: number[]) => {
    dispatch(setImages(selectedImages));
  };

  if (isLoading) {
    return (
      <Grid item xs={12}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            در حال بارگیری اطلاعات...
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  if (!attributesData) {
    return (
      <Grid item xs={12}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            اطلاعات محصول در دسترس نیست
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <>
      <Grid item xs={12}>
        <SectionCard title="عنوان قالب ویژگی‌ها">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="عنوان قالب ویژگی‌ها"
              placeholder="عنوان قالب را وارد کنید..."
              value={title}
              onChange={handleTitleChange}
              required
              helperText="این عنوان برای شناسایی قالب استفاده خواهد شد"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="سایر توضیحات"
              placeholder="توضیحات اضافی درباره قالب..."
              value={description}
              onChange={handleDescriptionChange}
              helperText="توضیحات اختیاری درباره قالب و نحوه استفاده از آن"
            />
          </Box>
        </SectionCard>
      </Grid>

      <Grid item xs={12}>
        <AttributesForm
            ref={formRef}
            attributesData={attributesData}
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
            helperText="تصاویر مرتبط با این قالب ویژگی‌ها را انتخاب کنید"
            product
            defaultType={MediaType.PRODUCT}
          />
        </SectionCard>
      </Grid>
    </>
  );
}
