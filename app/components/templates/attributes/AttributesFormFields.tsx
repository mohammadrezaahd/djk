import React from "react";
import { Grid } from "@mui/material";
import AttributesField from "./AttributesField";
import type { ICategoryAttr } from "../../../types/interfaces/attributes.interface";

interface AttributesFormFieldsProps {
  attributesData: ICategoryAttr["category_group_attributes"] | undefined;
  formData: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
  errors: Record<string, string>;
}

const AttributesFormFields: React.FC<AttributesFormFieldsProps> = ({
  attributesData,
  formData,
  onFieldChange,
  errors,
}) => {
  if (!attributesData) {
    return null;
  }

  return (
    <>
      {Object.entries(attributesData).map(([categoryId, categoryData]) => (
        <React.Fragment key={categoryId}>
          {Object.entries(categoryData.attributes).map(([attrId, attr]) => (
            <Grid
              item
              xs={12}
              sm={attr.layout?.grid_columns || 6}
              key={attr.id}
            >
              <AttributesField
                attribute={attr}
                value={formData[attr.id] || ""}
                onChange={(value) => onFieldChange(attr.id.toString(), value)}
                error={errors[attr.id]}
              />
            </Grid>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default AttributesFormFields;