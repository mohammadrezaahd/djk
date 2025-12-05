import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import { SearchIcon } from "../icons/IconComponents";

import type { IMediaQueryParams } from "~/types";

const MEDIA_FILTER_TYPES = [
  {
    value: "packaging",
    label: "عکس بسته‌بندی",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  {
    value: "product",
    label: "عکس محصول",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
  {
    value: "none",
    label: "همه",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  },
];

interface MediaFiltersProps {
  filters: IMediaQueryParams;
  onFiltersChange: (filters: IMediaQueryParams) => void;
  totalItems?: number;
}

const MediaFilters: React.FC<MediaFiltersProps> = ({
  filters,
  onFiltersChange,
  totalItems = 0,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value,
      page: 1, // Reset to first page when searching
    });
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    onFiltersChange({
      ...filters,
      type: event.target.value as "packaging" | "product" | "none",
      page: 1, // Reset to first page when filtering
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        {/* Search */}
        <TextField
          placeholder="جستجوی فایل‌ها..."
          value={filters.search || ""}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Type Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>نوع فایل</InputLabel>
          <Select
            value={filters.type || "none"}
            onChange={handleTypeChange}
            label="نوع فایل"
            MenuProps={{
              disablePortal: true,
              PaperProps: {
                sx: {
                  borderRadius: 2,
                  mt: 1,
                  maxHeight: 240,
                  overflow: "auto",
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
            {MEDIA_FILTER_TYPES.map((filterType) => (
              <MenuItem key={filterType.value} value={filterType.value}>
                {filterType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Results count */}
        <Chip label={`${totalItems} آیتم`} variant="outlined" size="small" />
      </Box>

      {/* Active filters */}
      {(filters.search || (filters.type && filters.type !== "none")) && (
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {filters.search && (
            <Chip
              label={`جستجو: "${filters.search}"`}
              onDelete={() =>
                onFiltersChange({ ...filters, search: "", page: 1 })
              }
              size="small"
              variant="outlined"
            />
          )}
          {filters.type && filters.type !== "none" && (
            <Chip
              label={`نوع: ${
                MEDIA_FILTER_TYPES.find((ft) => ft.value === filters.type)
                  ?.label
              }`}
              onDelete={() =>
                onFiltersChange({ ...filters, type: "none", page: 1 })
              }
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MediaFilters;
