import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Divider,
  useTheme,
  Alert,
  Skeleton,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  PriorityHigh as PriorityIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useTicket } from "~/api/ticketing.api";
import { useReplyMessageValidation } from "~/validation/hooks/useTicketingValidation";
import type {
  ITicket,
  ITicketMessage,
} from "~/types/interfaces/ticketing.interface";
import { TicketPriority } from "~/types/dtos/ticketing.dto";
import { TicketStatus } from "~/types/interfaces/ticketing.interface";
import TicketMessage from "./TicketMessage";
import TicketFileUpload from "./TicketFileUpload";

interface TicketChatProps {
  ticketId: number;
  onClose: () => void;
}
const TicketChat: React.FC<TicketChatProps> = ({ ticketId, onClose }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [messages, setMessages] = useState<ITicketMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const ticketMutation = useTicket();
  const replyForm = useReplyMessageValidation();

  // Debug log
  console.log('TicketChat rendered with ticketId:', ticketId);

  // Load ticket data
  useEffect(() => {
    console.log('useEffect triggered with ticketId:', ticketId);
    if (ticketId) {
      loadTicket();
    } else {
      console.log('No ticketId provided, not loading ticket');
    }
  }, [ticketId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTicket = async () => {
    setLoading(true);
    try {
      const response = await ticketMutation.mutateAsync({
        ticket_id: ticketId,
      });
      console.log('Full ticket response:', JSON.stringify(response, null, 2));
      
      // تلاش برای پیدا کردن ticket data در ساختارهای مختلف
      let ticketData: any = null;
      
      if (response?.data?.list) {
        // ساختار: { data: { list: ITicket } }
        ticketData = response.data.list;
        console.log('Found ticket in response.data.list');
      } else if ((response as any)?.list) {
        // ساختار: { list: ITicket }
        ticketData = (response as any).list;
        console.log('Found ticket in response.list');
      } else if (response?.data && (response.data as any).id) {
        // ساختار: { data: ITicket }
        ticketData = response.data;
        console.log('Found ticket in response.data');
      } else if ((response as any)?.id) {
        // ساختار مستقیم: ITicket
        ticketData = response;
        console.log('Found ticket in response');
      }
      
      if (ticketData && ticketData.id) {
        console.log('Setting ticket data:', ticketData);
        setTicket(ticketData as ITicket);
        
        // پردازش messages
        if (ticketData.messages) {
          const messagesList = Array.isArray(ticketData.messages)
            ? ticketData.messages
            : [ticketData.messages];
          console.log('Setting messages:', messagesList);
          setMessages(messagesList);
        } else {
          console.log('No messages found');
          setMessages([]);
        }
      } else {
        console.error('Could not find valid ticket data in response:', response);
      }
    } catch (error) {
      console.error("Error loading ticket:", error);
      enqueueSnackbar("خطا در بارگذاری تیکت", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case "0":
      case "HIGH":
        return "بالا";
      case "1":
      case "MEDIUM":
        return "متوسط";
      case "2":
      case "LOW":
        return "پایین";
      default:
        return priority || "نامشخص";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "0":
      case "HIGH":
        return theme.palette.error.main;
      case "1":
      case "MEDIUM":
        return theme.palette.warning.main;
      case "2":
      case "LOW":
        return theme.palette.success.main;
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

  const handleSendMessage = async () => {
    if (!replyForm.isFormValid) return;

    try {
      // Here you would send the reply message
      const messageData = replyForm.getValues();
      console.log("Sending message:", messageData);

      // Reset form after successful send
      replyForm.reset();
      setShowFileUpload(false);

      enqueueSnackbar("پیام با موفقیت ارسال شد", { variant: "success" });

      // Reload ticket to get new messages
      loadTicket();
    } catch (error) {
      console.error("Error sending message:", error);
      enqueueSnackbar("خطا در ارسال پیام", { variant: "error" });
    }
  };

  const handleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, height: "100%" }}>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Box sx={{ mt: 2 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width="70%" height={60} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          {loading ? "در حال بارگذاری..." : "تیکتی انتخاب نشده است"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? "لطفاً صبر کنید..." : "یک تیکت از لیست انتخاب کنید یا تیکت جدید ایجاد کنید"}
        </Typography>
        {ticketId && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Ticket ID: {ticketId}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
              {ticket.subject}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              <Chip
                icon={<PriorityIcon />}
                label={getPriorityText(ticket.priority)}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(ticket.priority),
                  color: "white",
                }}
              />

              <Chip
                label={getStatusText(ticket.status)}
                size="small"
                color={
                  ticket.status === TicketStatus.OPEN ? "success" : "default"
                }
                variant="outlined"
              />

              <Chip
                icon={<BusinessIcon />}
                label={ticket.department?.name || "نامشخص"}
                size="small"
                variant="outlined"
              />

              <Chip
                icon={<ScheduleIcon />}
                label={new Date(ticket.created_at).toLocaleDateString("fa-IR")}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          backgroundColor: theme.palette.grey[50],
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              هنوز پیامی در این تیکت وجود ندارد
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message, index) => (
              <TicketMessage
                key={message.id}
                message={message}
                isLastMessage={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Message Input */}
      {ticket.status === TicketStatus.OPEN && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* File Upload */}
          {showFileUpload && (
            <Box sx={{ mb: 2 }}>
              <TicketFileUpload
                files={(replyForm.watch("files") || []).filter(
                  (file): file is File => file !== undefined
                )}
                onFilesChange={(files) => replyForm.setValue("files", files)}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              placeholder="پیام خود را بنویسید..."
              value={replyForm.watch("message") || ""}
              onChange={(e) => replyForm.setValue("message", e.target.value)}
              error={!!replyForm.formState.errors.message}
              helperText={replyForm.formState.errors.message?.message}
              sx={{ flex: 1 }}
            />

            <IconButton
              onClick={handleFileUpload}
              color={showFileUpload ? "primary" : "default"}
            >
              <AttachFileIcon />
            </IconButton>

            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={
                !replyForm.isFormValid || replyForm.formState.isSubmitting
              }
              startIcon={<SendIcon />}
            >
              ارسال
            </Button>
          </Box>
        </Paper>
      )}

      {ticket.status === TicketStatus.CLOSE && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 0,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <Alert severity="info">
            این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد.
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default TicketChat;
