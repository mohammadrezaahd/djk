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
  StepIcon,
  stepIconClasses,
} from "@mui/material";
import {
  CircleCheckIcon,
  ErrorIcon,
  RadioButtonIcon,
} from "../icons/IconComponents";
import { FormStep } from "~/store/slices/productSlice";

interface FormStepsProps {
  currentStep: FormStep;
  stepValidationErrors: {
    [FormStep.DETAILS_FORM]: boolean;
    [FormStep.ATTRIBUTES_FORM]: boolean;
    [FormStep.IMAGE_SELECTION]: boolean;
    [FormStep.PRODUCT_INFO]: boolean;
  };
}

// ✅ کانکتور دقیق و سازگار با RTL و وسط‌چین دایره
const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    // مقدار top رو طوری می‌ذاریم که خط از مرکز آیکون عبور کنه
    top: 10, // برای آیکون‌های کوچکتر در موبایل
    left: theme.direction === "rtl" ? "calc(50% + 8px)" : "calc(-50% + 8px)",
    right: theme.direction === "rtl" ? "calc(-50% + 8px)" : "calc(50% + 8px)",
    [theme.breakpoints.up("sm")]: {
      top: 12,
    },
    [theme.breakpoints.up("md")]: {
      top: 14,
    },
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

// Custom Step Icon Component
const CustomStepIcon = styled(StepIcon)(({ theme }) => ({
  [`&.${stepIconClasses.root}`]: {
    color: theme.palette.grey[400],
    width: 28,
    height: 28,
  },
  [`&.${stepIconClasses.active}`]: {
    color: theme.palette.primary.main,
  },
  [`&.${stepIconClasses.completed}`]: {
    color: theme.palette.success.main,
  },
  [`&.error`]: {
    color: theme.palette.error.main,
  },
}));

const StepIconComponent = (props: any) => {
  const { active, completed, icon, hasError, hasBeenVisited } = props;

  const iconSize = { xs: 20, sm: 24, md: 28 };

  if (completed && !hasError) {
    return <CircleCheckIcon style={{ color: "success.main" }} />;
  }

  if (hasBeenVisited && hasError) {
    return <ErrorIcon style={{ color: "error.main" }} />;
  }

  if (active) {
    return <RadioButtonIcon style={{ color: "primary.main" }} />;
  }

  return <RadioButtonIcon style={{ color: "grey.400" }} />;
};

const FormSteps: React.FC<FormStepsProps> = ({
  currentStep,
  stepValidationErrors,
}) => {
  const theme = useTheme();

  const steps = [
    { key: FormStep.CATEGORY_SELECTION, label: "انتخاب دسته‌بندی" },
    { key: FormStep.DETAILS_SELECTION, label: "انتخاب قالب‌های اطلاعات" },
    { key: FormStep.DETAILS_FORM, label: "تکمیل فرم‌های اطلاعات" },
    { key: FormStep.ATTRIBUTES_SELECTION, label: "انتخاب قالب‌های ویژگی" },
    { key: FormStep.ATTRIBUTES_FORM, label: "تکمیل فرم‌های ویژگی" },
    { key: FormStep.IMAGE_SELECTION, label: "انتخاب تصاویر" },
    { key: FormStep.PRODUCT_INFO, label: "اطلاعات محصول" },
  ];

  const getActiveStep = () => {
    const idx = steps.findIndex((step) => step.key === currentStep);
    return Math.max(0, idx);
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep);
  };

  // Check if a step has been visited (user has passed through it)
  const hasStepBeenVisited = (stepKey: FormStep) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex((step) => step.key === stepKey);
    return stepIndex < currentIndex;
  };

  // Check if a step has validation errors
  const hasStepError = (stepKey: FormStep) => {
    return (
      stepValidationErrors[stepKey as keyof typeof stepValidationErrors] ||
      false
    );
  };

  return (
    <Box sx={{ width: "100%", mb: 4, direction: "rtl", overflowX: "auto" }}>
      <Stepper
        activeStep={getActiveStep()}
        alternativeLabel
        connector={<Connector />}
        sx={{
          direction: "rtl",
          minWidth: { xs: "max-content", md: "100%" },
          px: { xs: 1, sm: 2 },
          "& .MuiStepLabel-label": {
            fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
            fontWeight: 500,
            whiteSpace: { xs: "normal", md: "nowrap" },
            textAlign: "center",
            maxWidth: { xs: "80px", sm: "100px", md: "none" },
            lineHeight: 1.2,
            mt: 0.5,
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: theme.palette.primary.main,
            fontWeight: 700,
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: theme.palette.success.main,
            fontWeight: 500,
          },
          "& .MuiStepLabel-label.Mui-error": {
            color: theme.palette.error.main,
            fontWeight: 500,
          },
          "& .MuiStep-root": {
            px: { xs: 0.5, sm: 1, md: 2 },
          },
        }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < getCurrentStepIndex();
          const isActive = step.key === currentStep;
          const hasError = hasStepError(step.key);
          const hasBeenVisited = hasStepBeenVisited(step.key);

          return (
            <Step key={String(step.key)} completed={isCompleted}>
              <StepLabel
                StepIconComponent={(iconProps) => (
                  <StepIconComponent
                    {...iconProps}
                    hasError={hasError}
                    hasBeenVisited={hasBeenVisited}
                  />
                )}
                sx={{
                  "& .MuiStepLabel-label": {
                    color:
                      hasBeenVisited && hasError
                        ? theme.palette.error.main + " !important"
                        : isActive
                          ? theme.palette.primary.main
                          : isCompleted
                            ? theme.palette.success.main
                            : theme.palette.text.secondary,
                    fontWeight:
                      hasBeenVisited && hasError
                        ? 600
                        : isActive
                          ? 700
                          : isCompleted
                            ? 500
                            : 400,
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color:
                      isActive && hasError && hasBeenVisited
                        ? theme.palette.error.main + " !important"
                        : theme.palette.primary.main + " !important",
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color:
                      hasError && hasBeenVisited
                        ? theme.palette.error.main + " !important"
                        : theme.palette.success.main + " !important",
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default FormSteps;
