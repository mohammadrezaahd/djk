import React from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import { CloseIcon } from "../icons/IconComponents";
import type { SelectedTemplate } from "~/store/slices/productSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface TemplateFormsProps {
  title: string;
  selectedTemplates: SelectedTemplate[];
  activeTemplateIndex: number;
  onTabChange: (newIndex: number) => void;
  onRemoveTemplate: (templateId: number) => void;
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
  if (selectedTemplates.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          هیچ قالبی انتخاب نشده است
        </Typography>
        <Button variant="outlined" onClick={onBack} sx={{ mt: 2 }}>
          بازگشت به انتخاب قالب
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          اطلاعات فرم‌های انتخاب شده را تکمیل کنید.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={`${selectedTemplates.length} قالب انتخاب شده`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTemplateIndex}
          onChange={(_, newValue) => onTabChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 48,
            },
          }}
        >
          {selectedTemplates.map((template, index) => (
            <Tab
              key={template.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{template.title}</span>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTemplate(template.id);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon size={"small"} />
                  </IconButton>
                </Box>
              }
              id={`template-tab-${index}`}
              aria-controls={`template-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {selectedTemplates.map((template, index) => (
        <TabPanel key={template.id} value={activeTemplateIndex} index={index}>
          {children}
        </TabPanel>
      ))}

      <Box
        sx={{
          p: 3,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="outlined" onClick={onBack}>
          مرحله قبل
        </Button>
        <Button variant="contained" onClick={onNext}>
          مرحله بعد
        </Button>
      </Box>
    </Paper>
  );
};

export default TemplateForms;
