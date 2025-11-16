import React from "react";
import { Stepper, Step, StepLabel, StepButton } from "@mui/material";
import { FormStep } from "../../store/slices/productSlice";

interface FormStepsProps {
  currentStep: FormStep;
  stepValidationErrors: Record<string, boolean>;
}

const steps = [
  { key: FormStep.CATEGORY_SELECTION, label: "انتخاب دسته‌بندی" },
  { key: FormStep.DETAILS_SELECTION, label: "انتخاب قالب اطلاعات" },
  { key: FormStep.DETAILS_FORM, label: "تکمیل اطلاعات" },
  { key: FormStep.ATTRIBUTES_SELECTION, label: "انتخاب قالب ویژگی‌ها" },
  { key: FormStep.ATTRIBUTES_FORM, label: "تکمیل ویژگی‌ها" },
  { key: FormStep.IMAGE_SELECTION, label: "انتخاب تصاویر" },
  { key: FormStep.PRODUCT_INFO, label: "اطلاعات نهایی" },
];

const FormSteps: React.FC<FormStepsProps> = ({
  currentStep,
  stepValidationErrors,
}) => {
  const activeStep = steps.findIndex((step) => step.key === currentStep);

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
      {steps.map((step) => (
        <Step key={step.key}>
          <StepLabel error={stepValidationErrors[step.key]}>
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default FormSteps;