import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openProjects, setOpenProjects] = useState(true);
  const [openTasks, setOpenTasks] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      component="nav"
      sx={{
        width: 280,
        flexShrink: 0,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', // slightly darker but still readable
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
        overflowY: 'auto',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: { xs: 'none', lg: 'block' },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#e0e7ff',           // very light indigo-white for brand
            letterSpacing: '-0.5px',
          }}
        >
          Sofrik Services
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(99, 102, 241, 0.18)', mx: 3 }} />

      <List sx={{ px: 2, pt: 2 }}>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton
            selected={isActive('/dashboard')}
            onClick={() => navigate('/dashboard')}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: 'white', // force white text
              '& .MuiListItemText-primary': {
                color: 'white !important',
                fontWeight: 500,
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(99, 102, 241, 0.22)',
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.30)' },
                '& .MuiListItemIcon-root': { color: '#c084fc' },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive('/dashboard') ? '#c084fc' : 'rgba(255,255,255,0.7)' }}>
              <DashboardRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Projects */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setOpenProjects(!openProjects)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: 'white',
              '& .MuiListItemText-primary': { color: 'white' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <AssignmentRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
            {openProjects ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openProjects} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              selected={isActive('/projects/view')}
              onClick={() => navigate('/projects/view')}
              sx={{
                pl: 5,
                borderRadius: 2,
                mb: 0.5,
                color: 'white',
                '& .MuiListItemText-primary': { color: 'white' },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.18)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.26)' },
                },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255,255,255,0.65)' }}>
                <VisibilityRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View Projects" />
            </ListItemButton>

            <ListItemButton
              selected={isActive('/projects/create')}
              onClick={() => navigate('/projects/create')}
              sx={{
                pl: 5,
                borderRadius: 2,
                mb: 0.5,
                color: 'white',
                '& .MuiListItemText-primary': { color: 'white' },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.18)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.26)' },
                },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255,255,255,0.65)' }}>
                <AddCircleRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Create Project" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Tasks - same pattern */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setOpenTasks(!openTasks)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: 'white',
              '& .MuiListItemText-primary': { color: 'white' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <AssignmentRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
            {openTasks ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openTasks} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              selected={isActive('/tasks')}
              onClick={() => navigate('/tasks')}
              sx={{
                pl: 5,
                borderRadius: 2,
                mb: 0.5,
                color: 'white',
                '& .MuiListItemText-primary': { color: 'white' },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.18)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.26)' },
                },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255,255,255,0.65)' }}>
                <VisibilityRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View Tasks" />
            </ListItemButton>

            <ListItemButton
              selected={isActive('/tasks/create')}
              onClick={() => navigate('/tasks/create')}
              sx={{
                pl: 5,
                borderRadius: 2,
                mb: 0.5,
                color: 'white',
                '& .MuiListItemText-primary': { color: 'white' },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.18)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.26)' },
                },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255,255,255,0.65)' }}>
                <AddCircleRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Create Task" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;