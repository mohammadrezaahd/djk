import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
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

interface DetailsFormFieldsProps {
  detailsData: ICategoryDetails;
  formData: { [key: string]: any };
  onFormDataChange: (fieldName: string, value: any) => void;
  validationErrors?: { [key: string]: string };
}

const DetailsFormFields: React.FC<DetailsFormFieldsProps> = ({
  detailsData,
  formData,
  onFormDataChange,
  validationErrors = {},
}) => {
  const bind = detailsData?.bind;

  if (!detailsData || !bind) {
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

  const isFakeProduct = formData.is_fake_product === true;
  const isGeneralId = (formData.id_type || "general") === "general";

  return (
    <Grid container spacing={3}>
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
              value={isFakeProduct ? "fake" : "original"}
              onChange={(fieldName: string, value: any) => {
                const isFake = value === "fake";
                onFormDataChange("is_fake_product", isFake);
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
              value={formData.brand || ""}
              onChange={onFormDataChange}
              disabled={isFakeProduct}
              showBrandLogo
              required
              error={validationErrors.brand}
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
              value={formData.status || ""}
              onChange={onFormDataChange}
              error={validationErrors.status}
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
              value={formData.platform || ""}
              onChange={onFormDataChange}
              error={validationErrors.platform}
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
              value={formData.product_class || ""}
              onChange={onFormDataChange}
              error={validationErrors.product_class}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.category_product_types && bind.category_product_types.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="نوع محصول">
            <DetailsField
              fieldName="category_product_type"
              fieldData={bind.category_product_types}
              label="نوع محصول"
              value={formData.category_product_type || ""}
              onChange={onFormDataChange}
              error={validationErrors.category_product_type}
            />
          </SectionCard>
        </Grid>
      )}

      {bind?.brand_model && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="مدل برند">
            <DetailsField
              fieldName="brand_model"
              label="مدل برند"
              value={formData.brand_model || ""}
              onChange={onFormDataChange}
              isTextField
              required={bind.brand_model.require}
              placeholder="مدل برند را وارد کنید"
              error={validationErrors.brand_model}
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
              value={formData.fake_reason || ""}
              onChange={onFormDataChange}
              error={validationErrors.fake_reason}
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
                value={formData.id_type || "general"}
                onChange={(fieldName: string, value: any) => {
                  onFormDataChange("id_type", value);
                  // Clear both fields when switching types
                  if (value === "general") {
                    onFormDataChange("custom_id", "");
                  } else if (value === "custom") {
                    onFormDataChange("general_mefa_id", "");
                  }
                }}
                isRadioGroup
              />

              {isGeneralId ? (
                <DetailsField
                  fieldName="general_mefa_id"
                  fieldData={bind.general_mefa}
                  label="شناسه عمومی"
                  value={formData.general_mefa_id || ""}
                  onChange={onFormDataChange}
                  isObjectData
                  error={validationErrors.general_mefa_id}
                />
              ) : (
                <DetailsField
                  fieldName="custom_id"
                  label="شناسه خصوصی"
                  value={formData.custom_id || ""}
                  onChange={onFormDataChange}
                  isTextField
                  placeholder="شناسه خصوصی را وارد کنید..."
                  error={validationErrors.custom_id}
                />
              )}
            </Box>
          </SectionCard>
        </Grid>
      )}
    </Grid>
  );
};

export default DetailsFormFields;
