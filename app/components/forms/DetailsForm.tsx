import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import DetailsField from "~/components/templates/details/DetailsField";

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

interface DetailsFormProps {
  detailsData: ICategoryDetails;
  onSubmit: (data: any) => void;
  validationSchema: z.ZodObject<any, any>;
  defaultValues?: { [key: string]: any };
  onValidationChange?: (isValid: boolean) => void;
}

export const DetailsForm = forwardRef(({
  detailsData,
  onSubmit,
  validationSchema,
  defaultValues = {},
  onValidationChange,
}: DetailsFormProps, ref) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
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

  const bind = detailsData?.bind;
  const isFakeProduct = watch("is_fake_product") === true;
  const idType = watch("id_type") || "general";

  if (!detailsData || !bind) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {bind?.allow_fake && (
          <Grid item xs={12}>
            <SectionCard title="نوع کالا">
              <Controller
                name="is_fake_product"
                control={control}
                render={({ field }) => (
                  <DetailsField
                    fieldName="is_fake_product"
                    fieldData={[
                      { value: "original", label: "فروش کالای اصل" },
                      { value: "fake", label: "فروش کالای غیر اصل" },
                    ]}
                    label=""
                    value={field.value ? "fake" : "original"}
                    onChange={(fieldName, value) => field.onChange(value === "fake")}
                    isRadioGroup
                  />
                )}
              />
            </SectionCard>
          </Grid>
        )}

        {bind?.brands && bind.brands.length > 0 && (
          <Grid item xs={12} md={6}>
            <SectionCard title="برند محصول">
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <DetailsField
                    {...field}
                    fieldName="brand"
                    fieldData={bind.brands}
                    label={isFakeProduct ? "برند (متفرقه - غیر قابل ویرایش)" : "برند"}
                    disabled={isFakeProduct}
                    showBrandLogo
                    required
                    error={errors.brand?.message as string}
                  />
                )}
              />
            </SectionCard>
          </Grid>
        )}

        {bind?.statuses && bind.statuses.length > 0 && (
          <Grid item xs={12} md={6}>
            <SectionCard title="وضعیت محصول">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <DetailsField
                    {...field}
                    fieldName="status"
                    fieldData={bind.statuses}
                    label="وضعیت"
                    error={errors.status?.message as string}
                  />
                )}
              />
            </SectionCard>
          </Grid>
        )}

        {bind?.platforms && bind.platforms.length > 0 && (
          <Grid item xs={12} md={6}>
            <SectionCard title="پلتفرم">
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <DetailsField
                    {...field}
                    fieldName="platform"
                    fieldData={bind.platforms}
                    label="پلتفرم"
                    error={errors.platform?.message as string}
                  />
                )}
              />
            </SectionCard>
          </Grid>
        )}

        {bind?.product_classes && bind.product_classes.length > 0 && (
          <Grid item xs={12} md={6}>
            <SectionCard title="کلاس محصول">
              <Controller
                name="product_class"
                control={control}
                render={({ field }) => (
                  <DetailsField
                    {...field}
                    fieldName="product_class"
                    fieldData={bind.product_classes}
                    label="کلاس محصول"
                    error={errors.product_class?.message as string}
                  />
                )}
              />
            </SectionCard>
          </Grid>
        )}

        {bind?.category_product_types &&
          bind.category_product_types.length > 0 && (
            <Grid item xs={12} md={6}>
              <SectionCard title="نوع محصول">
                <Controller
                  name="category_product_type"
                  control={control}
                  render={({ field }) => (
                    <DetailsField
                      {...field}
                      fieldName="category_product_type"
                      fieldData={bind.category_product_types}
                      label="نوع محصول"
                      error={errors.category_product_type?.message as string}
                    />
                  )}
                />
              </SectionCard>
            </Grid>
          )}

        {bind?.brand_model && (
          <Grid item xs={12} md={6}>
            <SectionCard title="مدل برند">
              <Controller
                name="brand_model"
                control={control}
                render={({ field }) => (
                  <DetailsField
                    {...field}
                    fieldName="brand_model"
                    label="مدل برند"
                    isTextField
                    required={bind.brand_model.require}
                    placeholder="مدل برند را وارد کنید"
                    error={errors.brand_model?.message as string}
                  />
                )}
              />
            </SectionCard>
          </Grid>
        )}

        {bind?.fake_reasons && bind.fake_reasons.length > 0 && (
          <Grid item xs={12} md={6}>
            <SectionCard title="دلایل تقلبی">
              <Controller
                name="fake_reason"
                control={control}
                render={({ field }) => (
                  <DetailsField
                    {...field}
                    fieldName="fake_reason"
                    fieldData={bind.fake_reasons}
                    label="دلیل تقلبی"
                    error={errors.fake_reason?.message as string}
                  />
                )}
              />
            </SectionCard>
          </Grid>
        )}

        {bind?.general_mefa && Object.keys(bind.general_mefa).length > 0 && (
          <Grid item xs={12}>
            <SectionCard title="شناسه کالا">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="id_type"
                  control={control}
                  defaultValue="general"
                  render={({ field }) => (
                    <DetailsField
                      fieldName="id_type"
                      fieldData={[
                        { value: "general", label: "شناسه عمومی" },
                        { value: "custom", label: "شناسه خصوصی" },
                      ]}
                      label=""
                      value={field.value}
                      onChange={(fieldName, value) => {
                        field.onChange(value);
                        if (value === "general") {
                          setValue("custom_id", "");
                        } else if (value === "custom") {
                          setValue("general_mefa_id", "");
                        }
                      }}
                      isRadioGroup
                    />
                  )}
                />

                {idType === "general" ? (
                  <Controller
                    name="general_mefa_id"
                    control={control}
                    render={({ field }) => (
                      <DetailsField
                        {...field}
                        fieldName="general_mefa_id"
                        fieldData={bind.general_mefa}
                        label="شناسه عمومی"
                        isObjectData
                        error={errors.general_mefa_id?.message as string}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name="custom_id"
                    control={control}
                    render={({ field }) => (
                      <DetailsField
                        {...field}
                        fieldName="custom_id"
                        label="شناسه خصوصی"
                        isTextField
                        placeholder="شناسه خصوصی را وارد کنید..."
                        error={errors.custom_id?.message as string}
                      />
                    )}
                  />
                )}
              </Box>
            </SectionCard>
          </Grid>
        )}
      </Grid>
    </form>
  );
});
