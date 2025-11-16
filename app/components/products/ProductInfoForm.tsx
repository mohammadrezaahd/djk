import React from "react";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import type { ICategoryAttr } from "../../types/interfaces/attributes.interface";
import type { ICategoryDetails } from "../../types/interfaces/details.interface";
import DynamicTitleBuilder from "./DynamicTitleBuilder";

interface ProductInfoFormProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  hasValidationErrors: boolean;
  isSubmitting: boolean;
  stepValidationErrors: Record<string, boolean>;
  attributesData: ICategoryAttr[];
  detailsData: ICategoryDetails[];
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onBack,
  hasValidationErrors,
  isSubmitting,
  stepValidationErrors,
  attributesData,
  detailsData,
}) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          اطلاعات نهایی محصول
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DynamicTitleBuilder
              value={title}
              onChange={onTitleChange}
              attributesData={attributesData}
              detailsData={detailsData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="توضیحات محصول"
              multiline
              rows={4}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </Grid>
          <Grid container justifyContent="space-between" sx={{ mt: 3, px: 2 }}>
            <Button variant="outlined" onClick={onBack}>
              مرحله قبل
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={isSubmitting || hasValidationErrors}
            >
              {isSubmitting ? "در حال ایجاد..." : "ایجاد محصول"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductInfoForm;