import React from "react";
import { TemplateForms } from "~/components/products";
import { AttributesForm } from "~/components/forms";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { z } from "zod";

interface AttributesFormStepProps {
  selectedTemplates: any[];
  activeTemplateIndex: number;
  onTabChange: (index: number) => void;
  onRemoveTemplate: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  activeAttributesTemplateData: ICategoryAttr;
  attributesSchema: z.ZodObject<any, any>;
  handleAttributesSubmit: (data: any) => void;
  activeAttributesTemplate: any;
}

const AttributesFormStep: React.FC<AttributesFormStepProps> = ({
  selectedTemplates,
  activeTemplateIndex,
  onTabChange,
  onRemoveTemplate,
  onNext,
  onBack,
  activeAttributesTemplateData,
  attributesSchema,
  handleAttributesSubmit,
  activeAttributesTemplate,
}) => {
  return (
    <TemplateForms
      title="تکمیل فرم‌های ویژگی"
      selectedTemplates={selectedTemplates}
      activeTemplateIndex={activeTemplateIndex}
      onTabChange={onTabChange}
      onRemoveTemplate={onRemoveTemplate}
      onNext={onNext}
      onBack={onBack}
    >
      {activeAttributesTemplate && activeAttributesTemplateData && attributesSchema && (
        <AttributesForm
          attributesData={activeAttributesTemplateData}
          onSubmit={handleAttributesSubmit}
          validationSchema={attributesSchema}
          defaultValues={activeAttributesTemplate.formData}
        />
      )}
    </TemplateForms>
  );
};

export default AttributesFormStep;
