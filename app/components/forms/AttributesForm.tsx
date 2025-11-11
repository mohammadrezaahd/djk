import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import AttributesField from "~/components/templates/attributes/AttributesField";

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

interface AttributesFormProps {
  attributesData: ICategoryAttr;
  onSubmit: (data: any) => void;
  validationSchema: z.ZodObject<any, any>;
  defaultValues?: { [key: string]: any };
  onValidationChange?: (isValid: boolean) => void;
}

export const AttributesForm = forwardRef(({
  attributesData,
  onSubmit,
  validationSchema,
  defaultValues = {},
  onValidationChange,
}: AttributesFormProps, ref) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  if (!attributesData?.category_group_attributes) {
    return (
      <Grid item xs={12}>
        <SectionCard title="ویژگی‌های محصول">
          <Typography variant="body1" color="text.secondary">
            ویژگی‌های محصول در دسترس نیست
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  const hasAttributes = Object.values(attributesData.category_group_attributes).some(
    (categoryData) => categoryData.attributes && Object.keys(categoryData.attributes).length > 0
  );

  if (!hasAttributes) {
    return (
      <Grid item xs={12}>
        <SectionCard title="ویژگی‌های محصول">
          <Typography variant="body1" color="text.secondary">
            هیچ ویژگی‌ای برای این قالب تعریف نشده است
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {Object.entries(attributesData.category_group_attributes).map(([categoryId, categoryData]) => (
          <Grid item xs={12} key={categoryId}>
            <SectionCard title={categoryData.group_title || `گروه ${categoryId}`}>
              <Grid container spacing={2}>
                {Object.values(categoryData.attributes).map((attr) => {
                  const fieldKey = attr.code || attr.id;
                  return (
                    <Grid item xs={12} md={6} key={attr.id}>
                      <Controller
                        name={fieldKey.toString()}
                        control={control}
                        render={({ field }) => (
                          <AttributesField
                            attr={attr}
                            value={field.value}
                            onChange={(fieldId, value) => field.onChange(value)}
                            error={errors[fieldKey.toString()]?.message as string}
                          />
                        )}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </SectionCard>
          </Grid>
        ))}
      </Grid>
    </form>
  );
});
