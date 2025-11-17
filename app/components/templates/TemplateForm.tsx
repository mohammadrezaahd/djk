import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useState } from "react";
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";

interface TemplateFormProps {
  isValidationEnabled?: boolean;
  onValidationChange: (isValid: boolean) => void;
  isLoading: boolean;
  onTabChange: (tabIndex: number) => void;
}

const TemplateForm = ({
  isValidationEnabled = false,
  onValidationChange,
  isLoading,
  onTabChange,
}: TemplateFormProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isDetailsValid, setIsDetailsValid] = useState(false);
  const [isAttributesValid, setIsAttributesValid] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    onTabChange(newValue); // Notify the parent of the tab change
    // Notify the parent about the validity of the new tab
    onValidationChange(newValue === 0 ? isDetailsValid : isAttributesValid);
  };

  const handleDetailsValidationChange = (isValid: boolean) => {
    setIsDetailsValid(isValid);
    if (activeTab === 0) {
      onValidationChange(isValid);
    }
  };

  const handleAttributesValidationChange = (isValid: boolean) => {
    setIsAttributesValid(isValid);
    if (activeTab === 1) {
      onValidationChange(isValid);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="product template tabs"
          >
            <Tab label="Information" />
            <Tab label="Attributes" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {activeTab === 0 && (
              <DetailsTab
                onValidationChange={handleDetailsValidationChange}
                isLoading={isLoading}
                isValidationEnabled={isValidationEnabled}
              />
            )}
            {activeTab === 1 && (
              <AttributesTab
                onValidationChange={handleAttributesValidationChange}
                isLoading={isLoading}
                isValidationEnabled={isValidationEnabled}
              />
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TemplateForm;
