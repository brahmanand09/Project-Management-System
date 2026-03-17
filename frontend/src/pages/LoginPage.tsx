import React from 'react';
import { Box } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm'; // adjust path

const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: `
  radial-gradient(circle at 15% 25%, rgba(99, 102, 241, 0.18) 0%, transparent 35%),
  radial-gradient(circle at 80% 75%, rgba(168, 85, 247, 0.14) 0%, transparent 45%),
  linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)
`,
        p: { xs: 2, sm: 4 },
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage;