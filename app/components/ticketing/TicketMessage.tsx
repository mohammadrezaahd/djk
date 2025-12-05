import React, { useEffect, useState } from "react";
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
  Modal,
  Backdrop,
} from "@mui/material";

import {
  CloseIcon,
  PaperIcon,
  AngleLeftIcon,
  AngleRight,
  ImportIcon,
} from "../icons/IconComponents";

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

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState<IMessageattachment[]>([]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileDownload = async (attachment: IMessageattachment) => {
    try {
      // Fetch the file as blob
      const response = await fetch(attachment.file_path);
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = attachment.file_name || "download";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab if download fails
      window.open(attachment.file_path, "_blank");
    }
  };

  const isImageFile = (fileType: string): boolean => {
    return fileType.toLowerCase().startsWith("image");
  };

  const openLightbox = (
    imageIndex: number,
    imageList: IMessageattachment[]
  ) => {
    setImages(imageList);
    setSelectedImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const downloadCurrentImage = () => {
    if (images[selectedImageIndex]) {
      handleFileDownload(images[selectedImageIndex]);
    }
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    console.log(message);

    // جدا کردن تصاویر از فایل‌های دیگر
    const messageImages = message.attachments.filter(
      (attachment: IMessageattachment) => isImageFile(attachment.file_type)
    );
    const otherFiles = message.attachments.filter(
      (attachment: IMessageattachment) => !isImageFile(attachment.file_type)
    );

    return (
      <Box sx={{ mt: 1 }}>
        {/* نمایش تصاویر مثل تلگرام */}
        {messageImages.length > 0 && (
          <Box sx={{ mb: otherFiles.length > 0 ? 2 : 0 }}>
            {messageImages.length === 1 ? (
              // تصویر تکی - بهتر شده
              <Box
                sx={{
                  maxWidth: "320px",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  },
                }}
                onClick={() => openLightbox(0, messageImages)}
              >
                <Box
                  component="img"
                  src={messageImages[0].file_path}
                  alt={messageImages[0].file_name}
                  sx={{
                    width: "100%",
                    minHeight: "120px",
                    maxHeight: "400px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ) : messageImages.length === 2 ? (
              // دو تصویر کنار هم - بهتر شده
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0.75,
                  maxWidth: "320px",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {messageImages
                  .slice(0, 2)
                  .map((attachment: IMessageattachment, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        aspectRatio: "4/5",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                          zIndex: 1,
                        },
                      }}
                      onClick={() => openLightbox(index, messageImages)}
                    >
                      <Box
                        component="img"
                        src={attachment.file_path}
                        alt={attachment.file_name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  ))}
              </Box>
            ) : messageImages.length === 3 ? (
              // سه تصویر: یکی بالا، دو تا پایین - بهتر شده
              <Box
                sx={{
                  maxWidth: "320px",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    mb: 0.75,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.01)",
                    },
                  }}
                  onClick={() => openLightbox(0, messageImages)}
                >
                  <Box
                    component="img"
                    src={messageImages[0].file_path}
                    alt={messageImages[0].file_name}
                    sx={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 0.75,
                  }}
                >
                  {messageImages
                    .slice(1, 3)
                    .map((attachment: IMessageattachment, index: number) => (
                      <Box
                        key={index + 1}
                        sx={{
                          aspectRatio: "1",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                            zIndex: 1,
                          },
                        }}
                        onClick={() => openLightbox(index + 1, messageImages)}
                      >
                        <Box
                          component="img"
                          src={attachment.file_path}
                          alt={attachment.file_name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Box>
                    ))}
                </Box>
              </Box>
            ) : (
              // چهار یا بیشتر: grid 2x2 با شمارش اضافی - بهتر شده
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0.75,
                  maxWidth: "320px",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {messageImages
                  .slice(0, 4)
                  .map((attachment: IMessageattachment, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        aspectRatio: "1",
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                          zIndex: 1,
                        },
                      }}
                      onClick={() => openLightbox(index, messageImages)}
                    >
                      <Box
                        component="img"
                        src={attachment.file_path}
                        alt={attachment.file_name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      {/* نمایش تعداد باقی‌مانده تصاویر - بهتر شده */}
                      {index === 3 && messageImages.length > 4 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(2px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                          }}
                        >
                          +{messageImages.length - 4}
                        </Box>
                      )}
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
        )}

        {/* نمایش فایل‌های دیگر */}
        {otherFiles.map((attachment: IMessageattachment, index: number) => (
          <Box key={`file-${index}`} sx={{ mb: 1 }}>
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
              <PaperIcon color="primary" />
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
                  <ImportIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </Box>
        ))}
      </Box>
    );
  };
  useEffect(() => {
    console.log("isAdmin:", isAdmin);
  }, [isAdmin]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isAdmin ? "row-reverse" : "row",
        justifyContent: "flex-start",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              variant="caption"
              color={isAdmin ? "text.secondary" : "rgba(255,255,255,0.8)"}
            >
              {new Date(message.created_at).toLocaleString("fa-IR")}
            </Typography>
          </Box>
        </Paper>

        {/* Lightbox Modal */}
        <Modal
          open={lightboxOpen}
          onClose={closeLightbox}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 300,
            sx: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          }}
        >
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={closeLightbox}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Download Button */}
            <IconButton
              onClick={downloadCurrentImage}
              sx={{
                position: "absolute",
                top: 16,
                right: 72,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <ImportIcon />
            </IconButton>

            {/* Previous Button */}
            {images.length > 1 && (
              <IconButton
                onClick={goToPrevImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                  },
                }}
              >
                <AngleLeftIcon />
              </IconButton>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <IconButton
                onClick={goToNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1000,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                  },
                }}
              >
                <AngleRight />
              </IconButton>
            )}

            {/* Image */}
            {images[selectedImageIndex] && (
              <Box
                sx={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={images[selectedImageIndex].file_path}
                  alt={images[selectedImageIndex].file_name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />

                {/* Image Info */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: 1,
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2">
                    {images[selectedImageIndex].file_name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {selectedImageIndex + 1} از {images.length} •{" "}
                    {formatFileSize(images[selectedImageIndex].size)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default TicketMessage;
