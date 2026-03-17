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
              p: 3,
              borderRadius: 4,
              mb: 4,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                My Projects
              </Typography>
              <Typography sx={{ opacity: 0.85 }}>
                Manage all your work in one place 🚀
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
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
              New Project
            </Button>
          </Box>

          {/* 🔷 STATS (COMPACT CARDS) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr 1fr',
                md: 'repeat(3, minmax(120px, 1fr))',
              },
              gap: 1.5,
              mb: 4,
            }}
          >
            {[
              { label: 'Total', value: projects.length, color: '#6366f1' },
              { label: 'Active', value: activeCount, color: '#22c55e' },
              { label: 'Completed', value: completedCount, color: '#f59e0b' },
            ].map((item, i) => (
              <Box
                key={i}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#fff',
                  borderLeft: `4px solid ${item.color}`,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* 🔷 CONTENT */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={50} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          ) : projects.length === 0 ? (
            <Box
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 4,
                bgcolor: '#fff',
              }}
            >
              <FolderOpenRoundedIcon sx={{ fontSize: 70, color: '#cbd5e1' }} />
              <Typography variant="h6" mt={2}>
                No Projects Found
              </Typography>
              <Typography color="text.secondary" mb={3}>
                Create your first project to get started
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setFormOpen(true)}
                sx={{ borderRadius: 3 }}
              >
                Create Project
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: '#fff',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <ProjectList
                projects={projects}
                onSelectProject={handleSelectProject}
                onDeleteProject={handleDelete}
                onEditProject={handleEditProject}
              />
            </Box>
          )}
        </Container>

        {/* 🔷 MODALS */}
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