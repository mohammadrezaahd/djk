import React from "react";
import { Grid } from "@mui/material";
import { TemplateForms, ProductDetailsForm } from "~/components/products";
import type { SelectedTemplate } from "~/store/slices/productSlice";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";

interface DetailsFormStepProps {
  selectedTemplates: SelectedTemplate<ICategoryDetails>[];
  activeTemplateIndex: number;
  onTabChange: (index: number) => void;
  onRemoveTemplate: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  activeDetailsTemplateData: any;
  activeDetailsTemplate: any;
  updateDetailsTemplateFormData: (payload: {
    templateIndex: number;
    fieldName: string;
    value: any;
  }) => void;
  validationErrors: any;
  productState: any;
}

const DetailsFormStep: React.FC<DetailsFormStepProps> = ({
  selectedTemplates,
  activeTemplateIndex,
  onTabChange,
  onRemoveTemplate,
  onNext,
  onBack,
  activeDetailsTemplateData,
  activeDetailsTemplate,
  updateDetailsTemplateFormData,
  validationErrors,
  productState,
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
      {activeDetailsTemplate && activeDetailsTemplateData?.data && (
        <Grid container spacing={2}>
          <ProductDetailsForm
            data={activeDetailsTemplateData.data.data_json}
            formData={activeDetailsTemplate.formData}
            onFormDataChange={(fieldName: string, value: any) =>
              updateDetailsTemplateFormData({
                templateIndex: productState.activeDetailsTemplateIndex,
                fieldName,
                value,
              })
            }
            validationErrors={validationErrors}
          />
        </Grid>
      )}
    </TemplateForms>
  );
};

export default DetailsFormStep;
