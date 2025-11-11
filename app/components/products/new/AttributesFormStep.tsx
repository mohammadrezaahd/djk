import React from "react";
import { TemplateForms, ProductAttributesForm } from "~/components/products";
import type { SelectedTemplate } from "~/store/slices/productSlice";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";

interface AttributesFormStepProps {
  selectedTemplates: SelectedTemplate<ICategoryAttr>[];
  activeTemplateIndex: number;
  onTabChange: (index: number) => void;
  onRemoveTemplate: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  activeAttributesTemplateData: any;
  activeAttributesTemplate: any;
  updateAttributesTemplateFormData: (payload: {
    templateIndex: number;
    fieldId: string;
    value: any;
  }) => void;
  validationErrors: any;
  productState: any;
}

const AttributesFormStep: React.FC<AttributesFormStepProps> = ({
  selectedTemplates,
  activeTemplateIndex,
  onTabChange,
  onRemoveTemplate,
  onNext,
  onBack,
  activeAttributesTemplateData,
  activeAttributesTemplate,
  updateAttributesTemplateFormData,
  validationErrors,
  productState,
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
      {activeAttributesTemplate && activeAttributesTemplateData?.data && (
        <ProductAttributesForm
          data={activeAttributesTemplateData.data.data_json}
          formData={activeAttributesTemplate.formData}
          onFormDataChange={(fieldId: number | string, value: any) =>
            updateAttributesTemplateFormData({
              templateIndex: productState.activeAttributesTemplateIndex,
              fieldId: typeof fieldId === "string" ? fieldId : fieldId.toString(),
              value,
            })
          }
          validationErrors={validationErrors}
        />
      )}
    </TemplateForms>
  );
};

export default AttributesFormStep;
