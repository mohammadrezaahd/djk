import React from "react";
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import type { ITemplateList } from "~/types/interfaces/templates.interface";

interface TemplateSelectionProps {
  title: string;
  availableTemplates: ITemplateList[];
  selectedTemplateIds: number[];
  onTemplateToggle: (template: ITemplateList) => void;
  onNext: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  title,
  availableTemplates,
  selectedTemplateIds,
  onTemplateToggle,
  onNext,
  onBack,
  isLoading = false,
}) => {
  const isTemplateSelected = (templateId: number) => {
    return selectedTemplateIds.includes(templateId);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        قالب‌هایی که می‌خواهید استفاده کنید را انتخاب کنید.
      </Typography>

      {availableTemplates.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {isLoading ? "در حال بارگذاری..." : "هیچ قالبی یافت نشد"}
          </Typography>
          {!isLoading && (
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              {onBack && (
                <Button
                  variant="outlined"
                  onClick={onBack}
                  sx={{ minWidth: 120 }}
                >
                  مرحله قبل
                </Button>
              )}
              <Button
                variant="contained"
                onClick={onNext}
                sx={{ minWidth: 120, ml: onBack ? 0 : "auto" }}
              >
                ادامه
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`${selectedTemplateIds.length} قالب انتخاب شده`}
              color={selectedTemplateIds.length > 0 ? "primary" : "default"}
              variant="outlined"
            />
          </Box>

          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {availableTemplates.map((template, index) => (
              <React.Fragment key={template.id}>
                <ListItem
                  onClick={() => onTemplateToggle(template)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isTemplateSelected(template.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={template.title}
                    secondary={`شناسه: ${template.id} | منبع: ${template.source}`}
                  />
                </ListItem>
                {index < availableTemplates.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {onBack && (
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{ minWidth: 120 }}
              >
                مرحله قبل
              </Button>
            )}
            <Button
              variant="contained"
              onClick={onNext}
              sx={{ minWidth: 120, ml: onBack ? 0 : "auto" }}
            >
              ادامه
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default TemplateSelection;