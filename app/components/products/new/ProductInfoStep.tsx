import React from "react";
import { ProductInfoForm } from "~/components/products";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";

interface ProductInfoStepProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  hasValidationErrors: boolean;
  isSubmitting: boolean;
  stepValidationErrors: any;
  attributesData: ICategoryAttr[];
  detailsData: ICategoryDetails[];
}

const ProductInfoStep: React.FC<ProductInfoStepProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onBack,
  hasValidationErrors,
  isSubmitting,
  stepValidationErrors,
  attributesData,
  detailsData,
}) => {
  return (
    <ProductInfoForm
      title={title}
      description={description}
      onTitleChange={onTitleChange}
      onDescriptionChange={onDescriptionChange}
      onSubmit={onSubmit}
      onBack={onBack}
      hasValidationErrors={hasValidationErrors}
      isSubmitting={isSubmitting}
      stepValidationErrors={stepValidationErrors}
      attributesData={attributesData}
      detailsData={detailsData}
    />
  );
};

export default ProductInfoStep;
