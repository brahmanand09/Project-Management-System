import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short').required('Required'),
});

export const registerSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short').required('Required'),
});

export const projectSchema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  status: Yup.string().oneOf(['active', 'completed']).required('Required'),
});

export const taskSchema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  status: Yup.string().oneOf(['todo', 'in-progress', 'done']).required('Required'),
  dueDate: Yup.date().required('Required'),
});