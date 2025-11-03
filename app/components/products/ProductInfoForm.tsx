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

interface ProductInfoFormProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = "عنوان محصول الزامی است";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        اطلاعات محصول
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        اطلاعات نهایی محصول را وارد کنید.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="عنوان محصول"
          value={title}
          onChange={(e) => {
            onTitleChange(e.target.value);
            if (errors.title && e.target.value.trim()) {
              setErrors({ ...errors, title: undefined });
            }
          }}
          fullWidth
          required
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2 }}
        />

        <TextField
          label="توضیحات محصول"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          fullWidth
          multiline
          rows={4}
          placeholder="توضیحات اختیاری در مورد محصول..."
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          پس از کلیک روی "ایجاد محصول"، اطلاعات نهایی محصول در کنسول نمایش داده خواهد شد.
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
          disabled={isSubmitting}
          sx={{ minWidth: 120 }}
        >
          {isSubmitting ? "در حال ایجاد..." : "ایجاد محصول"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductInfoForm;