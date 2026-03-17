import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getInitial = () => (user?.email ? user.email[0].toUpperCase() : 'U');

  const getShortName = () => {
    if (!user?.email) return 'Guest';
    const [localPart] = user.email.split('@');
    return localPart.length > 14 ? localPart.slice(0, 11) + '…' : localPart;
  };

  return (
    <Fade in timeout={400}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #111827 100%)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
          backdropFilter: 'blur(8px)',
          ml: { lg: '280px' },
          width: { lg: 'calc(100% - 280px)' },
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, lg: 72 },
            px: { xs: 2, sm: 3, lg: 5 },
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: 1440,
            mx: 'auto',
            width: '100%',
            gap: 2,
            overflow: 'hidden',
            flexWrap: 'nowrap', 
          }}
        >
          {/* Left - Brand with truncation safety */}
          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.025em',
                background: 'linear-gradient(90deg, #c084fc 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: { sm: '200px', md: '260px', lg: '320px' },
              }}
            >
              Project Management System
            </Typography>
          </Box>

          {/* Right side - Guest or Logged in */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5, md: 2 },
              minWidth: 0,
              flexShrink: 0,
              justifyContent: 'flex-end',
              whiteSpace: 'nowrap',
            }}
          >
            {user ? (
              <>
                {/* Logged-in: avatar + name (md and up) */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    gap: 1.5,
                    maxWidth: '240px',
                    minWidth: 0,
                    cursor: 'pointer',
                    borderRadius: 2,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={handleClick}
                  aria-controls={open ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: 'secondary.main',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {getInitial()}
                  </Avatar>

                  <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {getShortName()}
                    </Typography>
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Signed in
                    </Typography>
                  </Box>
                </Box>

                {/* Mobile icon only */}
                <IconButton
                  size="large"
                  onClick={handleClick}
                  color="inherit"
                  sx={{ display: { md: 'none' } }}
                >
                  <AccountCircleRoundedIcon />
                </IconButton>

                {/* Menu */}
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    },
                  }}
                >
                  <MenuItem disabled sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>{getInitial()}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">{getShortName()}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/dashboard');
                    }}
                  >
                    <DashboardRoundedIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      logout();
                      navigate('/');
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <LogoutRoundedIcon sx={{ mr: 2 }} />
                    Sign out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Guest state - Sign in + Get Started
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 1.5 },
                  minWidth: 0,
                  flexShrink: 0,
                  flexWrap: 'nowrap',
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    fontWeight: 500,
                    px: { xs: 1.5, sm: 2, md: 2.5 },
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/register')}
                  sx={{
                    fontWeight: 600,
                    px: { xs: 2, sm: 2.5, md: 3 },
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(168, 85, 247, 0.3)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Fade>
  );
};

export default Navbar;