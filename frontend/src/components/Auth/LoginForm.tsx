import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Fade,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../types/validationSchemas'; // assuming this exists
import { loginUser } from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await loginUser(data);
      const token =
        response?.data?.data?.token ??
        response?.data?.token ??
        response?.token;

      if (!token) throw new Error('No token received from server');

      authLogin(token);
      navigate('/dashboard');
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Invalid credentials. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fade in timeout={700}>
      <Card
        elevation={0}
        sx={{
          width: { xs: '100%', sm: 420 },
          borderRadius: 4,
          bgcolor: 'background.paper',
          backdropFilter: 'blur(16px)',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 }, pb: 5 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Welcome back! Please enter your details.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {errorMessage && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}
              >
                {errorMessage}
              </Alert>
            )}

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRoundedIcon color={errors.email ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
              variant="outlined"
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon color={errors.password ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              variant="outlined"
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                href="/forgot-password"
                variant="body2"
                underline="hover"
                sx={{ fontWeight: 500 }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid || !isDirty || isLoading}
              size="large"
              sx={{
                py: 1.6,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.05rem',
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4f46e5 0%, #9333ea 100%)',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.35)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={22} color="inherit" sx={{ mr: 1.5 }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider sx={{ my: 4 }}>OR</Divider>

            <Typography variant="body2" color="text.secondary" align="center">
              Don't have an account?{' '}
              <Link
                href="/register"
                underline="hover"
                fontWeight={600}
                color="primary"
              >
                Create account
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default LoginForm;