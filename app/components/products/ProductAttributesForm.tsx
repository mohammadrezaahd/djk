import React from "react";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import AttributesFormFields from "~/components/templates/attributes/AttributesFormFields";

interface ProductAttributesFormProps {
  data: ICategoryAttr;
  formData: { [key: string]: any };
  onFormDataChange: (fieldId: number | string, value: any) => void;
  validationErrors?: { [key: string]: string };
}

const ProductAttributesForm: React.FC<ProductAttributesFormProps> = ({
  data,
  formData,
  onFormDataChange,
  validationErrors = {},
}) => {
  // Wrapper - pass fieldId as-is (can be string or number)
  const handleFormDataChange = (fieldId: string | number, value: any) => {
    onFormDataChange(fieldId, value);
  };

  return (
    <AttributesFormFields
      attributesData={data}
      formData={formData}
      onFormDataChange={handleFormDataChange}
      validationErrors={validationErrors}
    />
  );
};

export default ProductAttributesForm;