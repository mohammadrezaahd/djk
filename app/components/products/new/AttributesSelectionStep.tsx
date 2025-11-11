import React from "react";
import { TemplateSelection } from "~/components/products";
import type { ITemplateList } from "~/types/interfaces/templates.interface";

interface AttributesSelectionStepProps {
  availableTemplates: ITemplateList[];
  selectedTemplateIds: number[];
  onTemplateToggle: (template: ITemplateList) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const AttributesSelectionStep: React.FC<AttributesSelectionStepProps> = ({
  availableTemplates,
  selectedTemplateIds,
  onTemplateToggle,
  onNext,
  onBack,
  isLoading,
}) => {
  return (
    <TemplateSelection
      title="انتخاب قالب‌های ویژگی"
      availableTemplates={availableTemplates}
      selectedTemplateIds={selectedTemplateIds}
      onTemplateToggle={onTemplateToggle}
      onNext={onNext}
      onBack={onBack}
      isLoading={isLoading}
    />
  );
};

export default AttributesSelectionStep;
