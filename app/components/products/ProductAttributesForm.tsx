import React from "react";
import { Grid } from "@mui/material";
import type { ICategoryAttr } from "../../types/interfaces/attributes.interface";
import AttributesFormFields from "../../components/templates/attributes/AttributesFormFields";

interface ProductAttributesFormProps {
  data: ICategoryAttr;
  formData: { [key: string]: any };
  onFormDataChange: (fieldId: number | string, value: any) => void;
  validationErrors: { [key: string]: string };
}

const ProductAttributesForm: React.FC<ProductAttributesFormProps> = ({
  data,
  formData,
  onFormDataChange,
  validationErrors,
}) => {
  return (
    <Grid container spacing={2}>
      <AttributesFormFields
        attributesData={data.category_group_attributes}
        formData={formData}
        onFieldChange={onFormDataChange}
        errors={validationErrors}
      />
    </Grid>
  );
};

export default ProductAttributesForm;