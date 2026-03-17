export interface User {
  id: string;
  email: string;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: string;
  project?: { title: string } | string;   // backend may send object or just id
  projectName?: string;                  // optional fallback
}

export interface AuthResponse {
  token: string;
}