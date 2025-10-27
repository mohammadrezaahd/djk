import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import type { IAttr } from "~/types/interfaces/attributes.interface";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import {
  updateFormField,
  setTitle,
  setDescription,
} from "~/store/slices/attributesSlice";
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
  const dispatch = useAppDispatch();
  const { attributesData, formData, loading, title, description } =
    useAppSelector((state) => state.attributes);

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

  const handleInputChange = (attrId: number, value: any) => {
    dispatch(updateFormField({ fieldId: attrId.toString(), value }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setDescription(event.target.value));
  };

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

      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Grid container spacing={3}>
            {attributes.map((attr) => (
              <Grid key={attr.id} size={{ xs: 12, md: 6 }}>
                <AttributesField
                  attr={attr}
                  value={formData[attr.id]}
                  onChange={handleInputChange}
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>
      </Grid>
    </>
  );
}
