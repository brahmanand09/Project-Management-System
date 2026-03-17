import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import TaskList from '../components/Task/TaskList';
import TaskForm from '../components/Task/TaskForm';
import { Task, Project } from '../types';
import { createTask, deleteTask, updateTask, getTasks, getProjects } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Partial<Task> | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMap, setProjectMap] = useState<{ [key: string]: string }>({});
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch projects for dropdown and projectMap
        const projectResponse = await getProjects();
        const projectArray = Array.isArray(projectResponse.data) ? projectResponse.data : projectResponse.data.data || [];
        setProjects(projectArray);

        // Create projectMap for task list
        const map = projectArray.reduce((acc: { [key: string]: string }, project: Project) => {
          acc[project._id] = project.title || 'Untitled Project';
          return acc;
        }, {});
        setProjectMap(map);

        // Fetch tasks
        let response;
        try {
          response = await getTasks(selectedProject === 'all' ? undefined : selectedProject);
        } catch (err: any) {
          if (err.response?.status === 400 && projectArray.length > 0) {
            response = await getTasks(projectArray[0]._id);
            setSelectedProject(projectArray[0]._id);
          } else {
            throw err;
          }
        }
        
        const taskArray = Array.isArray(response.data) ? response.data : response.data.data || [];
        setTasks(taskArray);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        const msg = err.response?.data?.message || 'Failed to load tasks';
        setError(msg);
        toast.error(msg, { position: 'top-right', autoClose: 3000 });
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProject]);

  const handleCreate = async (data: Partial<Task>) => {
  try {
    // Ensure projectId is included
    const taskData = {
      ...data,
      projectId: data.projectId || (selectedProject !== 'all' ? selectedProject : undefined)
    };
    
    if (!taskData.projectId) {
      toast.error('Please select a project for the task', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const newTask = await createTask(taskData as Omit<Task, '_id'>);
    setTasks([...tasks, newTask]);
    toast.success('Task created successfully', { position: 'top-right', autoClose: 3000 });
    setFormOpen(false); // Modal close karo
    setError(null);
  } catch (error: any) {
    const msg = error.response?.data?.message  || 'Failed to create task';
    toast.error(msg, { position: 'top-right', autoClose: 3000 });
    setError(msg);
  }
};

  const handleUpdate = async (data: Partial<Task>) => {
    try {
      if (editTask?._id) {
        const updatedTask = await updateTask(editTask._id, data);
        setTasks(tasks.map((t) => (t._id === editTask._id ? updatedTask : t)));
        toast.success('Task updated successfully', { position: 'top-right', autoClose: 3000 });
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update task';
      toast.error(msg, { position: 'top-right', autoClose: 3000 });
      setError(msg);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success('Task deleted successfully', { position: 'top-right', autoClose: 3000 });
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Failed to delete task';
        toast.error(msg, { position: 'top-right', autoClose: 3000 });
        setError(msg);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Task>) => {
    if (editTask) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditTask(null);
  };

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          pt: { xs: 8, sm: 10 },
          pb: 6,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header Section */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              mb: 2 
            }}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  All Tasks
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                  }}
                >
                  Manage and organize your tasks
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormOpen(true)}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(25, 118, 210, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                New Task
              </Button>
            </Box>

            {/* Filter Section */}
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              flexWrap: 'wrap',
              mt: 3,
              alignItems: 'center'
            }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Project</InputLabel>
                <Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  label="Filter by Project"
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="all">All Tasks</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.title || 'Untitled Project'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Tasks Summary */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main' 
                  }} />
                  <Typography variant="body2" color="text.secondary">
                    Todo: {tasks.filter(t => t.status === 'todo').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'warning.main' 
                  }} />
                  <Typography variant="body2" color="text.secondary">
                    In Progress: {tasks.filter(t => t.status === 'in-progress').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main' 
                  }} />
                  <Typography variant="body2" color="text.secondary">
                    Completed: {tasks.filter(t => t.status === 'completed').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'text.secondary' 
                  }} />
                  <Typography variant="body2" color="text.secondary">
                    Total: {tasks.length}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress size={60} />
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Tasks List */}
          {!loading && (
            <TaskList 
              tasks={tasks} 
              onEdit={handleEditTask} 
              onDelete={handleDelete} 
              projectMap={projectMap} 
            />
          )}
        </Container>

        {/* Task Form Modal */}
        <TaskForm
          open={formOpen}
          onClose={handleFormClose}
          initialData={editTask || {}}
          onSubmit={handleFormSubmit}
        />
      </Box>
    </Fade>
  );
};

export default TasksPage;