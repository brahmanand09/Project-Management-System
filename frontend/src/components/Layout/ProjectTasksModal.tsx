import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Task } from '../../types';
import { getTasks } from '../../services/api';

interface ProjectTasksModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

const ProjectTasksModal: React.FC<ProjectTasksModalProps> = ({
  open,
  onClose,
  projectId,
  projectTitle
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (open && projectId) {
      fetchTasks();
    }
  }, [open, projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks(projectId);
      const taskArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setTasks(taskArray);
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
      setError(err.response?.data?.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTasks = tasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'todo': return 'primary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Tasks for: {projectTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Project ID: {projectId}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && tasks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No tasks found for this project
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Create tasks to get started with your project
            </Typography>
          </Box>
        )}

        {!loading && tasks.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ bgcolor: 'background.default' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Task Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTasks.map((task) => (
                    <TableRow key={task._id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {task.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {task.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          color={getStatusColor(task.status) as any}
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tasks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                mt: 2,
                '& .MuiTablePagination-toolbar': {
                  color: 'text.primary',
                },
              }}
            />
          </>
        )}

        {/* Tasks Summary */}
        {!loading && tasks.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Tasks Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Chip 
                label={`Total: ${tasks.length}`} 
                variant="outlined" 
                color="primary" 
              />
              <Chip 
                label={`Todo: ${tasks.filter(t => t.status === 'todo').length}`} 
                variant="outlined" 
                color="primary" 
              />
              <Chip 
                label={`In Progress: ${tasks.filter(t => t.status === 'in-progress').length}`} 
                variant="outlined" 
                color="warning" 
              />
              <Chip 
                label={`Completed: ${tasks.filter(t => t.status === 'completed').length}`} 
                variant="outlined" 
                color="success" 
              />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectTasksModal;