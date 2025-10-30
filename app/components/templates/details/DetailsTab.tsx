import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { updateFormField } from "~/store/slices/detailsSlice";
import type { RootState } from "~/store";
import { useDetailsValidation } from "~/validation";
import DetailsField from "./DetailsField";

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
}

const DetailsTab = ({ onValidationChange }: DetailsTabProps) => {
  const dispatch = useAppDispatch();
  const detailsData = useAppSelector(
    (state: RootState) => (state.details as any)?.detailsData
  );
  const detailsFormData = useAppSelector(
    (state: RootState) => (state.details as any)?.formData || {}
  );
  const loading = useAppSelector(
    (state: RootState) => (state.details as any)?.loading || false
  );

  // Use validation hook
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
    form.setValue(fieldName as any, value, { shouldValidate: true, shouldDirty: true });
    dispatch(updateFormField({ fieldName, value }));
  };

  const isFakeProduct = form.watch('is_fake_product') === true;
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
    if (bind?.category_mefa_type && !form.watch('id_type')) {
      handleDetailsChange("id_type", bind.category_mefa_type);
    }
  }, [bind?.category_mefa_type, form.watch('id_type')]);

  const isGeneralId = (form.watch('id_type') || bind?.category_mefa_type) === "general";

  if (!detailsData || !detailsData.bind) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            {loading
              ? "در حال بارگیری اطلاعات..."
              : "اطلاعات محصول در دسترس نیست"}
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <SectionCard title="عنوان قالب اطلاعات">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <DetailsField
              fieldName="title"
              label="عنوان قالب اطلاعات"
              value={form.watch('title')}
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
              value={form.watch('description')}
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

      {bind?.allow_fake && (
        <Grid size={{ xs: 12 }}>
          <SectionCard title="نوع کالا">
            <DetailsField
              fieldName="is_fake_product"
              fieldData={[
                { value: "original", label: "فروش کالای اصل" },
                { value: "fake", label: "فروش کالای غیر اصل" },
              ]}
              label=""
              value={
                form.watch('is_fake_product') === true ? "fake" : "original"
              }
              onChange={(fieldName: string, value: any) => {
                const isFake = value === "fake";
                handleDetailsChange("is_fake_product", isFake);
              }}
              isRadioGroup
              error={form.formState.errors.is_fake_product?.message as string}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.brands && bind.brands.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="برند محصول">
            <DetailsField
              fieldName="brand"
              fieldData={bind.brands}
              label={isFakeProduct ? "برند (متفرقه - غیر قابل ویرایش)" : "برند"}
              value={form.watch('brand')}
              onChange={handleDetailsChange}
              disabled={isFakeProduct}
              showBrandLogo
              required
              error={form.formState.errors.brand?.message as string}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.statuses && bind.statuses.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="وضعیت محصول">
            <DetailsField
              fieldName="status"
              fieldData={bind.statuses}
              label="وضعیت"
              value={form.watch('status')}
              onChange={handleDetailsChange}
              error={form.formState.errors.status?.message as string}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.platforms && bind.platforms.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="پلتفرم">
            <DetailsField
              fieldName="platform"
              fieldData={bind.platforms}
              label="پلتفرم"
              value={form.watch('platform')}
              onChange={handleDetailsChange}
              error={form.formState.errors.platform?.message as string}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.product_classes && bind.product_classes.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="کلاس محصول">
            <DetailsField
              fieldName="product_class"
              fieldData={bind.product_classes}
              label="کلاس محصول"
              value={form.watch('product_class')}
              onChange={handleDetailsChange}
              error={form.formState.errors.product_class?.message as string}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.category_product_types &&
        bind.category_product_types.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="نوع محصول">
              <DetailsField
                fieldName="category_product_type"
                fieldData={bind.category_product_types}
                label="نوع محصول"
                value={form.watch('category_product_type')}
                onChange={handleDetailsChange}
                error={form.formState.errors.category_product_type?.message as string}
              />
            </SectionCard>
          </Grid>
        )}

      {bind?.fake_reasons && bind.fake_reasons.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="دلایل تقلبی">
            <DetailsField
              fieldName="fake_reason"
              fieldData={bind.fake_reasons}
              label="دلیل تقلبی"
              value={form.watch('fake_reason')}
              onChange={handleDetailsChange}
              error={form.formState.errors.fake_reason?.message as string}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.category_data?.themes && bind.category_data.themes.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="تم دسته‌بندی">
            <DetailsField
              fieldName="theme"
              fieldData={bind.category_data.themes}
              label="تم"
              value={form.watch('theme')}
              onChange={handleDetailsChange}
              error={form.formState.errors.theme?.message as string}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.general_mefa && Object.keys(bind.general_mefa).length > 0 && (
        <Grid size={{ xs: 12 }}>
          <SectionCard title="شناسه کالا">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <DetailsField
                fieldName="id_type"
                fieldData={[
                  { value: "general", label: "شناسه عمومی" },
                  { value: "custom", label: "شناسه خصوصی" },
                ]}
                label=""
                value={
                  form.watch('id_type') ||
                  bind?.category_mefa_type ||
                  "general"
                }
                onChange={(fieldName: string, value: any) => {
                  handleDetailsChange("id_type", value);
                  handleDetailsChange("general_mefa_id", "");
                  handleDetailsChange("custom_id", "");
                }}
                isRadioGroup
                error={form.formState.errors.id_type?.message as string}
              />

              {isGeneralId ? (
                <DetailsField
                  fieldName="general_mefa_id"
                  fieldData={bind.general_mefa}
                  label="شناسه عمومی"
                  value={form.watch('general_mefa_id')}
                  onChange={handleDetailsChange}
                  isObjectData
                  error={form.formState.errors.general_mefa_id?.message as string}
                />
              ) : (
                <DetailsField
                  fieldName="custom_id"
                  label="شناسه خصوصی"
                  value={form.watch('custom_id')}
                  onChange={handleDetailsChange}
                  isTextField
                  placeholder="شناسه خصوصی را وارد کنید..."
                  error={form.formState.errors.custom_id?.message as string}
                />
              )}
            </Box>
          </SectionCard>
        </Grid>
      )}
    </Grid>
  );
};

export default DetailsTab;
