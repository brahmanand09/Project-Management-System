import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, List, ListItem, ListItemText, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getTasks } from '../services/api';
import { Task } from '../types';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!projectId) throw new Error('Project ID is missing');
        setLoading(true);
        // getTasks is defined to take no args — fetch everything then filter client-side
        const res = await getTasks();
        // Normalize possible response shapes (array, axios-like { data: [...] }, or wrapped { data: { data: [...] } })
        const list: Task[] = Array.isArray(res)
          ? res
          : Array.isArray((res as any)?.data)
          ? (res as any).data
          : Array.isArray((res as any)?.data?.data)
          ? (res as any).data.data
          : [];

        console.log('Fetched tasks:', list);

        const matchesProject = (t: any) => {
          if (!projectId) return true;
          if (t.project === projectId) return true;
          if (t.projectId === projectId) return true;
          if (t.project && typeof t.project === 'object' && t.project._id === projectId) return true;
          return false;
        };

        const filtered = list.filter((t) => matchesProject(t) && (!statusFilter || t.status === statusFilter));
        setTasks(filtered);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch tasks:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId, statusFilter]);

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Project Tasks
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <FormControl sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={statusFilter}
          label="Status Filter"
          onChange={handleStatusFilterChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="todo">Todo</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
      </FormControl>
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {!loading && tasks.length === 0 && !error && (
        <Typography>No tasks found for this project.</Typography>
      )}
      <List>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <ListItemText
              primary={task.title}
              secondary={`Status: ${task.status} | Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ProjectDetailsPage;