import React from "react";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import DetailsFormFields from "~/components/templates/details/DetailsFormFields";

interface ProductDetailsFormProps {
  data: ICategoryDetails;
  formData: { [key: string]: any };
  onFormDataChange: (fieldName: string, value: any) => void;
  validationErrors?: { [key: string]: string };
}

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  data,
  formData,
  onFormDataChange,
  validationErrors = {},
}) => {
  return (
    <DetailsFormFields
      detailsData={data}
      formData={formData}
      onFormDataChange={onFormDataChange}
      validationErrors={validationErrors}
    />
  );
};

export default ProductDetailsForm;