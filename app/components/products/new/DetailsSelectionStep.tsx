import React from "react";
import { TemplateSelection } from "~/components/products";
import type { ITemplateList } from "~/types/interfaces/templates.interface";

interface DetailsSelectionStepProps {
  availableTemplates: ITemplateList[];
  selectedTemplateIds: number[];
  onTemplateToggle: (template: ITemplateList) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const DetailsSelectionStep: React.FC<DetailsSelectionStepProps> = ({
  availableTemplates,
  selectedTemplateIds,
  onTemplateToggle,
  onNext,
  onBack,
  isLoading,
}) => {
  return (
    <TemplateSelection
      title="انتخاب قالب‌های اطلاعات"
      availableTemplates={availableTemplates}
      selectedTemplateIds={selectedTemplateIds}
      onTemplateToggle={onTemplateToggle}
      onNext={onNext}
      onBack={onBack}
      isLoading={isLoading}
    />
  );
};

export default DetailsSelectionStep;
