import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
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

interface ProductAttributesFormProps {
  data: ICategoryAttr;
  formData: { [key: string]: any };
  onFormDataChange: (fieldId: number, value: any) => void;
}

const ProductAttributesForm: React.FC<ProductAttributesFormProps> = ({
  data,
  formData,
  onFormDataChange,
}) => {
  if (!data?.category_group_attributes) {
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

  return (
    <Grid container spacing={3}>
      {Object.entries(data.category_group_attributes).map(([categoryId, categoryData]) => (
        <Grid size={{ xs: 12 }} key={categoryId}>
          <SectionCard title={categoryData.group_title || `گروه ${categoryId}`}>
            <Grid container spacing={2}>
              {Object.values(categoryData.attributes).map((attr) => (
                <Grid size={{ xs: 12, md: 6 }} key={attr.id}>
                  <AttributesField
                    attr={attr}
                    value={formData[attr.id]}
                    onChange={onFormDataChange}
                  />
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductAttributesForm;