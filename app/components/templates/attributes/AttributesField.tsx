import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";
import type {
  IAttr,
  ISelectOption,
} from "../../../types/interfaces/attributes.interface";

interface AttributesFieldProps {
  attribute: IAttr;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AttributesField: React.FC<AttributesFieldProps> = ({
  attribute,
  value,
  onChange,
  error,
}) => {
  const renderField = () => {
    switch (attribute.type) {
      case "input":
        return (
          <TextField
            fullWidth
            label={attribute.label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            required={attribute.required}
          />
        );
      case "text":
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={attribute.label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            required={attribute.required}
          />
        );
      case "select":
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel>{attribute.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={attribute.required}
            >
              {Object.entries(attribute.values).map(([id, option]) => (
                <MenuItem key={id} value={id}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );
      case "checkbox":
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel>{attribute.label}</InputLabel>
            <Select
              multiple
              value={selectedValues}
              onChange={(e) => onChange(e.target.value)}
              input={<OutlinedInput label={attribute.label} />}
              renderValue={(selected) =>
                (selected as string[])
                  .map(
                    (id) =>
                      (attribute.values as Record<string, ISelectOption>)[id]
                        ?.value
                  )
                  .join(", ")
              }
              MenuProps={MenuProps}
              required={attribute.required && selectedValues.length === 0}
            >
              {Object.entries(attribute.values).map(([id, option]) => (
                <MenuItem key={id} value={id}>
                  <Checkbox checked={selectedValues.indexOf(id) > -1} />
                  <ListItemText primary={option.value} />
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );
      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                name={attribute.label}
              />
            }
            label={attribute.label}
          />
        );

      default:
        return null;
    }
  };

  return <>{renderField()}</>;
};

export default AttributesField;