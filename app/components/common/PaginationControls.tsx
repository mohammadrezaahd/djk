import React from "react";
import { Box, Pagination, Typography } from "@mui/material";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  disabled?: boolean;
  showFirstButton?: boolean;
  showLastButton?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  disabled = false,
  showFirstButton = true,
  showLastButton = true,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 3,
        gap: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        disabled={disabled}
      />
    </Box>
  );
};

export default PaginationControls;
