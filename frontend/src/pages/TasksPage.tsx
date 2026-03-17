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
import { AssignmentRounded } from '@mui/icons-material';

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
      const msg = error.response?.data?.message || 'Failed to create task';
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
    <Fade in timeout={400}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          pt: { xs: 8, md: 10 },
          pb: 6,
          overflowY: 'auto',
        }}
      >
        <Container maxWidth="xl">

          {/* 🔷 HEADER */}
          <Box
            sx={{
              p: 2,
              borderRadius: 4,
              mb: 2,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Task Dashboard
              </Typography>
              <Typography sx={{ opacity: 0.85 }}>
                Manage and track your work efficiently 🚀
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
              sx={{
                bgcolor: '#fff',
                color: '#6366f1',
                fontWeight: 600,
                borderRadius: 3,
                px: 3,
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              New Task
            </Button>
          </Box>

          {/* 🔷 FILTER + STATS */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 3,
              mb: 2,
            }}
          >
            {/* Filter Card */}
            <Box
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                bgcolor: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <Typography fontWeight={600} mb={1}>
                Filter by Project
              </Typography>

              <FormControl fullWidth>
                <Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Projects</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.title || 'Untitled Project'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Stats Cards */}
            <Box
              sx={{
                flex: 3,
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr 1fr',
                  md: 'repeat(4, minmax(120px, 1fr))',
                },
                gap: 2,
              }}
            >
              {[
                { label: 'Total Tasks', value: tasks.length, color: '#6366f1' },
                {
                  label: 'Todo',
                  value: tasks.filter(t => t.status === 'todo').length,
                  color: '#0ea5e9',
                },
                {
                  label: 'In Progress',
                  value: tasks.filter(t => t.status === 'in-progress').length,
                  color: '#f59e0b',
                },
                {
                  label: 'Completed',
                  value: tasks.filter(t => t.status === 'completed').length,
                  color: '#22c55e',
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    borderLeft: `6px solid ${item.color}`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* 🔷 LOADING */}
          {loading && (
            <Box textAlign="center" py={10}>
              <CircularProgress size={50} />
            </Box>
          )}

          {/* 🔷 ERROR */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* 🔷 EMPTY STATE */}
          {!loading && tasks.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                p: 6,
                borderRadius: 4,
                bgcolor: '#fff',
              }}
            >
              <AssignmentRounded sx={{ fontSize: 70, color: '#cbd5e1' }} />
              <Typography variant="h6" mt={2}>
                No Tasks Found
              </Typography>
              <Typography color="text.secondary" mb={3}>
                Start by creating your first task
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormOpen(true)}
                sx={{ borderRadius: 3 }}
              >
                Create Task
              </Button>
            </Box>
          )}

          {/* 🔷 TASK LIST */}
          {!loading && tasks.length > 0 && (
            <Box
              sx={{
                bgcolor: '#fff',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <TaskList
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDelete}
                projectMap={projectMap}
              />
            </Box>
          )}
        </Container>

        {/* 🔷 FORM MODAL */}
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