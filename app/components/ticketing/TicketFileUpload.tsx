import React, { useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  useTheme,
} from "@mui/material";

import {
  DeleteIcon,
  CloudUploadIcon,
  AttachIcon,
} from "../icons/IconComponents";

interface TicketFileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

const TicketFileUpload: React.FC<TicketFileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".txt"],
  disabled = false,
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      setError(`فایل ${file.name} بیش از حد مجاز است`);
      return false;
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (
      !acceptedTypes.some(
        (type) =>
          type === fileExtension ||
          (type.includes("*") && file.type.startsWith(type.replace("*", "")))
      )
    ) {
      setError(`فرمت فایل ${file.name} پشتیبانی نمی‌شود`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError("");
    const newFiles = Array.from(selectedFiles);

    // Check total files count
    if (files.length + newFiles.length > maxFiles) {
      setError(`حداکثر ${maxFiles} فایل مجاز است`);
      return;
    }

    // Validate each file
    const validFiles = newFiles.filter(validateFile);
    if (validFiles.length !== newFiles.length) {
      return; // Error already set in validateFile
    }

    // Add new files to existing ones
    const updatedFiles = [...files, ...validFiles];
    onFilesChange(updatedFiles);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: "none" }}
      />

      {/* Upload Area */}
      <Paper
        elevation={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        sx={{
          p: 3,
          border: `2px dashed ${
            isDragOver ? theme.palette.primary.main : theme.palette.grey[300]
          }`,
          borderRadius: 2,
          backgroundColor: isDragOver
            ? theme.palette.primary.light + "20"
            : theme.palette.grey[50],
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease-in-out",
          textAlign: "center",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <CloudUploadIcon
          style={{
            fontSize: 48,
            color: theme.palette.grey[400],
            marginBottom: 8,
          }}
        />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
          {isDragOver
            ? "فایل‌های خود را اینجا رها کنید"
            : "فایل‌های خود را اینجا بکشید یا کلیک کنید"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          حداکثر {maxFiles} فایل، هر فایل حداکثر {formatFileSize(maxSize)}
        </Typography>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            در حال آپلود...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            فایل‌های انتخاب شده ({files.length})
          </Typography>

          {/* Separate images from other files */}
          {(() => {
            const imageFiles = files.filter((file) =>
              file.type.startsWith("image/")
            );
            const otherFiles = files.filter(
              (file) => !file.type.startsWith("image/")
            );

            return (
              <>
                {/* Image Grid */}
                {imageFiles.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", mb: 1, display: "block" }}
                    >
                      تصاویر ({imageFiles.length})
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(100px, 1fr))",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {imageFiles.map((file, index) => (
                        <Paper
                          key={`image-${index}`}
                          elevation={1}
                          sx={{
                            position: "relative",
                            aspectRatio: "1/1",
                            borderRadius: 1.5,
                            overflow: "hidden",
                            backgroundColor: "grey.100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(files.indexOf(file));
                            }}
                            disabled={disabled}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              backgroundColor: "rgba(255,255,255,0.9)",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,1)",
                              },
                            }}
                          >
                            <DeleteIcon style={{ fontSize: 16 }} />
                          </IconButton>
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: "rgba(0,0,0,0.7)",
                              color: "white",
                              p: 0.5,
                              fontSize: "0.65rem",
                              textAlign: "center",
                            }}
                          >
                            {file.name.length > 15
                              ? file.name.substring(0, 12) + "..."
                              : file.name}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Other Files List */}
                {otherFiles.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", mb: 1, display: "block" }}
                    >
                      سایر فایل‌ها ({otherFiles.length})
                    </Typography>
                    {otherFiles.map((file, index) => (
                      <Paper
                        key={`file-${index}`}
                        elevation={1}
                        sx={{
                          p: 2,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          borderRadius: 1.5,
                        }}
                      >
                        <AttachIcon color="primary" />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" noWrap>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(file.size)}
                          </Typography>
                        </Box>
                        <Chip
                          label={file.type || "unknown"}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(files.indexOf(file));
                          }}
                          disabled={disabled}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                )}
              </>
            );
          })()}
        </Box>
      )}
    </Box>
  );
};

export default TicketFileUpload;
