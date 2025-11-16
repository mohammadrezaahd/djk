import React from "react";
import { Grid } from "@mui/material";
import type { ICategoryDetails } from "../../types/interfaces/details.interface";
import DetailsFormFields from "../../components/templates/details/DetailsFormFields";

interface ProductDetailsFormProps {
  data: ICategoryDetails;
  formData: { [key: string]: any };
  onFormDataChange: (fieldName: string, value: any) => void;
  validationErrors: { [key: string]: string };
}

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  data,
  formData,
  onFormDataChange,
  validationErrors,
}) => {
  return (
    <Grid container spacing={2}>
      <DetailsFormFields
        detailsData={data}
        formData={formData}
        onFieldChange={onFormDataChange}
        errors={validationErrors}
      />
    </Grid>
  );
};

export default ProductDetailsForm;