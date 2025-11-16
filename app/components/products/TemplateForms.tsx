import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SelectedTemplate } from "../../store/slices/productSlice";

interface TemplateFormsProps {
  title: string;
  selectedTemplates: SelectedTemplate[];
  activeTemplateIndex: number;
  onTabChange: (index: number) => void;
  onRemoveTemplate: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

const TemplateForms: React.FC<TemplateFormsProps> = ({
  title,
  selectedTemplates,
  activeTemplateIndex,
  onTabChange,
  onRemoveTemplate,
  onNext,
  onBack,
  children,
}) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTemplateIndex}
            onChange={(e, newValue) => onTabChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {selectedTemplates.map((template) => (
              <Tab
                key={template.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {template.title}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTemplate(template.id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ mt: 3 }}>{children}</Box>
        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            قبلی
          </Button>
          <Button variant="contained" onClick={onNext}>
            بعدی
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TemplateForms;