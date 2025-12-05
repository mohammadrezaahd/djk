import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  Badge,
  Divider,
  useTheme,
  Skeleton,
} from "@mui/material";

import {
  ExclamationIcon,
  RemoveIcon,
  AngleDown,
} from "../icons/IconComponents";

import type { ITicketsList } from "~/types/interfaces/ticketing.interface";
import { TicketPriority } from "~/types/dtos/ticketing.dto";
import { TicketStatus } from "~/types/interfaces/ticketing.interface";

interface TicketsListProps {
  tickets: ITicketsList[];
  selectedTicketId?: number;
  onTicketSelect: (ticketId: number) => void;
  loading?: boolean;
}

const TicketsList: React.FC<TicketsListProps> = ({
  tickets,
  selectedTicketId,
  onTicketSelect,
  loading = false,
}) => {
  const theme = useTheme();

  const getPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.HIGH:
        return (
          <ExclamationIcon
            style={{ fontSize: 16, color: theme.palette.error.main }}
          />
        );
      case TicketPriority.MEDIUM:
        return (
          <RemoveIcon
            style={{ fontSize: 16, color: theme.palette.warning.main }}
          />
        );
      case TicketPriority.LOW:
        return (
          <AngleDown
            style={{ fontSize: 16, color: theme.palette.success.main }}
          />
        );
      default:
        return null;
    }
  };

  const getPriorityText = (priority: TicketPriority): string => {
    switch (priority) {
      case TicketPriority.HIGH:
        return "بالا";
      case TicketPriority.MEDIUM:
        return "متوسط";
      case TicketPriority.LOW:
        return "پایین";
      default:
        return "نامشخص";
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return theme.palette.grey[500];
      case TicketStatus.CLOSE:
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusText = (status: TicketStatus): string => {
    switch (status) {
      case TicketStatus.OPEN:
        return "باز";
      case TicketStatus.CLOSE:
        return "بسته";
      default:
        return "نامشخص";
    }
  };

  if (loading) {
    return (
      <Box>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} sx={{ p: 2 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Skeleton variant="rectangular" width={60} height={20} />
              <Skeleton variant="rectangular" width={40} height={20} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (tickets.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="h6">تیکتی موجود نیست</Typography>
        <Typography variant="body2">
          تیکت جدیدی ایجاد کنید تا بتوانید با پشتیبانی در ارتباط باشید
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {tickets.map((ticket, index) => (
        <React.Fragment key={ticket.id}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => onTicketSelect(ticket.id)}
              selected={selectedTicketId === ticket.id}
              sx={{
                p: 2,
                backgroundColor:
                  selectedTicketId === ticket.id
                    ? theme.palette.action.selected
                    : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      noWrap
                      sx={{
                        flex: 1,
                        fontWeight:
                          selectedTicketId === ticket.id ? "bold" : "normal",
                      }}
                    >
                      {ticket.subject}
                    </Typography>
                    <Badge
                      variant="dot"
                      invisible={false}
                      color={
                        ticket.status === TicketStatus.OPEN
                          ? "success"
                          : "error"
                      }
                      sx={{
                        "& .MuiBadge-dot": {
                          backgroundColor:
                            ticket.status === TicketStatus.OPEN
                              ? "#4caf50"
                              : "#f44336",
                          width: 8,
                          height: 8,
                        },
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Chip
                      icon={getPriorityIcon(ticket.priority) || undefined}
                      label={getPriorityText(ticket.priority)}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.75rem",
                        height: 26,
                        borderRadius: 1.5,
                        backgroundColor: "rgba(102, 126, 234, 0.08)",
                        borderColor: "primary.light",
                        color: "primary.dark",
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                    <Chip
                      label={getStatusText(ticket.status)}
                      size="small"
                      sx={{
                        backgroundColor:
                          ticket.status === TicketStatus.OPEN
                            ? "#4caf50" // سبز برای باز
                            : "#f44336", // قرمز برای بسته
                        color: "white",
                        fontSize: "0.75rem",
                        height: 26,
                        borderRadius: 1.5,
                        fontWeight: 600,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
          {index < tickets.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default TicketsList;
