import React from "react";
import { TemplateForms } from "~/components/products";
import { DetailsForm } from "~/components/forms";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import type { z } from "zod";

interface DetailsFormStepProps {
  selectedTemplates: any[];
  activeTemplateIndex: number;
  onTabChange: (index: number) => void;
  onRemoveTemplate: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  activeDetailsTemplateData: ICategoryDetails;
  detailsSchema: z.ZodObject<any, any>;
  handleDetailsSubmit: (data: any) => void;
  activeDetailsTemplate: any;
}

const DetailsFormStep: React.FC<DetailsFormStepProps> = ({
  selectedTemplates,
  activeTemplateIndex,
  onTabChange,
  onRemoveTemplate,
  onNext,
  onBack,
  activeDetailsTemplateData,
  detailsSchema,
  handleDetailsSubmit,
  activeDetailsTemplate,
}) => {
  return (
    <TemplateForms
      title="تکمیل فرم‌های اطلاعات"
      selectedTemplates={selectedTemplates}
      activeTemplateIndex={activeTemplateIndex}
      onTabChange={onTabChange}
      onRemoveTemplate={onRemoveTemplate}
      onNext={onNext}
      onBack={onBack}
    >
      {activeDetailsTemplate && activeDetailsTemplateData && detailsSchema && (
        <DetailsForm
          detailsData={activeDetailsTemplateData}
          onSubmit={handleDetailsSubmit}
          validationSchema={detailsSchema}
          defaultValues={activeDetailsTemplate.formData}
        />
      )}
    </TemplateForms>
  );
};

export default DetailsFormStep;
