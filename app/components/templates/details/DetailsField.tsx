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
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

interface DetailsFieldProps {
  fieldName: string;
  label: string;
  fieldData?: any[];
  isTextField?: boolean;
  isRadioGroup?: boolean;
  isObjectData?: boolean;
  showBrandLogo?: boolean;
  [key: string]: any;
}

const DetailsField: React.FC<DetailsFieldProps> = ({
  fieldName,
  label,
  fieldData = [],
  isTextField = false,
  isRadioGroup = false,
  isObjectData = false,
  showBrandLogo = false,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const renderField = (field: any) => {
    if (isTextField) {
      return (
        <TextField
          {...field}
          fullWidth
          label={label}
          error={!!errors[fieldName]}
          helperText={errors[fieldName]?.message}
          {...props}
        />
      );
    }

    if (isRadioGroup) {
      return (
        <FormControl component="fieldset" error={!!errors[fieldName]}>
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup {...field}>
            {fieldData.map((item) => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio />}
                label={item.label}
              />
            ))}
          </RadioGroup>
          {errors[fieldName] && (
            <FormHelperText>{errors[fieldName].message}</FormHelperText>
          )}
        </FormControl>
      );
    }

    return (
      <Autocomplete
        {...field}
        options={
          isObjectData
            ? Object.keys(fieldData)
            : fieldData.map((item) => item.id.toString())
        }
        getOptionLabel={(option) =>
          isObjectData
            ? fieldData[option]
            : fieldData.find((item) => item.id.toString() === option)?.title ||
              ""
        }
        onChange={(_, value) => field.onChange(value)}
        renderOption={
          showBrandLogo
            ? (props, option) => {
                const brand = fieldData.find(
                  (item) => item.id.toString() === option
                );
                return (
                  <ListItem {...props}>
                    <ListItemAvatar>
                      <Avatar src={brand?.logo} />
                    </ListItemAvatar>
                    <ListItemText primary={brand?.title} />
                  </ListItem>
                );
              }
            : undefined
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!errors[fieldName]}
            helperText={errors[fieldName]?.message}
            {...props}
          />
        )}
      />
    );
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue=""
      render={({ field }) => renderField(field)}
    />
  );
};

export default DetailsField;
