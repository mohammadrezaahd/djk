import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
}

const ActionButtons = ({
  activeTab,
  onSubmit,
  onReset,
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
          >
            {activeTab === 0 ? "ذخیره قالب ویژگی‌ها" : "ذخیره قالب اطلاعات"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={onReset}
          >
            انصراف از افزودن
          </Button>
        </Box>
      </SectionCard>
    </Grid>
  );
};

export default ActionButtons;
