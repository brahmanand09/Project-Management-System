import axios from 'axios';
import { Project, Task } from '../types';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// User APIs
export const register = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/users/register`, data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/users/login`, data);
  return response.data;
};

// Project APIs
export const createProject = async (data: Omit<Project, '_id' | 'user'>) => {
  const response = await axios.post(`${API_URL}/projects`, data, { headers: getAuthHeader() });
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`, { headers: getAuthHeader() });
  return response.data;
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const response = await axios.put(`${API_URL}/projects/${id}`, data, { headers: getAuthHeader() });
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await axios.delete(`${API_URL}/projects/${id}`, { headers: getAuthHeader() });
  return response.data;
};

// Task APIs
export const createTask = async (data: Omit<Task, '_id'>) => {
  const response = await axios.post(`${API_URL}/tasks`, data, { headers: getAuthHeader() });
  return response.data;
};

export const getTasks = async (projectId?: string, status?: string) => {
  const params: { projectId?: string; status?: string } = {};
  if (projectId) params.projectId = projectId;
  if (status) params.status = status;
  const response = await axios.get(`${API_URL}/tasks`, {
    params,
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, data, { headers: getAuthHeader() });
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`, { headers: getAuthHeader() });
  return response.data;
};