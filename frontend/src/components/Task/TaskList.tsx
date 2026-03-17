import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Box,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  projectMap: { [key: string]: string }; // Map of projectId to project title
}

const TaskList: React.FC<Props> = ({ tasks, onEdit, onDelete, projectMap }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Minimum 5 data per page

  const statusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return '#ff9800';
      case 'in-progress':
        return '#d32f2f';
      case 'done':
        return '#4caf50';
      default:
        return '#94817f';
    }
  };

  const projectName = (task: Task) => {
    if (task.projectName) return task.projectName;
    if (typeof task.project === 'string') return projectMap[task.project] || task.project;
    if (task.project && typeof task.project === 'object' && 'title' in task.project)
      return (task.project as { title: string }).title;
    return 'Independent';
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated tasks
  const paginatedTasks = tasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      {tasks.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              width: '100%',
              borderRadius: 3,
              bgcolor: '#2a2a2a',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              border: '1px solid rgba(169,170,171,0.2)',
              transition: 'all 0.3s ease',
              mb: 2,
            }}
          >
            <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      bgcolor: '#434142',
                      border: 'none',
                      py: 2.5,
                      px: 3,
                      width: '20%',
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      bgcolor: '#434142',
                      border: 'none',
                      py: 2.5,
                      px: 3,
                      width: '15%',
                    }}
                  >
                    Project
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      bgcolor: '#434142',
                      border: 'none',
                      py: 2.5,
                      px: 3,
                      width: '30%',
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      bgcolor: '#434142',
                      border: 'none',
                      py: 2.5,
                      px: 3,
                      width: '15%',
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      bgcolor: '#434142',
                      border: 'none',
                      py: 2.5,
                      px: 3,
                      width: '15%',
                    }}
                  >
                    Due Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      bgcolor: '#434142',
                      border: 'none',
                      py: 2.5,
                      px: 3,
                      width: '10%',
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTasks.map((task) => (
                  <TableRow
                    key={task._id}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(169,170,171,0.15)',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease',
                      },
                      '& .MuiTableCell-root': { borderBottom: '1px solid rgba(169,170,171,0.1)', py: 2, px: 3 },
                    }}
                  >
                    <TableCell sx={{ color: '#a9aaab', fontWeight: 500, fontSize: '0.9rem' }}>
                      {task.title || 'Untitled'}
                    </TableCell>
                    <TableCell sx={{ color: '#a9aaab', fontWeight: 500, fontSize: '0.9rem' }}>
                      {projectName(task)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#a9aaab',
                        fontSize: '0.9rem',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        maxWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status || 'Unknown'}
                        sx={{
                          bgcolor: statusColor(task.status),
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          borderRadius: '12px',
                          px: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#a9aaab', fontSize: '0.9rem' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => onEdit(task)}
                        sx={{
                          color: '#a9aaab',
                          '&:hover': { bgcolor: 'rgba(169,170,171,0.3)', transform: 'scale(1.1)' },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(task._id)}
                        sx={{
                          color: '#d4756e',
                          '&:hover': { bgcolor: 'rgba(212,117,110,0.3)', transform: 'scale(1.1)' },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination - Background Color Removed */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={tasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: '#a9aaab',
              borderRadius: 3,
              border: '1px solid rgba(169,170,171,0.2)',
              '& .MuiTablePagination-toolbar': {
                color: '#a9aaab',
                // Background color removed from toolbar
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: '#a9aaab',
                fontSize: '0.875rem',
              },
              '& .MuiTablePagination-actions': {
                color: '#a9aaab',
              },
              '& .MuiSelect-select': {
                color: '#a9aaab',
              },
              '& .MuiSvgIcon-root': {
                color: '#a9aaab',
              },
            }}
          />
        </>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            my: 4,
            p: 4,
            bgcolor: '#2a2a2a',
            borderRadius: 3,
            border: '1px solid rgba(169,170,171,0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <Typography sx={{ color: '#a9aaab', fontSize: '1.1rem', fontWeight: 500 }}>
            No tasks found. Create a task to get started!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TaskList;