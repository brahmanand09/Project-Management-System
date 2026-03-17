import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade,
  Container,
  Alert,
  Paper,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import ProjectList from '../components/Project/ProjectList';
import ProjectForm from '../components/Project/ProjectForm';
import ProjectTasksModal from '../components/Layout/ProjectTasksModal';
import { Project } from '../types';
import { createProject, deleteProject, updateProject, getProjects } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Partial<Project> | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProjects();
        const projectArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setProjects(projectArray);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Failed to load projects';
        setError(msg);
        toast.error(msg, { position: 'top-right', autoClose: 4000 });
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreate = async (data: Partial<Project>) => {
    try {
      const newProject = await createProject(data as Omit<Project, '_id' | 'user'>);
      setProjects((prev) => [...prev, newProject]);
      toast.success('Project created successfully');
      setFormOpen(false);
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create project';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleUpdate = async (data: Partial<Project>) => {
    if (!editProject?._id) return;
    try {
      const updated = await updateProject(editProject._id, data);
      setProjects((prev) =>
        prev.map((p) => (p._id === editProject._id ? updated : p))
      );
      toast.success('Project updated');
      setFormOpen(false);
      setEditProject(null);
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update project';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete project';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setTasksModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditProject(project);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Project>) => {
    if (editProject) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  const activeCount = projects.filter((p) => p.status === 'active').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          pt: { xs: 9, md: 10 },
          pb: 8,
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 6,
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
                >
                  My Projects
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Organize, track, and manage all your work in one place
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddRoundedIcon />}
                onClick={() => setFormOpen(true)}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.4,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.18)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(99,102,241,0.28)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                New Project
              </Button>
            </Box>

            {/* Stats */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ mt: 4 }}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  label={projects.length}
                  color="primary"
                  size="medium"
                  sx={{ fontWeight: 600, minWidth: 60 }}
                />
                <Typography variant="body1" fontWeight={500}>
                  Total Projects
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  label={activeCount}
                  color="success"
                  size="medium"
                  sx={{ fontWeight: 600, minWidth: 60 }}
                />
                <Typography variant="body1" fontWeight={500}>
                  Active
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip
                  label={completedCount}
                  color="warning"
                  size="medium"
                  sx={{ fontWeight: 600, minWidth: 60 }}
                />
                <Typography variant="body1" fontWeight={500}>
                  Completed
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Main Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : error ? (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 3,
                '& .MuiAlert-message': { fontSize: '1.05rem' },
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          ) : projects.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 4,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <FolderOpenRoundedIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 3 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No projects yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480, mx: 'auto' }}>
                Start organizing your work by creating your first project.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setFormOpen(true)}
                size="large"
                sx={{ borderRadius: 3, px: 5, py: 1.5 }}
              >
                Create First Project
              </Button>
            </Paper>
          ) : (
            <ProjectList
              projects={projects}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDelete}
              onEditProject={handleEditProject}
            />
          )}
        </Container>

        {/* Modals */}
        <ProjectForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditProject(null);
          }}
          initialData={editProject || {}}
          onSubmit={handleFormSubmit}
        />

        <ProjectTasksModal
          open={tasksModalOpen}
          onClose={() => {
            setTasksModalOpen(false);
            setSelectedProject(null);
          }}
          projectId={selectedProject?._id || ''}
          projectTitle={selectedProject?.title || ''}
        />
      </Box>
    </Fade>
  );
};

export default DashboardPage;