import React from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  Typography, 
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectSchema } from '../../types/validationSchemas';
import { ProjectFormValues } from '../../types/formTypes';
import { Project } from '../../types';
import CloseIcon from '@mui/icons-material/Close';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<Project>;
  onSubmit: (data: Partial<Project>) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  open, 
  onClose, 
  initialData, 
  onSubmit 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectSchema),
    defaultValues: initialData as ProjectFormValues,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: ProjectFormValues) => {
    await onSubmit(data);
    handleClose();
  };

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
        <Typography variant="h5" fontWeight={600}>
          {initialData?._id ? 'Edit Project' : 'Create New Project'}
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
          id="project-form"
        >
          <TextField
            fullWidth
            label="Project Title"
            placeholder="Enter project title"
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
            placeholder="Describe your project goals and objectives..."
            multiline
            rows={4}
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
          
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              {...register('status')}
              defaultValue={initialData?.status || 'active'}
              label="Status"
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
            {errors.status && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.status.message}
              </Typography>
            )}
          </FormControl>
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
          form="project-form"
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
          {isSubmitting ? 'Saving...' : (initialData?._id ? 'Update Project' : 'Create Project')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectForm;