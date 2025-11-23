import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNewTicket, useDepartments } from '~/api/ticketing.api';
import { useNewTicketValidation } from '~/validation/hooks/useTicketingValidation';
import { TicketPriority } from '~/types/dtos/ticketing.dto';
import type { IDepartments } from '~/types/interfaces/ticketing.interface';
import TicketFileUpload from './TicketFileUpload';

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

  // Load departments
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await departmentsMutation.mutateAsync();
      if (response?.data?.list) {
        setDepartments(response.data.list);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
      enqueueSnackbar('خطا در بارگذاری دپارتمان‌ها', { variant: 'error' });
    }
  };

  const getPriorityText = (priority: TicketPriority): string => {
    switch (priority) {
      case TicketPriority.HIGH:
        return 'بالا';
      case TicketPriority.MEDIUM:
        return 'متوسط';
      case TicketPriority.LOW:
        return 'پایین';
      default:
        return 'نامشخص';
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
    if (!form.isFormValid) return;

    try {
      const formData = {
        ...form.getValues(),
        files: (form.getValues().files || []).filter((file): file is File => file !== undefined)
      };
      const response = await newTicketMutation.mutateAsync(formData);
      
      if (response?.data?.data) {
        enqueueSnackbar('تیکت با موفقیت ایجاد شد', { variant: 'success' });
        onTicketCreated(response.data.data.ticket_id);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      enqueueSnackbar('خطا در ایجاد تیکت', { variant: 'error' });
    }
  };

  const handleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
          overflow: 'auto',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
          {/* Subject */}
          <TextField
            fullWidth
            label="موضوع تیکت"
            placeholder="موضوع مشکل یا سوال خود را وارد کنید"
            value={form.watch('subject') || ''}
            onChange={(e) => form.setValue('subject', e.target.value)}
            error={!!form.formState.errors.subject}
            helperText={form.formState.errors.subject?.message}
          />

          {/* Department */}
          <FormControl fullWidth error={!!form.formState.errors.department_id}>
            <InputLabel>دپارتمان</InputLabel>
            <Select
              value={form.watch('department_id') || ''}
              onChange={(e) => form.setValue('department_id', Number(e.target.value))}
              label="دپارتمان"
            >
              <MenuItem value="">انتخاب کنید</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
            {form.formState.errors.department_id && (
              <FormHelperText>{form.formState.errors.department_id.message}</FormHelperText>
            )}
          </FormControl>

          {/* Priority */}
          <FormControl fullWidth error={!!form.formState.errors.priority}>
            <InputLabel>اولویت</InputLabel>
            <Select
              value={form.watch('priority') ?? ''}
              onChange={(e) => form.setValue('priority', Number(e.target.value) as TicketPriority)}
              label="اولویت"
            >
              <MenuItem value={TicketPriority.HIGH}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    size="small"
                    label="بالا"
                    sx={{
                      backgroundColor: getPriorityColor(TicketPriority.HIGH),
                      color: 'white',
                    }}
                  />
                </Box>
              </MenuItem>
              <MenuItem value={TicketPriority.MEDIUM}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    size="small"
                    label="متوسط"
                    sx={{
                      backgroundColor: getPriorityColor(TicketPriority.MEDIUM),
                      color: 'white',
                    }}
                  />
                </Box>
              </MenuItem>
              <MenuItem value={TicketPriority.LOW}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    size="small"
                    label="پایین"
                    sx={{
                      backgroundColor: getPriorityColor(TicketPriority.LOW),
                      color: 'white',
                    }}
                  />
                </Box>
              </MenuItem>
            </Select>
            {form.formState.errors.priority && (
              <FormHelperText>{form.formState.errors.priority.message}</FormHelperText>
            )}
          </FormControl>

          {/* Message */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            label="متن پیام"
            placeholder="توضیح کاملی از مشکل یا سوال خود ارائه دهید..."
            value={form.watch('first_message') || ''}
            onChange={(e) => form.setValue('first_message', e.target.value)}
            error={!!form.formState.errors.first_message}
            helperText={form.formState.errors.first_message?.message}
          />

          {/* File Upload */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleFileUpload}
                startIcon={<AttachFileIcon />}
                color={showFileUpload ? 'primary' : 'inherit'}
              >
                ضمیمه فایل
              </Button>
              {form.watch('files') && form.watch('files')!.length > 0 && (
                <Chip
                  label={`${form.watch('files')!.length} فایل انتخاب شده`}
                  size="small"
                  color="primary"
                />
              )}
            </Box>

            {showFileUpload && (
              <TicketFileUpload
                files={(form.watch('files') || []).filter((file): file is File => file !== undefined)}
                onFilesChange={(files) => form.setValue('files', files)}
              />
            )}

            {form.formState.errors.files && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {form.formState.errors.files.message}
              </Typography>
            )}
          </Box>

          {/* Info Alert */}
          <Alert severity="info">
            <Typography variant="body2">
              پس از ایجاد تیکت، شما یک شماره پیگیری دریافت خواهید کرد که می‌توانید از طریق آن وضعیت تیکت خود را پیگیری کنید.
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
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.isFormValid || form.formState.isSubmitting}
            startIcon={<SendIcon />}
          >
            {form.formState.isSubmitting ? 'در حال ارسال...' : 'ایجاد تیکت'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewTicketForm;