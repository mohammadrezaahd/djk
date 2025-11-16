import React from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Grid,
} from "@mui/material";
import {
  IAttr,
  ISelectOption,
} from "../../types/interfaces/attributes.interface";
import type { ICategoryDetails } from "../../types/interfaces/details.interface";

interface DynamicTitleBuilderProps {
  value: string;
  onChange: (value: string) => void;
  attributesData: IAttr[];
  detailsData: ICategoryDetails[];
  label?: string;
  placeholder?: string;
}

const DynamicTitleBuilder: React.FC<DynamicTitleBuilderProps> = ({
  value,
  onChange,
  attributesData,
  detailsData,
  label = "Dynamic Title",
  placeholder = "Enter title",
}) => {
  const handleChipClick = (text: string) => {
    onChange(`${value} ${text}`.trim());
  };

  const getAttributeChips = () => {
    const chips: string[] = [];
    attributesData.forEach((attr) => {
      if (attr.values) {
        Object.values(attr.values).forEach((option: ISelectOption) => {
          if (option.selected) {
            chips.push(option.value);
          }
        });
      }
    });
    return chips;
  };

  const getDetailsChips = () => {
    const chips: string[] = [];
    detailsData.forEach((detail) => {
      if (detail.brand?.selected) chips.push(detail.brand.value);
      // Add other details fields here
    });
    return chips;
  };

  const chips = [...getAttributeChips(), ...getDetailsChips()];

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {chips.map((chip, index) => (
          <Grid item key={index}>
            <Chip
              label={chip}
              onClick={() => handleChipClick(chip)}
              size="small"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DynamicTitleBuilder;