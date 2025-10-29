import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { IAttr } from "~/types/interfaces/attributes.interface";
import { useAppSelector } from "~/store/hooks";
import AttributesField from "./AttributesField";

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

interface AttributesTabProps {}

export default function AttributesTab({}: AttributesTabProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { attributesData, loading } = useAppSelector(
    (state) => state.attributes
  );

  const attributes: IAttr[] = React.useMemo(() => {
    if (!attributesData?.category_group_attributes) return [];

    const allAttributes: IAttr[] = [];
    Object.values(attributesData.category_group_attributes).forEach(
      (categoryData) => {
        Object.values(categoryData.attributes).forEach((attr) => {
          if (attr.id !== 2233) {
            allAttributes.push(attr);
          }
        });
      }
    );

    return allAttributes;
  }, [attributesData]);

  if (loading) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            در حال بارگیری اطلاعات...
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  if (attributes.length === 0) {
    return (
      <Grid size={{ xs: 12 }}>
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
      <Grid size={{ xs: 12 }}>
        <SectionCard title="عنوان قالب ویژگی‌ها">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="عنوان قالب ویژگی‌ها"
                  placeholder="عنوان قالب را وارد کنید..."
                  required
                  error={!!errors.title}
                  helperText={
                    errors.title
                      ? errors.title.message
                      : "این عنوان برای شناسایی قالب استفاده خواهد شد"
                  }
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="سایر توضیحات"
                  placeholder="توضیحات اضافی درباره قالب..."
                  error={!!errors.description}
                  helperText={
                    errors.description
                      ? errors.description.message
                      : "توضیحات اختیاری درباره قالب و نحوه استفاده از آن"
                  }
                />
              )}
            />
          </Box>
        </SectionCard>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Grid container spacing={3}>
            {attributes.map((attr) => (
              <Grid key={attr.id} size={{ xs: 12, md: 6 }}>
                <AttributesField attr={attr} />
              </Grid>
            ))}
          </Grid>
        </SectionCard>
      </Grid>
    </>
  );
}
