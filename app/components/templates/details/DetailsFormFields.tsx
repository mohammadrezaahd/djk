import React from "react";
import { Grid } from "@mui/material";
import DetailsField from "./DetailsField";
import type { ICategoryDetails } from "../../../types/interfaces/details.interface";

interface DetailsFormFieldsProps {
  detailsData: ICategoryDetails | null;
  formData: Record<string, any>;
  onFieldChange: (fieldName: string, value: any) => void;
  errors: Record<string, string>;
}

const DetailsFormFields: React.FC<DetailsFormFieldsProps> = ({
  detailsData,
  formData,
  onFieldChange,
  errors,
}) => {
  if (!detailsData) {
    return null;
  }

  const renderFieldFor = (
    fieldName: keyof ICategoryDetails,
    xs = 12,
    sm = 6
  ) => {
    const fieldData = detailsData[fieldName];
    if (!fieldData) return null;

    return (
      <Grid item xs={xs} sm={sm}>
        <DetailsField
          field={fieldData}
          value={formData[fieldName] || ""}
          onChange={(value) => onFieldChange(fieldName, value)}
          error={errors[fieldName]}
          fieldName={fieldName}
        />
      </Grid>
    );
  };

  const renderTextFieldFor = (
    fieldName: string,
    label: string,
    required: boolean,
    xs = 12,
    sm = 6
  ) => {
    return (
      <Grid item xs={xs} sm={sm}>
        <DetailsField
          field={{
            type: "text",
            label,
            required,
            value: "",
            options: [],
            selected: false,
          }}
          value={formData[fieldName] || ""}
          onChange={(value) => onFieldChange(fieldName, value)}
          error={errors[fieldName]}
          fieldName={fieldName}
        />
      </Grid>
    );
  };

  return (
    <>
      {renderFieldFor("brand")}
      {renderTextFieldFor(
        "brand_model",
        "مدل برند",
        detailsData.bind?.brand_model?.required ?? false
      )}
      {renderFieldFor("status")}
      {renderFieldFor("platform")}
      {renderFieldFor("product_class")}
      {renderFieldFor("category_product_type")}
      {renderFieldFor("theme")}
      {renderTextFieldFor(
        "color_pattern",
        "رنگ/الگو",
        detailsData.bind?.color_pattern?.required ?? false
      )}
      {renderTextFieldFor(
        "warranty",
        "گارانتی",
        detailsData.bind?.warranty?.required ?? false
      )}
      {renderTextFieldFor("size", "سایز", detailsData.bind?.size?.required ?? false)}
      {renderTextFieldFor(
        "weight",
        "وزن",
        detailsData.bind?.weight?.required ?? false
      )}
      {renderTextFieldFor(
        "material",
        "جنس",
        detailsData.bind?.material?.required ?? false
      )}
      {renderTextFieldFor(
        "origin_country",
        "کشور مبدا",
        detailsData.bind?.origin_country?.required ?? false
      )}
      {renderTextFieldFor(
        "manufacturer",
        "سازنده",
        detailsData.bind?.manufacturer?.required ?? false
      )}
      {renderTextFieldFor(
        "model_number",
        "شماره مدل",
        detailsData.bind?.model_number?.required ?? false
      )}
      {renderTextFieldFor(
        "barcode",
        "بارکد",
        detailsData.bind?.barcode?.required ?? false
      )}
      {renderTextFieldFor(
        "package_dimensions",
        "ابعاد بسته",
        detailsData.bind?.package_dimensions?.required ?? false
      )}
      {renderTextFieldFor(
        "special_features",
        "ویژگی‌های خاص",
        detailsData.bind?.special_features?.required ?? false
      )}
      {renderTextFieldFor(
        "care_instructions",
        "دستورالعمل‌های مراقبت",
        detailsData.bind?.care_instructions?.required ?? false
      )}
      {renderFieldFor("is_fake_product")}
      {formData.is_fake_product && renderFieldFor("fake_reason")}
      {renderFieldFor("id_type")}
      {formData.id_type === "general" && renderFieldFor("general_mefa_id")}
      {formData.id_type === "custom" && renderFieldFor("custom_id")}
    </>
  );
};

export default DetailsFormFields;