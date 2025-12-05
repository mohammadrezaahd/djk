import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  useTheme,
  Collapse,
  Alert,
} from "@mui/material";

import {
  AddIcon,
  SearchIcon,
  RefreshIcon,
  FilterIcon,
  ExpandIcon,
  CompressIcon,
} from "../icons/IconComponents";

import { useSnackbar } from "notistack";
import { useTickets, useDepartments } from "~/api/ticketing.api";
import { useTicketFiltersValidation } from "~/validation/hooks/useTicketingValidation";
import type {
  ITicketsList,
  IDepartments,
} from "~/types/interfaces/ticketing.interface";
import { TicketStatus } from "~/types/interfaces/ticketing.interface";
import TicketsList from "./TicketsList";

interface TicketingSidebarProps {
  selectedTicketId?: number;
  onTicketSelect: (ticketId: number) => void;
  onNewTicketClick: () => void;
  width?: number;
  refreshTrigger?: number;
}

const TicketingSidebar: React.FC<TicketingSidebarProps> = ({
  selectedTicketId,
  onTicketSelect,
  onNewTicketClick,
  width = 400,
  refreshTrigger = 0,
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [tickets, setTickets] = useState<ITicketsList[]>([]);
  const [departments, setDepartments] = useState<IDepartments[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { watch, setValue, reset } = useTicketFiltersValidation();
  const searchValue = watch("search");
  const statusFilter = watch("status_filter");
  const departmentFilter = watch("department_id");

  const ticketsMutation = useTickets();
  const departmentsMutation = useDepartments();

  // Load initial data
  useEffect(() => {
    loadTickets();
    loadDepartments();
  }, []);

  // Reload tickets when refreshTrigger changes (new ticket created)
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadTickets();
    }
  }, [refreshTrigger]);

  // Auto search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTickets();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, statusFilter, departmentFilter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchValue || "",
        status_filter: statusFilter || undefined,
        department_id: departmentFilter || undefined,
      };

      const response = await ticketsMutation.mutateAsync(filters);
      if (response?.data?.list) {
        setTickets(response.data.list);
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
      enqueueSnackbar("خطا در بارگذاری تیکت‌ها", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await departmentsMutation.mutateAsync();
      if (response?.data?.list) {
        setDepartments(response.data.list);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const handleRefresh = () => {
    loadTickets();
  };

  const handleClearFilters = () => {
    reset();
    setFiltersOpen(false);
  };

  return (
    <Paper
      // elevation={1}
      sx={{
        width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            پشتیبانی
          </Typography>
          <IconButton size="small" onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewTicketClick}
          sx={{ mb: 2 }}
        >
          تیکت جدید
        </Button>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="جستجو در تیکت‌ها..."
          value={searchValue || ""}
          onChange={(e) => setValue("search", e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon style={{ color: "text.secondary", marginRight: 1 }} />
            ),
          }}
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Filters Toggle */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setFiltersOpen(!filtersOpen)}
          endIcon={filtersOpen ? <CompressIcon /> : <ExpandIcon />}
          startIcon={<FilterIcon />}
          size="small"
        >
          فیلترها
        </Button>

        {/* Filters */}
        <Collapse in={filtersOpen}>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>وضعیت</InputLabel>
              <Select
                value={statusFilter || ""}
                onChange={(e) => setValue("status_filter", e.target.value)}
                label="وضعیت"
              >
                <MenuItem value="">همه</MenuItem>
                <MenuItem value={TicketStatus.OPEN}>باز</MenuItem>
                <MenuItem value={TicketStatus.CLOSE}>بسته</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>دپارتمان</InputLabel>
              <Select
                value={departmentFilter || ""}
                onChange={(e) =>
                  setValue("department_id", Number(e.target.value))
                }
                label="دپارتمان"
              >
                <MenuItem value="">همه</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={handleClearFilters}
              size="small"
              color="secondary"
            >
              پاک کردن فیلترها
            </Button>
          </Box>
        </Collapse>
      </Box>

      {/* Tickets List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {ticketsMutation.error && (
          <Alert severity="error" sx={{ m: 2 }}>
            خطا در بارگذاری تیکت‌ها
          </Alert>
        )}

        <TicketsList
          tickets={tickets}
          selectedTicketId={selectedTicketId}
          onTicketSelect={onTicketSelect}
          loading={loading}
        />
      </Box>
    </Paper>
  );
};

export default TicketingSidebar;
