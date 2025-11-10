import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
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

interface AttributesFormFieldsProps {
  attributesData: ICategoryAttr;
  formData: { [key: string]: any };
  onFormDataChange: (fieldId: string | number, value: any) => void;
  validationErrors?: { [key: string]: string };
}

const AttributesFormFields: React.FC<AttributesFormFieldsProps> = ({
  attributesData,
  formData,
  onFormDataChange,
  validationErrors = {},
}) => {
  if (!attributesData?.category_group_attributes) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="ویژگی‌های محصول">
          <Typography variant="body1" color="text.secondary">
            ویژگی‌های محصول در دسترس نیست
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  // Check if there are any attributes to display
  const hasAttributes = Object.values(attributesData.category_group_attributes).some(
    (categoryData) => categoryData.attributes && Object.keys(categoryData.attributes).length > 0
  );

  if (!hasAttributes) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="ویژگی‌های محصول">
          <Typography variant="body1" color="text.secondary">
            هیچ ویژگی‌ای برای این قالب تعریف نشده است
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {Object.entries(attributesData.category_group_attributes).map(([categoryId, categoryData]) => (
        <Grid size={{ xs: 12 }} key={categoryId}>
          <SectionCard title={categoryData.group_title || `گروه ${categoryId}`}>
            <Grid container spacing={2}>
              {Object.values(categoryData.attributes).map((attr) => {
                const fieldKey = attr.code || attr.id;
                return (
                  <Grid size={{ xs: 12, md: 6 }} key={attr.id}>
                    <AttributesField
                      attr={attr}
                      value={formData[fieldKey]}
                      onChange={onFormDataChange}
                      error={validationErrors[fieldKey.toString()]}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </SectionCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default AttributesFormFields;
