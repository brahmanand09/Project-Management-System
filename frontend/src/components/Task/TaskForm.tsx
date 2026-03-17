import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Typography, 
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { taskSchema } from '../../types/validationSchemas';
import { TaskFormValues } from '../../types/formTypes';
import { getProjects } from '../../services/api';
import { Project, Task } from '../../types';
import CloseIcon from '@mui/icons-material/Close';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<Task> | Partial<TaskFormValues & { projectId?: string }>;
  onSubmit: (data: Partial<TaskFormValues & { projectId?: string }>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, initialData, onSubmit }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<TaskFormValues & { projectId?: string }>({
    resolver: yupResolver(taskSchema) as any,
    defaultValues: {
      title: (initialData as any)?.title || '',
      description: (initialData as any)?.description || '',
      status: (initialData as any)?.status || 'todo',
      dueDate: (initialData as any)?.dueDate || '',
      projectId: (initialData as any)?.projectId || ''
    }
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProjects();
      // Auto-fill form when initialData changes
      if (initialData) {
        setValue('title', (initialData as any).title || '');
        setValue('description', (initialData as any).description || '');
        setValue('status', (initialData as any).status || 'todo');
        setValue('dueDate', (initialData as any).dueDate || '');
        setValue('projectId', (initialData as any).projectId || '');
      }
    }
  }, [open, initialData, setValue]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects();
      const projectsArray = Array.isArray(response.data) ? response.data : response.data.data || [];
      const validProjects = projectsArray.filter((project: any) => project._id);
      setProjects(validProjects);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      const msg = error.response?.data?.message || 'Failed to load projects';
      setError(msg);
      toast.error(msg, { position: 'top-right', autoClose: 3000 });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: Partial<TaskFormValues & { projectId?: string }>) => {
    try {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };
      await onSubmit(formattedData);
      handleClose();
    } catch (error: any) {
      console.error('Error submitting task:', error);
      const msg = error.response?.data?.message || 'Failed to submit task';
      toast.error(msg, { position: 'top-right', autoClose: 3000 });
      setError(msg);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Check if we're in edit mode
  const isEditMode = !!(initialData as any)?._id;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.2)',
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 3,
          px: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
          id="task-form"
        >
          {error && (
            <Typography
              variant="body2"
              sx={{
                color: 'error.main',
                bgcolor: 'rgba(212, 117, 110, 0.1)',
                p: 1.5,
                borderRadius: 2,
                textAlign: 'center',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </Typography>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <TextField
            fullWidth
            label="Task Title"
            placeholder="Enter task title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            placeholder="Describe your task details..."
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <FormControl fullWidth error={!!(errors as any).projectId}>
            <InputLabel>Project</InputLabel>
            <Select
              {...register('projectId')}
              defaultValue={(initialData as any)?.projectId || ''}
              label="Project"
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <MenuItem value="" disabled>
                Select a project
              </MenuItem>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title || 'Untitled Project'}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No projects available
                </MenuItem>
              )}
            </Select>
            {(errors as any).projectId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {(errors as any).projectId?.message}
              </Typography>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                {...register('status')}
                defaultValue={(initialData as any)?.status || 'todo'}
                label="Status"
                sx={{
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
              {errors.status && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.status.message}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Due Date"
              type="date"
              {...register('dueDate')}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="task-form"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;