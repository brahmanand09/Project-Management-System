const Project = require('../models/Project');
const { projectSchema } = require('../schemas/projectSchemas');
const { PROJECT_STATUSES } = require('../constants/constants');
const { HTTP_STATUS_CODES } = require('../constants/http');

const createProject = async (data) => {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) throw { status: HTTP_STATUS_CODES.BAD_REQUEST, message: parsed.error.errors[0].message };

  return Project.create({ ...parsed.data, user: data.userId });
};

const getUserProjects = async (userId) => {
  return Project.find({ user: userId });
};

const updateProject = async (id, data, userId) => {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) throw { status: HTTP_STATUS_CODES.BAD_REQUEST, message: parsed.error.errors[0].message };

  const project = await Project.findOne({ _id: id, user: userId });
  if (!project) throw { status: HTTP_STATUS_CODES.NOT_FOUND, message: 'Project not found' };

  Object.assign(project, parsed.data);
  return project.save();
};

const deleteProject = async (id, userId) => {
  const project = await Project.findOne({ _id: id, user: userId });
  if (!project) throw { status: HTTP_STATUS_CODES.NOT_FOUND, message: 'Project not found' };

  return project.deleteOne();
};

module.exports = { createProject, getUserProjects, updateProject, deleteProject };