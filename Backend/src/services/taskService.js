const Task = require('../models/Task');
const Project = require('../models/Project');
const { taskSchema } = require('../schemas/taskSchemas');
const { TASK_STATUSES } = require('../constants/constants');
const { HTTP_STATUS_CODES } = require('../constants/http');

const createTask = async (data, userId) => {
  const parsed = taskSchema.safeParse(data);
  if (!parsed.success) throw { status: HTTP_STATUS_CODES.BAD_REQUEST, message: parsed.error.errors[0].message };

  const project = await Project.findOne({ _id: data.projectId, user: userId });
  if (!project) throw { status: HTTP_STATUS_CODES.NOT_FOUND, message: 'Project not found or not authorized' };

  return Task.create({ ...parsed.data, project: data.projectId });
};

const getTasks = async (query, userId) => {
  const { projectId, status } = query;
  if (!projectId) throw { status: HTTP_STATUS_CODES.BAD_REQUEST, message: 'projectId is required' };

  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) throw { status: HTTP_STATUS_CODES.NOT_FOUND, message: 'Project not found or not authorized' };

  let filter = { project: projectId };
  if (status) filter.status = status;

  return Task.find(filter);
};

const updateTask = async (id, data, userId) => {
  const parsed = taskSchema.safeParse(data);
  if (!parsed.success) throw { status: HTTP_STATUS_CODES.BAD_REQUEST, message: parsed.error.errors[0].message };

  const task = await Task.findById(id).populate('project');
  if (!task || task.project.user.toString() !== userId) throw { status: HTTP_STATUS_CODES.NOT_FOUND, message: 'Task not found or not authorized' };

  Object.assign(task, parsed.data);
  return task.save();
};

const deleteTask = async (id, userId) => {
  const task = await Task.findById(id).populate('project');
  if (!task || task.project.user.toString() !== userId) throw { status: HTTP_STATUS_CODES.NOT_FOUND, message: 'Task not found or not authorized' };

  return task.deleteOne();
};

module.exports = { createTask, getTasks, updateTask, deleteTask };