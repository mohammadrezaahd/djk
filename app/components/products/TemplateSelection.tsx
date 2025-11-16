import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import type { ITemplateList } from "../../types/interfaces/templates.interface";

interface TemplateSelectionProps {
  title: string;
  availableTemplates: ITemplateList[];
  selectedTemplateIds: number[];
  onTemplateToggle: (template: ITemplateList) => void;
  onNext: () => void;
  onBack: () => void;
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
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {availableTemplates.map((template) => (
              <ListItem
                key={template.id}
                button
                onClick={() => onTemplateToggle(template)}
              >
                <Checkbox
                  checked={selectedTemplateIds.includes(template.id)}
                  edge="start"
                />
                <ListItemText primary={template.title} />
              </ListItem>
            ))}
          </List>
        )}
        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            مرحله قبل
          </Button>
          <Button variant="contained" onClick={onNext}>
            {selectedTemplateIds.length > 0 ? "بعدی" : "رد شدن"}
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TemplateSelection;