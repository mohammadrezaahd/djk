import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { updateFormField } from "~/store/slices/detailsSlice";
import type { RootState } from "~/store";
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

interface DetailsTabProps {}

const DetailsTab = ({}: DetailsTabProps) => {
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

  const handleDetailsChange = (fieldName: string, value: any) => {
    dispatch(updateFormField({ fieldName, value }));
  };

  const isFakeProduct = detailsFormData?.is_fake_product === true;
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
    if (bind?.category_mefa_type && !detailsFormData?.id_type) {
      handleDetailsChange("id_type", bind.category_mefa_type);
    }
  }, [bind?.category_mefa_type, detailsFormData?.id_type]);

  const isGeneralId =
    (detailsFormData?.id_type || bind?.category_mefa_type) === "general";

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
              value={detailsFormData?.title}
              onChange={handleDetailsChange}
              isTextField
              required
              placeholder="عنوان قالب را وارد کنید..."
              helperText="این عنوان برای شناسایی قالب اطلاعات استفاده خواهد شد"
            />
            <DetailsField
              fieldName="description"
              label="سایر توضیحات"
              value={detailsFormData?.description}
              onChange={handleDetailsChange}
              isTextField
              multiline
              rows={3}
              placeholder="توضیحات اضافی درباره قالب..."
              helperText="توضیحات اختیاری درباره قالب و نحوه استفاده از آن"
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
                detailsFormData?.is_fake_product === true ? "fake" : "original"
              }
              onChange={(fieldName: string, value: any) => {
                const isFake = value === "fake";
                handleDetailsChange("is_fake_product", isFake);
              }}
              isRadioGroup
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
              value={detailsFormData?.brand}
              onChange={handleDetailsChange}
              disabled={isFakeProduct}
              showBrandLogo
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
              value={detailsFormData?.status}
              onChange={handleDetailsChange}
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
              value={detailsFormData?.platform}
              onChange={handleDetailsChange}
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
              value={detailsFormData?.product_class}
              onChange={handleDetailsChange}
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
                value={detailsFormData?.category_product_type}
                onChange={handleDetailsChange}
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
              value={detailsFormData?.fake_reason}
              onChange={handleDetailsChange}
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
              value={detailsFormData?.theme}
              onChange={handleDetailsChange}
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
                  detailsFormData?.id_type ||
                  bind?.category_mefa_type ||
                  "general"
                }
                onChange={(fieldName: string, value: any) => {
                  handleDetailsChange("id_type", value);
                  handleDetailsChange("general_mefa_id", "");
                  handleDetailsChange("custom_id", "");
                }}
                isRadioGroup
              />

              {isGeneralId ? (
                <DetailsField
                  fieldName="general_mefa_id"
                  fieldData={bind.general_mefa}
                  label="شناسه عمومی"
                  value={detailsFormData?.general_mefa_id}
                  onChange={handleDetailsChange}
                  isObjectData
                />
              ) : (
                <DetailsField
                  fieldName="custom_id"
                  label="شناسه خصوصی"
                  value={detailsFormData?.custom_id}
                  onChange={handleDetailsChange}
                  isTextField
                  placeholder="شناسه خصوصی را وارد کنید..."
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
