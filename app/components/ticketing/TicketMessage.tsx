import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Image as ImageIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { useAppSelector } from "~/store/hooks";

import type {
  ITicketMessage,
  IMessageattachment,
} from "~/types/interfaces/ticketing.interface";

interface TicketMessageProps {
  message: ITicketMessage;
  isLastMessage?: boolean;
}

const TicketMessage: React.FC<TicketMessageProps> = ({
  message,
  isLastMessage,
}) => {
  const theme = useTheme();
  const isAdmin = message.is_admin;

  // دریافت اطلاعات کاربر از store
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileDownload = (attachment: IMessageattachment) => {
    // Implement file download logic
    window.open(attachment.file_path, "_blank");
  };

  const isImageFile = (fileType: string): boolean => {
    return fileType.toLowerCase().startsWith("image");
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    console.log(message);

    return (
      <Box sx={{ mt: 1 }}>
        {message.attachments.map(
          (attachment: IMessageattachment, index: number) => (
            <Box key={index} sx={{ mb: 1 }}>
              {isImageFile(attachment.file_type) ? (
                <Box
                  component="img"
                  src={attachment.file_path}
                  alt={attachment.file_name}
                  sx={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => window.open(attachment.file_path, "_blank")}
                />
              ) : (
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    maxWidth: "300px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => handleFileDownload(attachment)}
                >
                  <FileIcon color="primary" />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {attachment.file_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {attachment.file_type} • {formatFileSize(attachment.size)}
                    </Typography>
                  </Box>
                  <Tooltip title="دانلود">
                    <IconButton size="small" color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Paper>
              )}
            </Box>
          )
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isAdmin ? "row-reverse" : "row",
        justifyContent: isAdmin ? "flex-end" : "flex-start",
        gap: 1,
        mb: 2,
        opacity: isLastMessage ? 1 : 0.9,
      }}
    >
      {" "}
      <Avatar
        sx={{
          bgcolor: isAdmin
            ? theme.palette.warning.main
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          width: 32,
          height: 32,
          fontSize: "0.875rem",
        }}
      >
        {isAdmin
          ? "پ"
          : currentUser?.first_name?.[0]?.toUpperCase() ||
            currentUser?.email?.[0]?.toUpperCase() ||
            "ک"}
      </Avatar>
      <Box sx={{ maxWidth: "70%" }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor: isAdmin
              ? theme.palette.grey[100]
              : theme.palette.primary.main,
            color: isAdmin ? "text.primary" : "white",
            borderRadius: isAdmin ? "0 10px 10px 10px " : "10px 0 10px 10px",
            position: "relative",
          }}
        >
          {/* Message sender indicator */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Chip
              label={
                isAdmin
                  ? "پشتیبانی"
                  : currentUser?.first_name && currentUser?.last_name
                    ? `${currentUser.first_name} ${currentUser.last_name}`
                    : "شما"
              }
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.75rem",
                height: 20,
                color: isAdmin ? "text.secondary" : "white",
                borderColor: isAdmin ? "text.secondary" : "white",
              }}
            />
            <Typography
              variant="caption"
              color={isAdmin ? "text.secondary" : "rgba(255,255,255,0.8)"}
            >
              {new Date(message.created_at).toLocaleString("fa-IR")}
            </Typography>
          </Box>

          {/* Message content */}
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            {message.message}
          </Typography>

          {/* Attachments */}
          {renderAttachments()}
        </Paper>
      </Box>
    </Box>
  );
};

export default TicketMessage;
