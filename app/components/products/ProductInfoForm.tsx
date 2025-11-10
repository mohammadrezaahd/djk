import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import DynamicTitleBuilder from "./DynamicTitleBuilder";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";

interface ProductInfoFormProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  hasValidationErrors?: boolean;
  stepValidationErrors?: {
    [key: string]: boolean;
  };
  attributesData?: ICategoryAttr[];
  detailsData?: ICategoryDetails[];
  submitButtonLabel?: string;
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onBack,
  isSubmitting = false,
  hasValidationErrors = false,
  stepValidationErrors = {},
  attributesData = [],
  detailsData = [],
  submitButtonLabel = "ایجاد محصول",
}) => {
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = "عنوان محصول الزامی است";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && !hasValidationErrors) {
      onSubmit();
    }
  };

  // Check if any previous steps have validation errors
  const hasPreviousStepErrors = Object.values(stepValidationErrors).some(hasError => hasError);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        اطلاعات محصول
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        اطلاعات نهایی محصول را وارد کنید.
      </Typography>

      {hasPreviousStepErrors && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            لطفاً ابتدا خطاهای موجود در مراحل قبلی را رفع کنید. مراحل دارای خطا با علامت ضربدر مشخص شده‌اند.
          </Typography>
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <DynamicTitleBuilder
          value={title}
          onChange={(value) => {
            onTitleChange(value);
            if (errors.title && value.trim()) {
              setErrors({ ...errors, title: undefined });
            }
          }}
          attributesData={attributesData}
          detailsData={detailsData}
          label="عنوان محصول"
          placeholder="عنوان محصول را وارد کنید..."
        />
        
        {errors.title && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {errors.title}
          </Alert>
        )}

        <TextField
          label="توضیحات محصول"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          fullWidth
          multiline
          rows={4}
          placeholder="توضیحات اختیاری در مورد محصول..."
          sx={{ mt: 2 }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          پس از کلیک روی "{submitButtonLabel}"، اطلاعات نهایی محصول در کنسول نمایش داده خواهد شد.
        </Typography>
      </Alert>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={isSubmitting}
        >
          مرحله قبل
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || hasPreviousStepErrors || (!!errors.title && !title.trim())}
          sx={{ minWidth: 120 }}
        >
          {isSubmitting ? `در حال ${submitButtonLabel}...` : submitButtonLabel}
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductInfoForm;