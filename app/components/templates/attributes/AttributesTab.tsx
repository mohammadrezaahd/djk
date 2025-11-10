import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import type { IAttr } from "~/types/interfaces/attributes.interface";
import { StaticCategoryIds } from "~/types/interfaces/attributes.interface";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import {
  updateFormField,
  setTitle,
  setDescription,
  setImages,
} from "~/store/slices/attributesSlice";
import { useAttributesValidation } from "~/validation";
import AttributesField from "./AttributesField";
import AttributesFormFields from "./AttributesFormFields";
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

interface AttributesTabProps {
  onValidationChange?: (isValid: boolean) => void;
  isLoading: boolean;
}

export default function AttributesTab({
  onValidationChange,
  isLoading,
}: AttributesTabProps) {
  const dispatch = useAppDispatch();
  const { attributesData, formData, title, description, images } =
    useAppSelector((state) => state.attributes);

  // Use validation hook
  const form = useAttributesValidation(
    attributesData,
    formData,
    title,
    description
  );

  // Notify parent component about validation state changes
  useEffect(() => {
    onValidationChange?.(form.isFormValid);
  }, [form.isFormValid, onValidationChange]);

  // Update store when form values change
  useEffect(() => {
    const subscription = form.watch((value: any, { name }: any) => {
      if (name === "title") {
        dispatch(setTitle(value.title || ""));
      } else if (name === "description") {
        dispatch(setDescription(value.description || ""));
      } else if (name && name !== "title" && name !== "description") {
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

  // Separate packaging fields (package_width/height/length/weight) into their own section
  const packagingAttributes = React.useMemo(() => {
    return attributes.filter((attr) =>
      [
        StaticCategoryIds.PackageWidth,
        StaticCategoryIds.PackageHeight,
        StaticCategoryIds.PackageLength,
        StaticCategoryIds.PackageWeight,
      ].includes(attr.code as any)
    );
  }, [attributes]);

  const otherAttributes = React.useMemo(() => {
    return attributes.filter((attr) => !packagingAttributes.includes(attr));
  }, [attributes, packagingAttributes]);

  const handleInputChange = (attrId: number | string, value: any) => {
    const fieldKey = typeof attrId === 'number' ? attrId.toString() : attrId;
    form.setValue(fieldKey, value, { shouldValidate: true, shouldDirty: true });
    dispatch(updateFormField({ fieldId: fieldKey, value }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    form.setValue("title", newTitle, {
      shouldValidate: true,
      shouldDirty: true,
    });
    dispatch(setTitle(newTitle));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDescription = event.target.value;
    form.setValue("description", newDescription, {
      shouldValidate: true,
      shouldDirty: true,
    });
    dispatch(setDescription(newDescription));
  };

  const handleImagesChange = (selectedImages: number[]) => {
    dispatch(setImages(selectedImages));
  };

  if (isLoading) {
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
              value={form.watch("title") || ""}
              onChange={handleTitleChange}
              required
              error={!!form.formState.errors.title}
              helperText={
                form.formState.errors.title?.message ||
                "این عنوان برای شناسایی قالب استفاده خواهد شد"
              }
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="سایر توضیحات"
              placeholder="توضیحات اضافی درباره قالب..."
              value={form.watch("description") || ""}
              onChange={handleDescriptionChange}
              error={!!form.formState.errors.description}
              helperText={
                form.formState.errors.description?.message ||
                "توضیحات اختیاری درباره قالب و نحوه استفاده از آن"
              }
            />
          </Box>
        </SectionCard>
      </Grid>

      {/* Packaging section (compact layout) */}
      {packagingAttributes.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <SectionCard title="اطلاعات بسته‌بندی">
            <Grid container spacing={2}>
              {packagingAttributes.map((attr) => (
                <Grid key={attr.id} size={{ xs: 12, md: 3 }}>
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

      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Grid container spacing={3}>
            {otherAttributes.map((attr) => (
              <Grid key={attr.id} size={{ xs: 12, md: 6 }}>
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

      <Grid size={{ xs: 12 }}>
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
