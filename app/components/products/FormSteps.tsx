import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  StepConnector,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { FormStep } from "~/store/slices/productSlice";

interface FormStepsProps {
  currentStep: FormStep;
}

// ✅ کانکتور دقیق و سازگار با RTL و وسط‌چین دایره
const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    // مقدار top رو طوری می‌ذاریم که خط از مرکز آیکون عبور کنه
    top: 14, // ← عدد طلایی! (مقدار پیش‌فرض 22 بود)
    left: theme.direction === "rtl" ? "calc(50% + 8px)" : "calc(-50% + 8px)",
    right: theme.direction === "rtl" ? "calc(-50% + 8px)" : "calc(50% + 8px)",
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderRadius: 1,
    borderColor: theme.palette.divider,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.success.main,
  },
}));

const FormSteps: React.FC<FormStepsProps> = ({ currentStep }) => {
  const theme = useTheme();

  const steps = [
    { key: FormStep.CATEGORY_SELECTION, label: "انتخاب دسته‌بندی" },
    { key: FormStep.DETAILS_SELECTION, label: "انتخاب قالب‌های اطلاعات" },
    { key: FormStep.DETAILS_FORM, label: "تکمیل فرم‌های اطلاعات" },
    { key: FormStep.ATTRIBUTES_SELECTION, label: "انتخاب قالب‌های ویژگی" },
    { key: FormStep.ATTRIBUTES_FORM, label: "تکمیل فرم‌های ویژگی" },
    { key: FormStep.PRODUCT_INFO, label: "اطلاعات محصول" },
  ];

  const getActiveStep = () => {
    const idx = steps.findIndex((step) => step.key === currentStep);
    return Math.max(0, idx);
  };

  return (
    <Box sx={{ width: "100%", mb: 4, direction: "rtl" }}>
      <Stepper
        activeStep={getActiveStep()}
        alternativeLabel
        connector={<Connector />}
        sx={{
          direction: "rtl",
          "& .MuiStepLabel-label": {
            fontSize: "0.875rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: theme.palette.primary.main,
            fontWeight: 700,
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: theme.palette.success.main,
            fontWeight: 500,
          },
        }}
      >
        {steps.map((step) => (
          <Step key={String(step.key)}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default FormSteps;
