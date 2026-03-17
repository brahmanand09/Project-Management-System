import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginForm';
import RegisterPage from './components/Auth/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectForm from './components/Project/ProjectForm';
import TaskForm from './components/Task/TaskForm';
import TasksPage from './pages/TasksPage';
import ProtectedLayout from './components/Layout/ProtectedLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects/view" element={<DashboardPage />} />
          <Route path="/projects/create" element={<ProjectFormWrapper />} />
          <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/create" element={<TaskFormWrapper />} />
          <Route path="/tasks/edit/:taskId" element={<TasksPage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  </AuthProvider>
);

// Wrapper component for ProjectForm in create route
const ProjectFormWrapper: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  const handleSubmit = (data: any) => {
    console.log('ProjectForm submitted', data);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ProjectForm
      open={open}
      onClose={handleClose}
      initialData={{}}
      onSubmit={handleSubmit}
    />
  );
};

// Wrapper component for TaskForm in create route
const TaskFormWrapper: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  const handleSubmit = (data: any) => {
    console.log('TaskForm submitted', data);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <TaskForm
      open={open}
      onClose={handleClose}
      initialData={{}}
      onSubmit={handleSubmit}
    />
  );
};

export default App;