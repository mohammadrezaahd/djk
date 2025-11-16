import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import type { IMediaQueryParams } from "../../types";
import { MediaType } from "./FileUpload";

interface MediaFiltersProps {
  filters: IMediaQueryParams;
  onFilterChange: (filters: IMediaQueryParams) => void;
}

const MediaFilters: React.FC<MediaFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    onFilterChange({ ...filters, [e.target.name as string]: e.target.value });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="جستجو"
            name="search"
            value={filters.search || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>نوع رسانه</InputLabel>
            <Select
              name="type"
              value={filters.type || ""}
              onChange={handleChange}
              label="نوع رسانه"
            >
              <MenuItem value="">
                <em>همه</em>
              </MenuItem>
              {Object.values(MediaType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MediaFilters;