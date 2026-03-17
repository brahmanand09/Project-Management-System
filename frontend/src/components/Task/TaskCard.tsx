// TaskCard.tsx (Minor tweaks for consistency, no major changes)
import React from 'react';
import { Card, CardContent, Typography, Chip, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types';

const TaskCard: React.FC<{ task: Task; onEdit: () => void; onDelete: () => void }> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return '#ff9800'; // Saffron (orange)
      case 'in-progress':
        return '#d32f2f'; // Red
      case 'done':
        return '#4caf50'; // Green
      default:
        return '#94817f'; // Fallback to theme primary
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(169, 170, 171, 0.2)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          borderColor: 'primary.light',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#ffffff',
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#a9aaab',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </Typography>
        <Chip
          label={task.status}
          sx={{
            bgcolor: getStatusColor(task.status),
            color: '#ffffff',
            fontWeight: 500,
            borderRadius: 2,
            mb: 2,
          }}
        />
        <Typography variant="body2" sx={{ color: '#a9aaab', mb: 2 }}>
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={onEdit}
            sx={{
              color: '#a9aaab',
              '&:hover': {
                bgcolor: 'rgba(169, 170, 171, 0.2)',
              },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={onDelete}
            sx={{
              color: '#d4756e',
              '&:hover': {
                bgcolor: 'rgba(212, 117, 110, 0.2)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;