import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import React from "react";

const SectionCard = ({ title, children, ...props }: any) => (
  <Card sx={{ p: 2, ...props.sx }} {...props}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

interface ActionButtonsProps {
  activeTab: number;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
  isFormValid?: boolean;
  isEditMode?: boolean;
}

const ActionButtons = ({
  activeTab,
  onSubmit,
  onReset,
  loading = false,
  isFormValid = false,
  isEditMode = false,
}: ActionButtonsProps) => {
  return (
    <Grid size={{ xs: 12 }}>
      <SectionCard>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            size="large"
            disabled={loading || !isFormValid}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
            sx={{
              opacity: !isFormValid ? 0.6 : 1,
            }}
          >
            {loading 
              ? (activeTab === 0 ? (isEditMode ? "در حال ویرایش ویژگی‌ها..." : "در حال ذخیره ویژگی‌ها...") : (isEditMode ? "در حال ویرایش اطلاعات..." : "در حال ذخیره اطلاعات..."))
              : (activeTab === 0 ? (isEditMode ? "ویرایش قالب ویژگی‌ها" : "ذخیره قالب ویژگی‌ها") : (isEditMode ? "ویرایش قالب اطلاعات" : "ذخیره قالب اطلاعات"))
            }
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={onReset}
            disabled={loading}
          >
            {isEditMode ? "انصراف از ویرایش" : "انصراف از افزودن"}
          </Button>
        </Box>
      </SectionCard>
    </Grid>
  );
};

export default ActionButtons;
