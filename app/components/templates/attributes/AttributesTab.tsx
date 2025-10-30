import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import type { IAttr } from "~/types/interfaces/attributes.interface";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import {
  updateFormField,
  setTitle,
  setDescription,
} from "~/store/slices/attributesSlice";
import { useAttributesValidation } from "~/validation";
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

interface AttributesTabProps {
  onValidationChange?: (isValid: boolean) => void;
}

export default function AttributesTab({ onValidationChange }: AttributesTabProps) {
  const dispatch = useAppDispatch();
  const { attributesData, formData, loading, title, description } =
    useAppSelector((state) => state.attributes);

  // Use validation hook
  const form = useAttributesValidation(attributesData, formData, title, description);

  // Notify parent component about validation state changes
  useEffect(() => {
    onValidationChange?.(form.isFormValid);
  }, [form.isFormValid, onValidationChange]);

  // Update store when form values change
  useEffect(() => {
    const subscription = form.watch((value: any, { name }: any) => {
      if (name === 'title') {
        dispatch(setTitle(value.title || ''));
      } else if (name === 'description') {
        dispatch(setDescription(value.description || ''));
      } else if (name && name !== 'title' && name !== 'description') {
        dispatch(updateFormField({ fieldId: name, value: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, dispatch]);

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
    const fieldKey = attrId.toString();
    form.setValue(fieldKey, value, { shouldValidate: true, shouldDirty: true });
    dispatch(updateFormField({ fieldId: fieldKey, value }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    form.setValue('title', newTitle, { shouldValidate: true, shouldDirty: true });
    dispatch(setTitle(newTitle));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDescription = event.target.value;
    form.setValue('description', newDescription, { shouldValidate: true, shouldDirty: true });
    dispatch(setDescription(newDescription));
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
              value={form.watch('title') || ''}
              onChange={handleTitleChange}
              required
              error={!!form.formState.errors.title}
              helperText={form.formState.errors.title?.message || "این عنوان برای شناسایی قالب استفاده خواهد شد"}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="سایر توضیحات"
              placeholder="توضیحات اضافی درباره قالب..."
              value={form.watch('description') || ''}
              onChange={handleDescriptionChange}
              error={!!form.formState.errors.description}
              helperText={form.formState.errors.description?.message || "توضیحات اختیاری درباره قالب و نحوه استفاده از آن"}
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
                  value={form.watch(attr.id.toString())}
                  onChange={handleInputChange}
                  error={form.formState.errors[attr.id.toString()]?.message as string}
                />
              </Grid>
            ))}
          </Grid>
        </SectionCard>
      </Grid>
    </>
  );
}
