import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const ProtectedLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, sm: '250px' }, // Offset for Sidebar width
          width: { xs: '100%', sm: 'calc(100% - 250px)' }, // Adjust content width
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.default',
          }}
        >
          <Outlet /> {/* Renders child routes like DashboardPage, ProjectDetailsPage */}
        </Box>
      </Box>
    </Box>
  );
};

export default ProtectedLayout;