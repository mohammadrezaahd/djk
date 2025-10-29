import React from "react";
import {
  TextField,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import type { IAttr } from "~/types/interfaces/attributes.interface";

interface AttributesFieldProps {
  attr: IAttr;
}

const AttributesField: React.FC<AttributesFieldProps> = ({ attr }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldName = attr.id.toString();

  const renderField = (field: any) => {
    switch (attr.element_type) {
      case "text":
      case "number":
        return (
          <TextField
            {...field}
            fullWidth
            label={attr.title}
            placeholder={attr.placeholder || ""}
            type={attr.element_type}
            error={!!errors[fieldName]}
            helperText={errors[fieldName]?.message}
          />
        );
      case "select":
        return (
          <Autocomplete
            {...field}
            multiple={attr.max_selection > 1}
            options={attr.options.map((opt) => opt.id.toString())}
            getOptionLabel={(option) =>
              attr.options.find((opt) => opt.id.toString() === option)
                ?.option || ""
            }
            onChange={(_, value) => field.onChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={attr.title}
                placeholder={attr.placeholder || ""}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message}
              />
            )}
          />
        );
      case "radio":
        return (
          <FormControl component="fieldset" error={!!errors[fieldName]}>
            <FormLabel component="legend">{attr.title}</FormLabel>
            <RadioGroup {...field}>
              {attr.options.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  value={opt.id.toString()}
                  control={<Radio />}
                  label={opt.option}
                />
              ))}
            </RadioGroup>
            {errors[fieldName] && (
              <FormHelperText>{errors[fieldName].message}</FormHelperText>
            )}
          </FormControl>
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={<Checkbox {...field} checked={!!field.value} />}
            label={attr.title}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={attr.max_selection > 1 ? [] : ""}
      render={({ field }) => renderField(field)}
    />
  );
};

export default AttributesField;
