import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface DetailsFieldProps {
  fieldName: string;
  fieldData?: any[] | { [key: string]: any };
  label: string;
  value: any;
  onChange: (fieldName: string, value: any) => void;
  disabled?: boolean;
  showBrandLogo?: boolean;
  isRadioGroup?: boolean;
  isTextField?: boolean;
  isNumberField?: boolean;
  isListField?: boolean;
  isObjectData?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  helperText?: string;
  error?: string;
}
const DetailsField = ({
  fieldName,
  fieldData,
  label,
  value,
  onChange,
  disabled = false,
  showBrandLogo = false,
  isRadioGroup = false,
  isTextField = false,
  isNumberField = false,
  isListField = false,
  isObjectData = false,
  required = false,
  multiline = false,
  rows = 1,
  placeholder = "",
  helperText = "",
  error = "",
}: DetailsFieldProps) => {
  if (isTextField) {
    return (
      <TextField
        fullWidth
        multiline={multiline}
        rows={rows}
        label={label + (required ? " *" : "")}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(fieldName, e.target.value)}
        required={required}
        helperText={error || helperText}
        error={!!error}
      />
    );
  }

  if (isNumberField) {
    return (
      <TextField
        fullWidth
        type="number"
        label={label + (required ? " *" : "")}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(fieldName, parseFloat(e.target.value) || 0)}
        required={required}
        helperText={error || helperText}
        error={!!error}
      />
    );
  }

  if (isListField) {
    const listValue = Array.isArray(value) ? value.join('\n') : value || "";
    return (
      <TextField
        fullWidth
        multiline
        rows={rows || 3}
        label={label + (required ? " *" : "")}
        placeholder={placeholder || "هر آیتم را در یک خط وارد کنید"}
        value={listValue}
        onChange={(e) => {
          const lines = e.target.value.split('\n').map(line => line.trim()).filter(line => line);
          onChange(fieldName, lines);
        }}
        required={required}
        helperText={error || helperText}
        error={!!error}
      />
    );
  }

  if (isRadioGroup && Array.isArray(fieldData)) {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup
          row
          value={value || ""}
          onChange={(e) => onChange(fieldName, e.target.value)}
        >
          {fieldData.map((item, index) => (
            <FormControlLabel
              key={item.value || index}
              value={item.value}
              control={<Radio />}
              label={item.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }

  if (!fieldData) return null;

  let options: Array<{ id: string; label: string; data: any }> = [];

  if (
    isObjectData &&
    typeof fieldData === "object" &&
    !Array.isArray(fieldData)
  ) {
    options = Object.entries(fieldData).map(
      ([key, valueData]: [string, any]) => ({
        id: key,
        label: valueData.text || key,
        data: valueData,
      })
    );
  } else if (Array.isArray(fieldData)) {
    options = fieldData.map((item: any, index: number) => {
      if (fieldName === "fake_reason") {
        return {
          id: item.text || index.toString(), // text همان id است
          label: item.value || `${label} ${index + 1}`, // value همان متن قابل نمایش است
          data: item,
        };
      }

      return {
        id: item.value || item.id || item.text || index.toString(),
        label: item.text || item.title || item.label || `${label} ${index + 1}`,
        data: item,
      };
    });
  }

  if (options.length === 0) return null;

  const selectedOption = options.find((option) => option.id === value) || null;

  const renderBrandOption = (props: any, option: any) => {
    const { key, ...otherProps } = props;
    return (
      <Box
        component="li"
        key={key}
        {...otherProps}
        sx={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          {option.label}
        </Typography>
        {option.data.logo_id && (
          <Box
            component="img"
            src={option.data.logo_id}
            alt={option.label}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              objectFit: "contain",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </Box>
    );
  };

  const renderBrandInput = (params: any) => (
    <TextField
      {...params}
      label={label + (required ? " *" : "")}
      placeholder="انتخاب کنید..."
      required={required}
      helperText={error || helperText}
      error={!!error}
      InputProps={{
        ...params.InputProps,
        endAdornment: selectedOption?.data?.logo_id ? (
          <Box
            component="img"
            src={selectedOption.data.logo_id}
            alt={selectedOption.label}
            sx={{
              width: 24,
              height: 24,
              borderRadius: 0.5,
              objectFit: "contain",
              ml: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        ) : null,
      }}
    />
  );

  return (
    <Autocomplete
      fullWidth
      disabled={disabled}
      options={options}
      getOptionLabel={(option) => option.label}
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(fieldName, newValue?.id || "");
      }}
      renderOption={showBrandLogo ? renderBrandOption : undefined}
      renderInput={
        showBrandLogo
          ? renderBrandInput
          : (params) => (
              <TextField
                {...params}
                label={label + (required ? " *" : "")}
                placeholder="انتخاب کنید..."
                required={required}
                helperText={error || helperText}
                error={!!error}
              />
            )
      }
      noOptionsText="گزینه‌ای یافت نشد"
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
};

export default DetailsField;
