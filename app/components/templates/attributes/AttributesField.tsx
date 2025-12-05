import {
  TextField,
  Box,
  Autocomplete,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import {
  AttributeType,
  type IAttr,
} from "~/types/interfaces/attributes.interface";
import SuggestedValues from "./SuggestedValues";

import { AiIcon } from "~/components/icons/IconComponents";

// کامپوننت آیکون AI
const AIIcon: React.FC<{ attr: IAttr }> = ({ attr }) => {
  const handleAIClick = () => {
    console.log(`AI clicked for field: ${attr.title} (ID: ${attr.id})`);
    console.log("Field details:", {
      title: attr.title,
      type: attr.type,
      required: attr.required,
      hint: attr.hint,
    });
  };

  return (
    <Tooltip title="کمک هوش مصنوعی" placement="top">
      <IconButton
        onClick={handleAIClick}
        size="small"
        sx={{
          padding: "4px",
          marginLeft: "4px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            transform: "scale(1.05)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
          transition: "all 0.2s ease-in-out",
          width: "24px",
          height: "24px",
        }}
      >
        <AiIcon style={{ fontSize: "16px" }} />
      </IconButton>
    </Tooltip>
  );
};

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
        <Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
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
            {attr.Ai && <AIIcon attr={attr} />}
          </Box>
          <SuggestedValues
            attr={attr}
            currentValue={value}
            onSuggestionClick={(suggestion) => onChange(fieldKey, suggestion)}
          />
        </Box>
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
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                />
                {attr.Ai && <AIIcon attr={attr} />}
              </Box>
              <SuggestedValues
                attr={attr}
                currentValue={value}
                onSuggestionClick={(suggestion) =>
                  onChange(fieldKey, suggestion)
                }
              />
            </Box>
          );
        } else {
          const selectedOptions = options.filter(
            (option) => value?.includes(option.id) || false
          );

          return (
            <Box>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
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
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterSelectedOptions
                  limitTags={3}
                  getLimitTagsText={(more) => `+${more} بیشتر`}
                />
                {attr.Ai && <AIIcon attr={attr} />}
              </Box>
              <SuggestedValues
                attr={attr}
                currentValue={value}
                onSuggestionClick={(suggestion) => {
                  if (typeof suggestion === "function") {
                    const newValue = suggestion(value);
                    onChange(fieldKey, newValue);
                  } else {
                    onChange(fieldKey, suggestion);
                  }
                }}
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
        <Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
            <TextField
              fullWidth
              label={attr.title + (attr.required ? " *" : "")}
              helperText={error || attr.hint}
              value={value || ""}
              onChange={(e) => onChange(fieldKey, e.target.value)}
              required={attr.required}
              error={!!error}
            />
            {attr.Ai && <AIIcon attr={attr} />}
          </Box>
          <SuggestedValues
            attr={attr}
            currentValue={value}
            onSuggestionClick={(suggestion) => onChange(fieldKey, suggestion)}
          />
        </Box>
      );

    case AttributeType.MultiText:
      return (
        <Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
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
            {attr.Ai && <AIIcon attr={attr} />}
          </Box>
          <SuggestedValues
            attr={attr}
            currentValue={value}
            onSuggestionClick={(suggestion) => onChange(fieldKey, suggestion)}
          />
        </Box>
      );

    default:
      return null;
  }
}
