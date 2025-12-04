import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface PageSizeSelectorProps {
  value: number;
  onChange: (event: SelectChangeEvent<number>) => void;
  options?: number[];
  label?: string;
  size?: "small" | "medium";
  disabled?: boolean;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  value,
  onChange,
  options = [5, 10, 20, 50],
  label = "تعداد نمایش",
  size = "small",
  disabled = false,
}) => {
  return (
    <FormControl size={size} sx={{ minWidth: 120 }} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        MenuProps={{
          disablePortal: false,
          PaperProps: {
            sx: {
              borderRadius: 2,
              mt: 1,
              maxHeight: 240,
              overflow: "auto",
              zIndex: 9999,
            },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          slotProps: {
            backdrop: {
              sx: {
                backgroundColor: "transparent",
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PageSizeSelector;
