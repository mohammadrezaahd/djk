import { TextField, Box, Autocomplete, Chip } from "@mui/material";
import React from "react";
import {
  AttributeType,
  type IAttr,
} from "~/types/interfaces/attributes.interface";

interface AttributesFieldProps {
  attr: IAttr;
  value: any;
  onChange: (attrId: number | string, value: any) => void;
  error?: string;
}

export default function AttributesField({
  attr,
  value,
  onChange,
  error,
}: AttributesFieldProps) {
  const fieldKey = attr.code || attr.id;

  const isMultiSelect = (attr: IAttr): boolean => {
    return attr.type === AttributeType.Checkbox;
  };

  const shouldUseAutocomplete = (attr: IAttr): boolean => {
    const valuesCount = Object.keys(attr.values).length;
    return (
      (attr.type === AttributeType.Select ||
        attr.type === AttributeType.Checkbox) &&
      valuesCount > 0
    );
  };

  switch (attr.type) {
    case AttributeType.Input:
      return (
        <TextField
          fullWidth
          type="number"
          label={attr.title + (attr.required ? " *" : "")}
          helperText={error || attr.hint}
          value={value || ""}
          onChange={(e) => {
            // Accept only non-negative numbers (>= 0). Keep empty string as empty.
            const inputVal = e.target.value;
            if (inputVal === "") {
              onChange(fieldKey, "");
              return;
            }

            // Parse as float and enforce min 0
            const parsed = parseFloat(inputVal);
            if (isNaN(parsed)) {
              onChange(fieldKey, inputVal);
              return;
            }

            const safe = parsed < 0 ? 0 : parsed;
            onChange(fieldKey, safe);
          }}
          required={attr.required}
          error={!!error}
          InputProps={{
            endAdornment: attr.postfix || attr.unit,
            inputProps: { min: 0 },
          }}
        />
      );

    case AttributeType.Select:
    case AttributeType.Checkbox:
      if (shouldUseAutocomplete(attr)) {
        const options = Object.entries(attr.values).map(
          ([valueId, valueData]) => ({
            id: valueId,
            label: valueData.text,
            value: valueId,
          })
        );

        const isMulti = isMultiSelect(attr);

        if (!isMulti) {
          const selectedOption =
            options.find((option) => option.id === value) || null;

          return (
            <Box>
              <Autocomplete
                fullWidth
                openOnFocus
                options={options}
                getOptionLabel={(option) => option.label}
                value={selectedOption}
                onChange={(_, newValue) => {
                  onChange(fieldKey, newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={attr.title + (attr.required ? " *" : "")}
                    required={attr.required}
                    helperText={error || attr.hint}
                    placeholder="انتخاب کنید..."
                    error={!!error}
                  />
                )}
                noOptionsText="گزینه‌ای یافت نشد"
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
          );
        } else {
          const selectedOptions = options.filter(
            (option) => value?.includes(option.id) || false
          );

          return (
            <Box>
              <Autocomplete
                multiple
                fullWidth
                openOnFocus
                options={options}
                getOptionLabel={(option) => option.label}
                value={selectedOptions}
                onChange={(_, newValues) => {
                  const selectedIds = newValues.map((item) => item.id);
                  onChange(fieldKey, selectedIds);
                }}
                disableCloseOnSelect
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.label}
                      {...getTagProps({ index })}
                      key={option.id}
                      size="small"
                      sx={{ zIndex: "9" }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={attr.title + (attr.required ? " *" : "")}
                    required={attr.required}
                    helperText={error || attr.hint}
                    placeholder="انتخاب کنید..."
                    error={!!error}
                  />
                )}
                noOptionsText="گزینه‌ای یافت نشد"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                filterSelectedOptions
                limitTags={3}
                getLimitTagsText={(more) => `+${more} بیشتر`}
              />
            </Box>
          );
        }
      } else {
        // اگر values خالی است یا شرایط autocomplete برقرار نیست، یک TextField ساده نمایش بده
        return (
          <TextField
            fullWidth
            label={attr.title + (attr.required ? " *" : "")}
            helperText={error || attr.hint || "گزینه‌ای برای انتخاب وجود ندارد"}
            value=""
            disabled
            placeholder="گزینه‌ای موجود نیست"
            error={!!error}
          />
        );
      }

    case AttributeType.Text:
      return (
        <TextField
          fullWidth
          multiline
          rows={3}
          label={attr.title + (attr.required ? " *" : "")}
          helperText={error || attr.hint}
          value={value || ""}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          required={attr.required}
          error={!!error}
        />
      );

    default:
      return null;
  }
}
