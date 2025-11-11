import React from "react";
import { ProductImageSelection } from "~/components/products";

interface ImageSelectionStepProps {
  selectedImages: number[];
  onImageSelectionChange: (selectedIds: number[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ImageSelectionStep: React.FC<ImageSelectionStepProps> = ({
  selectedImages,
  onImageSelectionChange,
  onNext,
  onBack,
}) => {
  return (
    <ProductImageSelection
      selectedImages={selectedImages}
      onImageSelectionChange={onImageSelectionChange}
      onNext={onNext}
      onBack={onBack}
    />
  );
};

export default ImageSelectionStep;
