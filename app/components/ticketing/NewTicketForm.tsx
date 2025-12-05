import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  useTheme,
  Alert,
  FormHelperText,
  Chip,
  IconButton,
} from "@mui/material";

import { CloseIcon, SendIcon, AttachIcon } from "../icons/IconComponents";

import { useSnackbar } from "notistack";
import { useNewTicket, useDepartments } from "~/api/ticketing.api";
import { useNewTicketValidation } from "~/validation/hooks/useTicketingValidation";
import { TicketPriority } from "~/types/dtos/ticketing.dto";
import type { IDepartments } from "~/types/interfaces/ticketing.interface";
import type { IPostTicket } from "~/types/dtos/ticketing.dto";
import TicketFileUpload from "./TicketFileUpload";

interface NewTicketFormProps {
  onClose: () => void;
  onTicketCreated: (ticketId: number) => void;
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({
  onClose,
  onTicketCreated,
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [departments, setDepartments] = useState<IDepartments[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const newTicketMutation = useNewTicket();
  const departmentsMutation = useDepartments();
  const form = useNewTicketValidation();

  // Get loading state from mutation
  const isLoading = newTicketMutation.isPending;

  // Debug validation state
  console.log("Form validation state:", {
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    values: form.watch(),
  });

  // Load departments
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await departmentsMutation.mutateAsync();
      if (response?.data?.list && response.data.list.length > 0) {
        setDepartments(response.data.list);
        // Set first department as default if none selected
        if (!form.watch("department_id")) {
          form.setValue("department_id", response.data.list[0].id, {
            shouldValidate: true,
          });
        }
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      enqueueSnackbar("خطا در بارگذاری دپارتمان‌ها", { variant: "error" });
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

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.HIGH:
        return theme.palette.error.main;
      case TicketPriority.MEDIUM:
        return theme.palette.warning.main;
      case TicketPriority.LOW:
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleSubmit = async () => {
    // Trigger validation manually before submit
    const isValid = await form.trigger();
    console.log("Manual validation result:", isValid);
    console.log("Form state before submit:", form.formState);

    if (!isValid) {
      console.log("Form is not valid, errors:", form.formState.errors);
      return;
    }

    try {
      const values = form.getValues();

      // Filter and validate files
      const validFiles = (values.files || []).filter(
        (file): file is File => file instanceof File && file.size > 0
      );

      // Create proper payload - files will be handled by the API function
      const payload: IPostTicket = {
        subject: values.subject,
        department_id: values.department_id,
        priority: values.priority,
        first_message: values.first_message,
        ...(validFiles.length > 0 && { files: validFiles }),
      };

      console.log("Submitting payload:", {
        subject: payload.subject,
        department_id: payload.department_id,
        priority: payload.priority,
        first_message: payload.first_message,
        files: validFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      });
      console.log("Actual File objects count:", validFiles.length);
      console.log("Will send as FormData with all fields included");

      const response = await newTicketMutation.mutateAsync(payload);

      console.log("Create ticket response:", response);

      // Check for success using ApiStatus
      if (response?.status === "true") {
        // ApiStatus.SUCCEEDED
        enqueueSnackbar("تیکت با موفقیت ایجاد شد", { variant: "success" });

        // Reset form
        form.reset();

        if (response?.data?.data?.ticket_id) {
          onTicketCreated(response.data.data.ticket_id);
        }
      } else {
        const errorMessage =
          response?.error || response?.message || "خطا در ایجاد تیکت";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      enqueueSnackbar("خطا در ایجاد تیکت", { variant: "error" });
    }
  };

  const handleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

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
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            تیکت جدید
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Form */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            maxWidth: 800,
          }}
        >
          {/* Subject */}
          <TextField
            fullWidth
            label="موضوع تیکت"
            placeholder="موضوع مشکل یا سوال خود را وارد کنید"
            value={form.watch("subject") || ""}
            onChange={(e) =>
              form.setValue("subject", e.target.value, { shouldValidate: true })
            }
            error={!!form.formState.errors.subject}
            helperText={form.formState.errors.subject?.message}
            disabled={isLoading}
          />

          {/* Two Column Layout */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {/* Department */}
            <FormControl
              fullWidth
              error={!!form.formState.errors.department_id}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
                "& .MuiPaper-root": {
                  borderRadius: 1,
                },
              }}
            >
              <InputLabel>دپارتمان</InputLabel>
              <Select
                value={form.watch("department_id") || ""}
                onChange={(e) =>
                  form.setValue("department_id", Number(e.target.value), {
                    shouldValidate: true,
                  })
                }
                label="دپارتمان"
                disabled={isLoading}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 1,
                      mt: 1,
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  انتخاب کنید
                </MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
              {form.formState.errors.department_id && (
                <FormHelperText>
                  {form.formState.errors.department_id.message}
                </FormHelperText>
              )}
            </FormControl>

            {/* Priority */}
            <FormControl
              fullWidth
              error={!!form.formState.errors.priority}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
                "& .MuiPaper-root": {
                  borderRadius: 1,
                },
              }}
            >
              <InputLabel>اولویت</InputLabel>
              <Select
                value={form.watch("priority") ?? ""}
                onChange={(e) =>
                  form.setValue(
                    "priority",
                    Number(e.target.value) as TicketPriority,
                    { shouldValidate: true }
                  )
                }
                label="اولویت"
                disabled={isLoading}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 1,
                      mt: 1,
                    },
                  },
                }}
              >
                <MenuItem value={TicketPriority.HIGH}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      size="small"
                      label="بالا"
                      sx={{
                        backgroundColor: getPriorityColor(TicketPriority.HIGH),
                        color: "white",
                      }}
                    />
                  </Box>
                </MenuItem>
                <MenuItem value={TicketPriority.MEDIUM}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      size="small"
                      label="متوسط"
                      sx={{
                        backgroundColor: getPriorityColor(
                          TicketPriority.MEDIUM
                        ),
                        color: "white",
                      }}
                    />
                  </Box>
                </MenuItem>
                <MenuItem value={TicketPriority.LOW}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      size="small"
                      label="پایین"
                      sx={{
                        backgroundColor: getPriorityColor(TicketPriority.LOW),
                        color: "white",
                      }}
                    />
                  </Box>
                </MenuItem>
              </Select>
              {form.formState.errors.priority && (
                <FormHelperText>
                  {form.formState.errors.priority.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Message */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            label="متن پیام"
            placeholder="توضیح کاملی از مشکل یا سوال خود ارائه دهید..."
            value={form.watch("first_message") || ""}
            onChange={(e) =>
              form.setValue("first_message", e.target.value, {
                shouldValidate: true,
              })
            }
            error={!!form.formState.errors.first_message}
            helperText={form.formState.errors.first_message?.message}
            disabled={isLoading}
          />

          {/* File Upload */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleFileUpload}
                startIcon={<AttachIcon />}
                color={showFileUpload ? "primary" : "inherit"}
                disabled={isLoading}
                sx={{ borderRadius: 1 }}
              >
                ضمیمه فایل
              </Button>
              {form.watch("files") && form.watch("files")!.length > 0 && (
                <Chip
                  label={`${form.watch("files")!.length} فایل انتخاب شده`}
                  size="small"
                  color="primary"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>

            {showFileUpload && (
              <TicketFileUpload
                files={(form.watch("files") || []).filter(
                  (file): file is File => file !== undefined
                )}
                onFilesChange={(files) => form.setValue("files", files)}
                disabled={isLoading}
              />
            )}

            {form.formState.errors.files && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {form.formState.errors.files.message}
              </Typography>
            )}
          </Box>

          {/* Info Alert */}
          <Alert severity="info">
            <Typography variant="body2">
              پس از ایجاد تیکت، شما یک شماره پیگیری دریافت خواهید کرد که
              می‌توانید از طریق آن وضعیت تیکت خود را پیگیری کنید.
            </Typography>
          </Alert>
        </Box>
      </Box>

      {/* Footer */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
            sx={{ borderRadius: 1 }}
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.formState.isValid || isLoading}
            startIcon={<SendIcon />}
            sx={{ borderRadius: 1 }}
          >
            {isLoading ? "در حال ایجاد تیکت..." : "ایجاد تیکت"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewTicketForm;
