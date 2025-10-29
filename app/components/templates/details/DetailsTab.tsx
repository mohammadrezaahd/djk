import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useAppSelector } from "~/store/hooks";
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
  const { watch, setValue } = useFormContext();
  const detailsData = useAppSelector(
    (state: RootState) => (state.details as any)?.detailsData
  );
  const loading = useAppSelector(
    (state: RootState) => (state.details as any)?.loading || false
  );

  const isFakeProduct = watch("is_fake_product") === true;
  const idType = watch("id_type");
  const bind = detailsData?.bind;

  useEffect(() => {
    if (isFakeProduct && bind?.brands) {
      const miscBrand = bind.brands.find((brand: any) => brand.id === "719");
      if (miscBrand) {
        setValue("brand", "719");
      }
    }
  }, [isFakeProduct, bind?.brands, setValue]);

  useEffect(() => {
    if (bind?.category_mefa_type && !idType) {
      setValue("id_type", bind.category_mefa_type);
    }
  }, [bind?.category_mefa_type, idType, setValue]);

  const isGeneralId = (idType || bind?.category_mefa_type) === "general";

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
              isTextField
              required
              placeholder="عنوان قالب را وارد کنید..."
              helperText="این عنوان برای شناسایی قالب اطلاعات استفاده خواهد شد"
            />
            <DetailsField
              fieldName="description"
              label="سایر توضیحات"
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
                isRadioGroup
              />

              {isGeneralId ? (
                <DetailsField
                  fieldName="general_mefa_id"
                  fieldData={bind.general_mefa}
                  label="شناسه عمومی"
                  isObjectData
                />
              ) : (
                <DetailsField
                  fieldName="custom_id"
                  label="شناسه خصوصی"
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
